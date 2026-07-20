<script setup>
const props = defineProps({
  editor: { type: Object, default: null },
})
const emit = defineEmits(['unlink'])

function run(command) {
  if (!props.editor) return
  command(props.editor.chain().focus()).run()
}

function toggleLink() {
  if (!props.editor) return
  if (props.editor.isActive('link')) {
    props.editor.chain().focus().unsetLink().run()
    emit('unlink')
    return
  }
  const url = window.prompt('أدخل رابط الرابط (URL):')
  if (!url) return
  props.editor.chain().focus().setLink({ href: url }).run()
}
</script>

<template>
  <div class="editor-toolbar" v-if="editor">
    <button type="button" class="tb-btn" :class="{ active: editor.isActive('bold') }"
      title="غامق" @mousedown.prevent="run(e => e.toggleBold())"><b>B</b></button>
    <button type="button" class="tb-btn" :class="{ active: editor.isActive('italic') }"
      title="مائل" @mousedown.prevent="run(e => e.toggleItalic())"><i>I</i></button>
    <button type="button" class="tb-btn" :class="{ active: editor.isActive('underline') }"
      title="تسطير" @mousedown.prevent="run(e => e.toggleUnderline())"><u>U</u></button>
    <button type="button" class="tb-btn" :class="{ active: editor.isActive('strike') }"
      title="يتوسطه خط" @mousedown.prevent="run(e => e.toggleStrike())"><s>S</s></button>

    <span class="tb-sep" />

    <select class="tb-select" :value="editor.isActive('heading', { level: 1 }) ? 1
      : editor.isActive('heading', { level: 2 }) ? 2
      : editor.isActive('heading', { level: 3 }) ? 3 : 0"
      @change="(ev) => {
        const lvl = Number(ev.target.value)
        if (lvl === 0) editor.chain().focus().setParagraph().run()
        else editor.chain().focus().toggleHeading({ level: lvl }).run()
      }">
      <option value="0">فقرة</option>
      <option value="1">عنوان 1</option>
      <option value="2">عنوان 2</option>
      <option value="3">عنوان 3</option>
    </select>

    <span class="tb-sep" />

    <button type="button" class="tb-btn" :class="{ active: editor.isActive('bulletList') }"
      title="قائمة نقطية" @mousedown.prevent="run(e => e.toggleBulletList())">• ☰</button>
    <button type="button" class="tb-btn" :class="{ active: editor.isActive('orderedList') }"
      title="قائمة مرقمة" @mousedown.prevent="run(e => e.toggleOrderedList())">1. ☰</button>
    <button type="button" class="tb-btn" :class="{ active: editor.isActive('blockquote') }"
      title="اقتباس" @mousedown.prevent="run(e => e.toggleBlockquote())">❝</button>
    <button type="button" class="tb-btn" :class="{ active: editor.isActive('code') }"
      title="كود" @mousedown.prevent="run(e => e.toggleCode())">&lt;/&gt;</button>
    <button type="button" class="tb-btn"
      title="خط فاصل" @mousedown.prevent="run(e => e.setHorizontalRule())">―</button>

    <span class="tb-sep" />

    <button type="button" class="tb-btn" :class="{ active: editor.isActive('link') }"
      title="رابط" @mousedown.prevent="toggleLink">🔗</button>

    <span class="tb-sep" />

    <button type="button" class="tb-btn" title="تراجع"
      :disabled="!editor.can().undo()" @mousedown.prevent="run(e => e.undo())">↶</button>
    <button type="button" class="tb-btn" title="إعادة"
      :disabled="!editor.can().redo()" @mousedown.prevent="run(e => e.redo())">↷</button>
  </div>
</template>

<style scoped>
.editor-toolbar {
  display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
  padding: 8px; border: 1px solid var(--ds-border); border-radius: 12px 12px 0 0;
  background: var(--ds-surface-2);
}
.tb-btn {
  min-width: 34px; height: 34px; padding: 0 8px; border-radius: 8px;
  border: 1px solid var(--ds-border); background: var(--ds-surface); color: var(--ds-text);
  cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; justify-content: center;
}
.tb-btn:hover { border-color: var(--ds-primary); }
.tb-btn.active { background: var(--ds-primary); border-color: var(--ds-primary); color: #fff; }
.tb-btn:disabled { opacity: .4; cursor: not-allowed; }
.tb-select {
  height: 34px; border-radius: 8px; border: 1px solid var(--ds-border);
  background: var(--ds-surface); color: var(--ds-text); padding: 0 8px; font-size: 13px;
}
.tb-sep { width: 1px; height: 22px; background: var(--ds-border); margin: 0 2px; }
</style>
