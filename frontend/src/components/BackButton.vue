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
  border: none;
  background: #fff;
  padding: 0 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background: darkgray;
    color: #fff;
  }
}
</style>
