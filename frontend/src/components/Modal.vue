<template>
  <div class="modal-overlay">
    <div class="modal">
      <p>{{ message }}</p>
      <button @click="$emit('confirm')">Yes, delete</button>
      <button @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>
<script setup>
defineProps({
  message: { type: String, required: true },
});
defineEmits(["confirm", "cancel"]);
</script>
<style lang="scss" scoped>
.modal-overlay {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  button {
    cursor: pointer;
  }
}
</style>
