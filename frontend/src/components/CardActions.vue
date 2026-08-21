<template>
  <div class="card-actions">
    <button class="card-option" aria-label="Edit" @click.stop="$emit('edit')">
      <Pencil :size="15" />
    </button>
    <span class="divider" />
    <button
      class="card-option delete"
      aria-label="Delete"
      @click.stop="$emit('confirmDelete')"
    >
      <Trash2 :size="15" />
    </button>
  </div>
</template>
<script setup>
import { Trash2, Pencil } from "@lucide/vue";
defineEmits(["edit", "confirmDelete"]);
</script>
<style lang="scss" scoped>
.card-actions {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: theme.$border-radius;
  background: theme.$bg-tertiary;
  border: 1px solid theme.$border-subtle;
}

.divider {
  width: 1px;
  height: 14px;
  background: theme.$border-default;
}

.card-option {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  border-radius: calc(theme.$border-radius - 3px);
  background: transparent;
  color: theme.$text-tertiary;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease;
  &:hover {
    background: theme.$bg-hover;
    color: theme.$text-primary;
  }
  &:active {
    transform: scale(0.9);
  }
}

.delete:hover {
  background: rgba(theme.$status-danger, 0.2);
  color: theme.$status-danger;
}
</style>
