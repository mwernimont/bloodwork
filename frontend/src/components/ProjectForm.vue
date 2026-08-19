<template>
  <div id="project-form-container">
    <div id="project-form">
      <h2>{{ isEdit ? "Edit Project" : "Add Project" }}</h2>
      <input v-model="name" placeholder="Project Name" />
      <textarea
        v-model="description"
        placeholder="Project Description"
        rows="15"
      />
      <div id="project-form-actions">
        <button
          id="project-form-accept"
          class="project-form-action"
          :disabled="!isNameValid"
          @click="submit"
        >
          <CheckIcon :size="20" :stroke-width="4" />
        </button>
        <button
          id="project-form-cancel"
          class="project-form-action"
          @click="router.push('/')"
        >
          <X :size="20" :stroke-width="4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { CheckIcon, X } from "@lucide/vue";

const props = defineProps({
  project: { type: Object, default: null },
});

const router = useRouter();
const isEdit = !!props.project;
const name = ref(props.project?.name ?? "");
const description = ref(props.project?.description ?? "");
const isNameValid = computed(() => name.value.trim().length > 0);

const submit = async () => {
  if (!isNameValid.value) return;

  const url = isEdit
    ? `http://localhost:3000/projects/${props.project.id}`
    : "http://localhost:3000/projects";

  await fetch(url, {
    method: isEdit ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.value, description: description.value }),
  });
  router.push("/");
};
</script>

<style scoped lang="scss">
#project-form-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#project-form {
  background: theme.$bg-secondary;
  border: 1px solid theme.$border-default;
  padding: 20px;
  border-radius: theme.$border-radius;
  width: min(50vw, 480px);
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 {
    font-family: theme.$font-display;
    font-style: italic;
    font-weight: 500;
    color: theme.$accent-300;
    margin-bottom: 6px;
  }

  input,
  textarea {
    background: theme.$bg-tertiary;
    border: 1px solid theme.$border-default;
    color: theme.$text-primary;
    font-family: theme.$font-body;
    padding: 10px;
    border-radius: theme.$border-radius;
    max-width: 100%;
    transition: border-color 0.15s ease;

    &::placeholder {
      color: theme.$text-tertiary;
    }

    &:focus {
      outline: none;
      border-color: theme.$border-accent;
      box-shadow: 0 0 0 3px theme.$focus-ring;
    }
  }
}

#project-form-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  .project-form-action {
    width: 50%;
    padding: 10px;
    border: none;
    border-radius: theme.$border-radius;
    cursor: pointer;
    font-size: 1rem;
    color: theme.$text-primary;
    transition: filter 0.15s ease;
    &:hover:not(:disabled) {
      filter: brightness(1.12);
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}

#project-form-accept {
  background: theme.$status-ok;
}

#project-form-cancel {
  background: theme.$status-danger;
}
</style>
