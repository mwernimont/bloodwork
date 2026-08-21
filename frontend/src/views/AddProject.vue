<template>
  <DynamicForm
    schema-name="projects"
    endpoint="http://localhost:3000/projects"
  />
</template>

<script setup>
import DynamicForm from "@/components/DynamicForm.vue";
</script>
