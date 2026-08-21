<template>
  <DynamicForm v-if="project" schema-name="projects" :project="project" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import DynamicForm from "@/components/DynamicForm.vue";

const route = useRoute();
const project = ref(null);

onMounted(async () => {
  const res = await fetch(`http://localhost:3000/projects/${route.params.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  project.value = await res.json();
});
</script>
