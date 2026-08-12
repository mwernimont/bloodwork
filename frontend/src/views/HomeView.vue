<template>
  <div v-if="pendingDeleteId !== null" class="modal-overlay">
    <div class="modal">
      <p>Are you sure you want to delete this project?</p>
      <button @click="deleteProject(pendingDeleteId)">Yes, delete</button>
      <button @click="pendingDeleteId = null">Cancel</button>
    </div>
  </div>
  <div id="projects-container">
    <button id="add-project" @click="router.push('/add-project')">
      <Plus :size="15" />
      Add Project
    </button>
    <div v-if="projects.length > 0" id="projects">
      <template v-for="proj in projects" :key="proj.id">
        <div class="card">
          <button class="delete">
            <X :size="15" @click="pendingDeleteId = proj.id" />
          </button>
          <p>{{ proj.name }}</p>
          <p>{{ proj.description }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Plus, X } from "@lucide/vue";
const router = useRouter();
const projects = ref([]);
const pendingDeleteId = ref(null);

const deleteProject = async (id) => {
  await fetch(`http://localhost:3000/projects/${id}`, { method: "DELETE" });
  pendingDeleteId.value = null;
  projects.value = projects.value.filter((proj) => id !== proj.id);
};

onMounted(async () => {
  const res = await fetch("http://localhost:3000/projects", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  projects.value = data.content;
});
</script>

<style scoped lang="scss">
.modal-overlay {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  button {
    cursor: pointer;
  }
}

#projects-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

#add-project {
  display: flex;
  align-items: center;
  gap: 8px;
  background: theme.$bg-secondary;
  color: theme.$text-secondary;
  border-radius: theme.$border-radius;
  padding: 10px;
  border: 1px solid theme.$border-default;
  cursor: pointer;
  &:hover {
    background: theme.$accent-500;
    color: theme.$text-primary;
  }
}

#projects {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
  border: 1px solid #fff;
  padding: 10px 10px 0 10px;
  border-radius: 10px;
  p {
    padding: 0;
    margin: 0 0 10px 0;
  }
}

.delete {
  background: red;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}
</style>
