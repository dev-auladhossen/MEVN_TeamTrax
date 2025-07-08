import { ref } from "vue";

export function useFetchStatus() {
  const projectStatusList = ref([]);
  const taskStatusList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchProjectStatus = async () => {
    if (projectStatusList.value.length) return;
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch("http://localhost:5000/api/project/status");
      const data = await res.json();
      projectStatusList.value = data;
      console.log("projectStatusList.value", projectStatusList.value);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchTaskStatus = async () => {
    if (taskStatusList.value.length) return;
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch("http://localhost:5000/api/task-status/status");
      const data = await res.json();
      taskStatusList.value = data;
      console.log("taskStatusList.value", taskStatusList.value);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    projectStatusList,
    taskStatusList,
    loading,
    error,
    fetchTaskStatus,
    fetchProjectStatus,
  };
}
