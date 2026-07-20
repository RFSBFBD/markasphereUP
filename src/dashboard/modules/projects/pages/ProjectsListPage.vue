<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/dashboard/modules/projects/stores/projectsStore'
import { useToast } from '@/dashboard/composables/useToast'
import ProjectsTable from '@/dashboard/modules/projects/components/ProjectsTable.vue'
import ProjectFilters from '@/dashboard/modules/projects/components/ProjectFilters.vue'
import DeleteDialog from '@/dashboard/modules/projects/components/DeleteDialog.vue'

const router = useRouter()
const store = useProjectsStore()
const toast = useToast()
const { projects, loading, pagination, filters } = storeToRefs(store)
const pendingDelete = ref(null)

onMounted(() => store.loadProjects())

watch(
  () => ({
    search: filters.value.search,
    category: filters.value.category,
    published: filters.value.published,
    featured: filters.value.featured,
  }),
  () => store.loadProjects()
)

function openCreate() {
  router.push({ name: 'dashboard-projects-create' })
}
function confirmDelete() {
  const p = pendingDelete.value
  pendingDelete.value = null
  store
    .deleteProject(p.id)
    .then(() => toast.success('تم حذف المشروع'))
    .catch((e) => toast.error(e.message || 'فشل الحذف'))
}
function togglePublish(p) {
  store[p.published ? 'unpublishProject' : 'publishProject'](p.id)
    .then(() => toast.success('تم التحديث'))
    .catch((e) => toast.error(e.message))
}
function toggleFeatured(p) {
  store.toggleFeatured(p.id)
    .then(() => toast.success('تم التحديث'))
    .catch((e) => toast.error(e.message))
}
function goPage(p) {
  if (p >= 1 && p <= pagination.value.pages) {
    store.setPage(p)
    store.loadProjects()
  }
}
</script>

<template>
  <section>
    <div class="list-head">
      <div>
        <h2 class="list-title">المشاريع</h2>
        <p class="list-sub">إدارة مشاريع البورتفوليو المعروضة في الموقع.</p>
      </div>
      <button class="ds-btn is-primary" type="button" @click="openCreate">
        <span class="plus">+</span> مشروع جديد
      </button>
    </div>

    <ProjectFilters />

    <ProjectsTable
      :projects="projects"
      :loading="loading"
      @toggle-publish="togglePublish"
      @toggle-featured="toggleFeatured"
      @delete="pendingDelete = $event"
    />

    <div v-if="!loading && pagination.pages > 1" class="pager">
      <button class="ds-btn" type="button" :disabled="pagination.page <= 1" @click="goPage(pagination.page - 1)">السابق</button>
      <span class="pager__info">صفحة {{ pagination.page }} من {{ pagination.pages }}</span>
      <button class="ds-btn" type="button" :disabled="pagination.page >= pagination.pages" @click="goPage(pagination.page + 1)">التالي</button>
    </div>

    <DeleteDialog
      :project="pendingDelete ? pendingDelete : null"
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </section>
</template>

<style scoped>
.list-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.list-title { margin: 0; font-size: 22px; font-weight: 800; }
.list-sub { margin: 4px 0 0; color: var(--ds-text-muted); font-size: 13.5px; }
.plus { font-size: 17px; font-weight: 800; margin-inline-end: 2px; }
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 16px;
}
.pager__info { font-size: 13.5px; color: var(--ds-text-muted); font-weight: 600; }
</style>
