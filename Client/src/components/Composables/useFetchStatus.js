import { ref } from "vue";

export function useFetchStatus() {
  const statusList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchStatus = async () => {
    if (statusList.value.length) return;
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch("http://localhost:5000/api/status");
      const data = await res.json();
      statusList.value = data;
      console.log("statusList.value", statusList.value);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    statusList,
    loading,
    error,
    fetchStatus,
  };
}
