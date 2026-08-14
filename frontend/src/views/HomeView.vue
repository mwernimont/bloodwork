<template>
  <Modal
    v-if="pendingDelete"
    :message="pendingDelete.message"
    @confirm="pendingDelete.onConfirm()"
    @cancel="cancelPendingDelete()"
  />
  <div id="projects-container">
    <button id="add-project" @click="router.push('/add-project')">
      <Plus :size="15" />
      Add Project
    </button>
    <div v-if="projects.length > 0" id="projects">
      <template v-for="proj in projects" :key="proj.id">
        <div class="card" @click="router.push(`/project/${proj.id}`)">
          <div class="card-options">
            <button class="card-option">
              <Pencil
                :size="15"
                @click.stop="router.push(`/edit-project/${proj.id}`)"
              />
            </button>
            <button class="card-option delete">
              <Trash2 :size="15" @click.stop="confirmDelete(proj)" />
            </button>
          </div>
          <div class="card-title">
            <p>{{ proj.name }}</p>
          </div>
          <div class="card-description">
            <p>{{ proj.description }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Plus, Trash2, Pencil } from "@lucide/vue";
import Modal from "@/components/Modal.vue";
import { useDeleteConfirmation } from "@/composables/useDeleteConfirmation.js";
const router = useRouter();
const projects = ref([]);
const { pendingDelete, confirmDelete, cancelPendingDelete } =
  useDeleteConfirmation({
    baseUrl: "http://localhost:3000/projects",
    list: projects,
    message: (proj) => `Delete "${proj.name}"?`,
  });

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
  border-radius: 10px;
  min-width: 250px;
  cursor: pointer;
  p {
    padding: 0;
    margin: 0;
  }
}

.card-title,
.card-description {
  padding: 10px;
}

.card-title {
  font-weight: bold;
  font-size: 1.5rem;
}

.card-options {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #fff;
}

.card-option {
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete {
  background: red;
  color: #fff;
}
</style>
