import { ref } from "vue";

export function useDeleteConfirmation({ baseUrl, list, message }) {
  const pendingDelete = ref(null);

  function confirmDelete(item) {
    pendingDelete.value = {
      message: message(item),
      onConfirm: () => deleteItem(item),
    };
  }

  function cancelPendingDelete() {
    pendingDelete.value = null;
  }

  async function deleteItem(item) {
    const res = await fetch(`${baseUrl}/${item.id}`, { method: "DELETE" });
    if (!res.ok) return;
    list.value = list.value.filter((i) => i.id !== item.id);
    pendingDelete.value = null;
  }

  return { pendingDelete, confirmDelete, cancelPendingDelete };
}
