<template>
  <button @click="goBack"><MoveLeft /></button>
</template>
<script setup>
import { MoveLeft } from "@lucide/vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push("/");
  }
}
</script>
<style lang="scss" scoped>
button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid theme.$border-default;
  background: theme.$bg-secondary;
  color: theme.$text-secondary;
  padding: 8px;
  border-radius: theme.$border-radius;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  &:hover {
    background: theme.$bg-hover;
    color: theme.$text-primary;
  }
}
</style>
