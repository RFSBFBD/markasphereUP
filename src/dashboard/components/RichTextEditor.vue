<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import EditorToolbar from './EditorToolbar.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'اكتب المحتوى هنا...' },
  dir: { type: String, default: 'rtl' },
})
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  extensions: [
    StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
    Underline,
    Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener', target: '_blank' } }),
  ],
  content: props.modelValue || '',
  onUpdate: ({ editor }) => emit('update:modelValue', editor.getHTML()),
})

watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && val !== editor.value.getHTML()) {
      editor.value.commands.setContent(val || '', false)
    }
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="rich-editor">
    <EditorToolbar :editor="editor" />
    <div class="rich-editor__content" :dir="dir">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<style scoped>
.rich-editor { border: 1px solid var(--ds-border); border-radius: 12px; overflow: hidden; }
.rich-editor__content {
  background: var(--ds-surface); padding: 14px 16px; min-height: 260px;
}
.rich-editor__content :deep(.ProseMirror) {
  outline: none; min-height: 240px; line-height: 1.8; font-size: 15px; color: var(--ds-text);
}
.rich-editor__content :deep(.ProseMirror) p { margin: 0 0 0.8em; }
.rich-editor__content :deep(.ProseMirror) h1 { font-size: 1.8em; font-weight: 900; margin: 0.4em 0; }
.rich-editor__content :deep(.ProseMirror) h2 { font-size: 1.4em; font-weight: 800; margin: 0.4em 0; }
.rich-editor__content :deep(.ProseMirror) h3 { font-size: 1.18em; font-weight: 700; margin: 0.4em 0; }
.rich-editor__content :deep(.ProseMirror) ul,
.rich-editor__content :deep(.ProseMirror) ol { padding-inline-start: 1.4em; margin: 0 0 0.8em; }
.rich-editor__content :deep(.ProseMirror) blockquote {
  border-inline-start: 4px solid var(--ds-primary); padding: 4px 14px; margin: 0 0 0.8em;
  color: var(--ds-text-muted); background: var(--ds-surface-2); border-radius: 0 8px 8px 0;
}
.rich-editor__content :deep(.ProseMirror) a { color: var(--ds-primary); text-decoration: underline; }
.rich-editor__content :deep(.ProseMirror) pre {
  background: #0f1116; color: #e6e6e6; padding: 12px 14px; border-radius: 10px; overflow: auto;
}
.rich-editor__content :deep(.ProseMirror) hr { border: none; border-top: 1px solid var(--ds-border); margin: 1em 0; }
</style>
