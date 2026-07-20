<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTeamStore } from '@/dashboard/modules/team/stores/teamStore'
import { useToast } from '@/dashboard/composables/useToast'
import TeamTable from '@/dashboard/modules/team/components/TeamTable.vue'
import DeleteDialog from '@/dashboard/modules/team/components/DeleteDialog.vue'

const router = useRouter()
const store = useTeamStore()
const toast = useToast()
const { members, loading, pagination, filters } = storeToRefs(store)
const pendingDelete = ref(null)
const search = ref(filters.value.search)

let debounce
watch(search, (val) => {
  clearTimeout(debounce)
  debounce = setTimeout(() => store.setFilters({ search: val }), 350)
})

onMounted(() => store.loadMembers())
watch(
  () => ({ s: filters.value.search, p: filters.value.published }),
  () => store.loadMembers()
)
watch(
  () => pagination.value.page,
  () => store.loadMembers()
)

function openCreate() {
  router.push({ name: 'dashboard-team-create' })
}
function onPublished(e) {
  const v = e.target.value
  store.setFilters({ published: v === '' ? null : v === 'true' })
}
function togglePublish(m) {
  store[m.published ? 'unpublishMember' : 'publishMember'](m.id)
    .then(() => toast.success('تم التحديث'))
    .catch((e) => toast.error(e.message))
}
function onMove({ member, dir }) {
  const list = [...store.members]
  const i = list.findIndex((x) => x.id === member.id)
  const j = i + dir
  if (j < 0 || j >= list.length) return
  const ids = list.map((x) => x.id)
  ids.splice(i, 1)
  ids.splice(j, 0, member.id)
  store.reorderMembers(ids).then(() => store.loadMembers()).catch((e) => toast.error(e.message))
}
function confirmDelete() {
  const m = pendingDelete.value
  pendingDelete.value = null
  store.deleteMember(m.id).then(() => toast.success('تم حذف العضو')).catch((e) => toast.error(e.message || 'فشل الحذف'))
}
function goPage(p) {
  if (p >= 1 && p <= pagination.value.pages) {
    store.setPage(p)
    store.loadMembers()
  }
}
</script>

<template>
  <section>
    <div class="list-head">
      <div>
        <h2 class="list-title">فريق العمل</h2>
        <p class="list-sub">إدارة أعضاء الفريق المعروضين في الموقع.</p>
      </div>
      <button class="ds-btn is-primary" type="button" @click="openCreate">
        <span class="plus">+</span> عضو جديد
      </button>
    </div>

    <div class="filters">
      <div class="filters__search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input v-model="search" type="text" placeholder="بحث بالاسم أو المسمى أو البريد..." />
      </div>
      <select class="filters__select" :value="filters.published === null ? '' : String(filters.published)" @change="onPublished">
        <option value="">الحالة: الكل</option>
        <option value="true">منشور</option>
        <option value="false">مسودة</option>
      </select>
    </div>

    <TeamTable
      :members="members"
      :loading="loading"
      @toggle-publish="togglePublish"
      @move="onMove"
      @delete="pendingDelete = $event"
    />

    <div v-if="!loading && pagination.pages > 1" class="pager">
      <button class="ds-btn" type="button" :disabled="pagination.page <= 1" @click="goPage(pagination.page - 1)">السابق</button>
      <span class="pager__info">صفحة {{ pagination.page }} من {{ pagination.pages }}</span>
      <button class="ds-btn" type="button" :disabled="pagination.page >= pagination.pages" @click="goPage(pagination.page + 1)">التالي</button>
    </div>

    <DeleteDialog :count="pendingDelete ? 1 : 0" :name="pendingDelete?.name_ar" :loading="loading" @confirm="confirmDelete" @cancel="pendingDelete = null" />
  </section>
</template>

<style scoped>
.list-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.list-title { margin: 0; font-size: 22px; font-weight: 800; }
.list-sub { margin: 4px 0 0; color: var(--ds-text-muted); font-size: 13.5px; }
.plus { font-size: 17px; font-weight: 800; margin-inline-end: 2px; }
.filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
.filters__search { position: relative; flex: 1; min-width: 220px; display: flex; align-items: center; }
.filters__search svg { position: absolute; inset-inline-start: 12px; width: 18px; height: 18px; color: var(--ds-text-muted); }
.filters__search input { width: 100%; padding: 10px 38px; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-sm); background: var(--ds-surface); color: var(--ds-text); font-size: 14px; outline: none; }
.filters__search input:focus { border-color: var(--ds-primary); }
.filters__select { padding: 10px 12px; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-sm); background: var(--ds-surface); color: var(--ds-text); font-size: 13.5px; font-weight: 600; outline: none; cursor: pointer; }
.pager { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 16px; }
.pager__info { font-size: 13.5px; color: var(--ds-text-muted); font-weight: 600; }
</style>
