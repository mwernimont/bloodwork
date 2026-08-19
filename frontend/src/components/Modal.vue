<template>
  <div class="modal-overlay">
    <div class="modal">
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button class="modal-confirm" @click="$emit('confirm')">
          Yes, delete
        </button>
        <button class="modal-cancel" @click="$emit('cancel')">Cancel</button>
      </div>
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(theme.$bg-primary, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: theme.$bg-secondary;
  border: 1px solid theme.$border-default;
  border-radius: theme.$border-radius;
  padding: 24px;
  max-width: 360px;
  text-align: center;

  p {
    margin: 0 0 18px;
    color: theme.$text-primary;
  }
}

.modal-actions {
  display: flex;
  gap: 10px;

  button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: theme.$border-radius;
    cursor: pointer;
    font-family: theme.$font-body;
    font-weight: 600;
    transition: filter 0.15s ease;
    &:hover {
      filter: brightness(1.12);
    }
  }
}

.modal-confirm {
  background: theme.$status-danger;
  color: theme.$text-primary;
}

.modal-cancel {
  background: theme.$bg-tertiary;
  color: theme.$text-secondary;
}
</style>
