<template>
  <div v-if="project" id="project-container">
    <BackButton />
    <h1>{{ project.name }}</h1>
    <p id="project-description">{{ project.description }}</p>
    <div id="project-materials">
      <div id="project-characters" class="project-material">
        <BookUser :size="22" />
        <span>Characters</span>
      </div>
      <div id="project-world" class="project-material">
        <Globe :size="22" />
        <span>World</span>
      </div>
      <div id="project-writings" class="project-material">
        <PenLine :size="22" />
        <span>Writings</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { BookUser, Globe, PenLine } from "@lucide/vue";
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
  padding: 50px 20px;

  h1 {
    font-family: theme.$font-display;
    font-style: italic;
    font-weight: 500;
    font-size: 2.5rem;
    color: theme.$accent-300;
  }
}

#project-description {
  color: theme.$text-secondary;
  max-width: 60ch;
  margin: 12px 0 40px;
}

#project-materials {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.project-material {
  border: 1px solid theme.$border-default;
  background: theme.$bg-secondary;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: theme.$text-secondary;
  border-radius: theme.$border-radius;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: theme.$border-accent;
    color: theme.$accent-300;
    background: theme.$bg-tertiary;
  }
}
</style>
