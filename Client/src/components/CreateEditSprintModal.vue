<template>
  <div class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div class="bg-white p-6 rounded w-full max-w-md">
      <h2 class="text-lg font-semibold mb-4">Create Sprint</h2>
      <form @submit.prevent="submit">
        <input
          v-model="form.name"
          class="input mb-3 w-full"
          type="text"
          placeholder="Sprint Name"
          required
        />
        <label class="block mb-1 text-sm text-gray-700">Start Date</label>
        <input
          v-model="form.startDate"
          class="input mb-3 w-full"
          type="date"
          required
        />
        <label class="block mb-1 text-sm text-gray-700">End Date</label>
        <input
          v-model="form.endDate"
          class="input mb-4 w-full"
          type="date"
          required
        />
        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="btn">Cancel</button>
          <button type="submit" class="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import axios from 'axios';

const props = defineProps({ projectId: String });
const emit = defineEmits(['close', 'saved']);

const form = reactive({
  name: '',
  startDate: '',
  endDate: '',
});

async function submit() {
  try {
    await axios.post('http://localhost:5000/api/create-sprint', {
      ...form,
      projectId: props.projectId,
    });
    emit('saved');
    emit('close');
  } catch (error) {
    console.error('Error creating sprint:', error);
    alert('Failed to create sprint');
  }
}
</script>
