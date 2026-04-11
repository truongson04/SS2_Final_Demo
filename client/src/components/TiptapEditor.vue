<script setup>
import { useEditor, EditorContent, Extension } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { onBeforeUnmount, watch, ref } from "vue";
import { useTheme } from "../composables/useTheme";

// Custom Font Size Extension
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ""),
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Write something...",
  },
});

const emit = defineEmits(["update:modelValue"]);
const { isDark } = useTheme();

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextStyle,
    Color,
    FontSize,
  ],
  onUpdate: () => {
    emit("update:modelValue", editor.value.getHTML());
  },
  editorProps: {
    attributes: {
      class:
        "prose prose-sm focus:outline-none max-w-none px-4 py-3 min-h-[150px] transition-colors",
    },
  },
});

watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.value.getHTML() === value;
    if (isSame) return;
    editor.value.commands.setContent(value, false);
  },
);

onBeforeUnmount(() => {
  editor.value.destroy();
});

const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "30px"];
const colors = [
  "#000000", "#ffffff", "#475569", "#ef4444", "#f97316", "#f59e0b", 
  "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899"
];

const showColorPicker = ref(false);
const showSizePicker = ref(false);
</script>

<template>
  <div
    v-if="editor"
    class="border rounded-xl overflow-hidden transition-all duration-300 group relative"
    :class="
      isDark
        ? 'bg-slate-900 border-slate-700 focus-within:border-cyan-500/50 is-dark prose-invert'
        : 'bg-white border-gray-200 focus-within:border-indigo-400 shadow-sm'
    "
  >
    <!-- Tool Bar -->
    <div
      class="flex flex-wrap gap-1 p-2 border-b transition-colors items-center"
      :class="
        isDark
          ? 'border-slate-800 bg-slate-800/50'
          : 'border-gray-100 bg-gray-50/50'
      "
    >
      <!-- Basic Styles -->
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        class="p-1.5 rounded transition-colors hover:bg-slate-700/50"
        :class="{
          'bg-cyan-500/20 text-cyan-400': editor.isActive('bold'),
          'text-slate-400': !editor.isActive('bold'),
        }"
        type="button"
        title="Bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 12a4 4 0 0 0 0-8H6v8"/><path d="M15 20a4 4 0 0 0 0-8H6v8h9Z"/></svg>
      </button>

      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        class="p-1.5 rounded transition-colors hover:bg-slate-700/50"
        :class="{
          'bg-cyan-500/20 text-cyan-400': editor.isActive('italic'),
          'text-slate-400': !editor.isActive('italic'),
        }"
        type="button"
        title="Italic"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>
      </button>

      <div class="w-px h-6 mx-1 transition-colors bg-slate-700/50"></div>

      <!-- Color Picker -->
      <div class="relative">
        <button
          @click="showColorPicker = !showColorPicker; showSizePicker = false"
          class="p-1.5 rounded transition-colors hover:bg-slate-700/50 text-slate-400"
          type="button"
          title="Text Color"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M4 20h16"/><path d="m6 16 6-12 6 12"/><path d="M8 12h8"/>
          </svg>
        </button>
        <div 
          v-if="showColorPicker" 
          class="absolute top-full left-0 mt-1 p-2 rounded-lg border shadow-xl z-50 grid grid-cols-4 gap-1 min-w-[120px]"
          :class="isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'"
        >
          <button 
            v-for="color in colors" 
            :key="color"
            @click="editor.chain().focus().setColor(color).run(); showColorPicker = false"
            class="w-6 h-6 rounded-md border border-white/10"
            :style="{ backgroundColor: color }"
          ></button>
          <button 
            @click="editor.chain().focus().unsetColor().run(); showColorPicker = false"
            class="col-span-4 text-[10px] font-bold uppercase p-1 mt-1 rounded transition-colors"
            :class="isDark ? 'text-slate-400 hover:bg-slate-700/50' : 'text-slate-500 hover:bg-gray-100'"
          >Reset</button>
        </div>
      </div>

      <!-- Font Size -->
      <div class="relative">
        <button
          @click="showSizePicker = !showSizePicker; showColorPicker = false"
          class="p-1.5 rounded transition-colors hover:bg-slate-700/50 text-slate-400 text-xs font-bold"
          type="button"
          title="Font Size"
        >
          <span v-if="editor.getAttributes('textStyle').fontSize">{{ editor.getAttributes('textStyle').fontSize.replace('px', '') }}</span>
          <span v-else>Ag</span>
        </button>
        <div 
          v-if="showSizePicker" 
          class="absolute top-full left-0 mt-1 p-1 rounded-lg border shadow-xl z-50 min-w-[60px]"
          :class="isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'"
        >
          <button 
            v-for="size in fontSizes" 
            :key="size"
            @click="editor.chain().focus().setFontSize(size).run(); showSizePicker = false"
            class="w-full text-left px-2 py-1.5 text-xs hover:bg-slate-700/50 rounded transition-colors"
          >{{ size }}</button>
        </div>
      </div>

      <div class="w-px h-6 mx-1 transition-colors bg-slate-700/50"></div>

      <!-- Lists -->
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        class="p-1.5 rounded transition-colors hover:bg-slate-700/50"
        :class="{
          'bg-cyan-500/20 text-cyan-400': editor.isActive('bulletList'),
          'text-slate-400': !editor.isActive('bulletList'),
        }"
        type="button"
        title="Bullet List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
      </button>

      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        class="p-1.5 rounded transition-colors hover:bg-slate-700/50"
        :class="{
          'bg-cyan-500/20 text-cyan-400': editor.isActive('orderedList'),
          'text-slate-400': !editor.isActive('orderedList'),
        }"
        type="button"
        title="Ordered List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
      </button>

      <div class="w-px h-6 mx-1 transition-colors bg-slate-700/50"></div>

      <!-- History -->
      <button
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
        class="p-1.5 rounded transition-colors hover:bg-slate-700/50 text-slate-400 disabled:opacity-30"
        type="button"
        title="Undo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </svg>
      </button>
    </div>

    <!-- Content Area -->
    <EditorContent
      :editor="editor"
      :class="isDark ? 'prose-invert !text-white' : 'text-slate-800'"
      @click="showColorPicker = false; showSizePicker = false"
    />
  </div>
</template>

<style>
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #64748b;
  pointer-events: none;
  height: 0;
}

.is-dark .ProseMirror p.is-editor-empty:first-child::before {
  color: #94a3b8;
}

.is-dark .ProseMirror {
  color: white;
}

.ProseMirror:focus {
  outline: none;
}

.prose ul,
.prose ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.prose ul {
  list-style-type: disc;
}

.prose ol {
  list-style-type: decimal;
}

.prose strong {
  font-weight: 700;
}
</style>
