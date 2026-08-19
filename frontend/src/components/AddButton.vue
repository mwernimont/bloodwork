<template>
  <button class="add-project" @click="router.push(route)">
    <Plus :size="15" />
    Add {{ label }}
  </button>
</template>
<script setup>
import { useRouter } from "vue-router";
import { Plus } from "@lucide/vue";
const props = defineProps({
  route: { type: String, required: true },
  label: { type: String, required: true },
});

const router = useRouter();
</script>
<style lang="scss" scoped>
.add-project {
  display: flex;
  align-items: center;
  gap: 8px;
  background: theme.$accent-500;
  color: theme.$text-primary;
  font-weight: 600;
  border-radius: theme.$border-radius;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
  &:hover {
    background: theme.$accent-700;
  }
}
</style>
