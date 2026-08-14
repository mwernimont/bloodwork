<template>
  <div v-if="project" id="project-container">
    <BackButton />
    <h1>{{ project.name }}</h1>
    <p>{{ project.description }}</p>
    <div id="project-materials">
      <div id="project-characters" class="project-material">Characters</div>
      <div id="project-world" class="project-material">World</div>
      <div id="project-writings" class="project-material">Writings</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import BackButton from "@/components/BackButton.vue";

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
<style lang="scss" scoped>
#project-container {
  min-height: 100vh;
  max-width: 900px;
  margin: 0 auto;
  padding: 50px 0;
}

#project-materials {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.project-material {
  border: 1px solid #fff;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background: #fff;
    color: #000;
  }
}
</style>
