<template>
 <div id="projects-container">
  <div v-if="!projects" id="projects-empty">
    <button @click="router.push('/add-project')">
      <Plus :size="20" />
      Add Project
    </button>
  </div>
  <div v-else id="projects"></div>
 </div>
</template>

<script setup>
import {ref} from "vue";
import { useRouter } from 'vue-router'
import { Plus } from "@lucide/vue";
const router = useRouter()
const projects = ref(false)
</script>

<style scoped lang="scss">
#projects-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

#projects-empty{
  button{
    display: flex;
    align-items: center;
    gap: 8px;
    background: theme.$bg-secondary;
    color:  theme.$text-secondary;
    font-size: 2rem;
    border-radius: theme.$border-radius;
    padding: 10px;
    border: 1px solid theme.$border-default;
    cursor: pointer;
    &:hover{
      background: theme.$accent-500;
      color:  theme.$text-primary;
    }
  }
}
</style>
