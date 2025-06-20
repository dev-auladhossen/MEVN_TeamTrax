<template>
  <div
    class="border-2 border-dashed border-gray-300 rounded-2xl p-2 text-center cursor-pointer transition hover:border-blue-500 hover:bg-blue-50"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
    :class="{ 'border-blue-500 bg-blue-50': isDragging }"
  >
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      @change="handleFiles"
      :multiple="multiple"
      :accept="accept"
    />
    <div
      v-if="!preview.length"
      class="flex flex-col items-center justify-center space-y-2"
    >
      <font-awesome-icon
        class="w-6 h-6 text-blue-500"
        icon="arrow-up-from-bracket"
      />
      <p class="text-gray-600">
        Drag & drop or
        <span class="text-blue-500 underline">click to upload</span>
      </p>
      <p class="text-xs text-gray-400">{{ accept || "Any file type" }}</p>
    </div>

    <div v-else class="grid grid-cols-4 gap-4">
      <div
        v-for="(file, index) in preview"
        :key="index"
        class="relative group border rounded-lg p-2 flex flex-col items-center text-center text-sm"
      >
        <img
          v-if="file.type.startsWith('image')"
          :src="file.url"
          class="w-full h-15 object-cover rounded-md"
          alt="preview"
        />
        <div
          v-else
          class="flex flex-col justify-center items-center h-15 w-full bg-gray-100 rounded-md text-gray-700 px-2"
        >
          <div class="text-xl">{{ getFileIcon(file) }}</div>
          <div
            class="mt-1 text-xs text-gray-700 max-w-[6rem] truncate"
            :title="file.name"
          >
            {{ file.name }}
          </div>
        </div>
        <button
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
          @click.stop="removeFile(index)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["files-selected"]);

const fileInput = ref(null);
const preview = ref([]);
const isDragging = ref(false);

const props = defineProps({
  multiple: { type: Boolean, default: true },
  accept: { type: String, default: "" },
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFiles = (e) => {
  const files = Array.from(e.target.files);
  processFiles(files);
};

const handleDrop = (e) => {
  isDragging.value = false;
  const files = Array.from(e.dataTransfer.files);
  processFiles(files);
};

const processFiles = (files) => {
  for (let file of files) {
    const url = file.type.startsWith("image") ? URL.createObjectURL(file) : "";
    preview.value.push({ file, url, name: file.name, type: file.type });
  }
  emit(
    "files-selected",
    preview.value.map((p) => p.file)
  );
};

const removeFile = (index) => {
  preview.value.splice(index, 1);
};

const getFileIcon = (file) => {
  const ext = file.name.split(".").pop().toLowerCase();

  if (file.type.startsWith("image")) return "🖼️";
  if (file.type.startsWith("video")) return "🎬";
  if (file.type.startsWith("audio")) return "🎵";
  if (ext === "pdf") return "📄";
  if (["doc", "docx"].includes(ext)) return "📄";
  if (["xls", "xlsx"].includes(ext)) return "📊";
  if (["ppt", "pptx"].includes(ext)) return "📽️";
  if (["zip", "rar", "7z"].includes(ext)) return "🗜️";
  if (["txt", "md"].includes(ext)) return "📃";
  return "📁";
};
</script>
