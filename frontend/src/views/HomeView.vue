<template>
  <Modal
    v-if="pendingDelete"
    :message="pendingDelete.message"
    @confirm="pendingDelete.onConfirm()"
    @cancel="cancelPendingDelete()"
  />
  <div id="projects-container">
    <h1 id="projects-heading">Bloodwork</h1>
    <AddButton route="/add-project" label="Project" />
    <div v-if="projects.length > 0" id="projects">
      <template v-for="(proj, i) in projects" :key="proj.id">
        <div
          class="card"
          :style="{ animationDelay: `${i * 60}ms` }"
          @click="router.push(`/project/${proj.id}`)"
        >
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
    <p v-else id="empty-state">No projects yet — start your first one.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Trash2, Pencil } from "@lucide/vue";
import Modal from "@/components/Modal.vue";
import AddButton from "@/components/AddButton.vue";
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
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 40px 20px;
}

#projects-heading {
  font-size: 2.75rem;
  font-style: italic;
  font-weight: 500;
  color: theme.$accent-300;
  letter-spacing: 0.5px;
}

#empty-state {
  color: theme.$text-tertiary;
  font-style: italic;
}

#projects {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: min(100%, 420px);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  background: theme.$bg-secondary;
  border: 1px solid theme.$border-default;
  border-radius: theme.$border-radius;
  cursor: pointer;
  animation: card-in 0.35s ease backwards;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
  p {
    padding: 0;
    margin: 0;
  }
  &:hover {
    border-color: theme.$border-accent;
    background: theme.$bg-tertiary;
  }
}

.card-title,
.card-description {
  padding: 10px 14px;
}

.card-title p {
  font-family: theme.$font-display;
  font-weight: 600;
  font-size: 1.4rem;
  color: theme.$text-primary;
}

.card-description p {
  color: theme.$text-secondary;
  font-size: 0.9rem;
}

.card-options {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  padding: 8px;
  border-bottom: 1px solid theme.$border-subtle;
}

.card-option {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: theme.$text-tertiary;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
  &:hover {
    background: theme.$bg-hover;
    color: theme.$text-primary;
  }
}

.delete:hover {
  background: rgba(theme.$status-danger, 0.2);
  color: theme.$status-danger;
}
</style>
