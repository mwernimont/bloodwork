<template>
  <div id="add-project-container">
    <div id="add-project">
      <h2>Add Project</h2>
      <input v-model="name" placeholder="Project Name" />
      <textarea
        v-model="description"
        placeholder="Project Description"
        rows="15"
      />
      <div id="add-project-actions">
        <button
          id="add-project-accept"
          class="add-project-action"
          @click="submitProject"
        >
          <CheckIcon :size="20" :stroke-width="4" />
        </button>
        <button
          id="add-project-cancel"
          class="add-project-action"
          @click="router.push('/')"
        >
          <X :size="20" :stroke-width="4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { CheckIcon, X } from "@lucide/vue";
const router = useRouter();
const name = ref("");
const description = ref("");

const submitProject = async () => {
  const res = await fetch("http://localhost:3000/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.value, description: description.value }),
  });
  const project = await res.json();
  router.push("/");
};
</script>

<style scoped lang="scss">
#add-project-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#add-project {
  border: 1px solid theme.$border-strong;
  padding: 10px;
  border-radius: theme.$border-radius;
  width: 50vw;
  display: flex;
  flex-direction: column;
  gap: 10px;
  input,
  textarea {
    background: theme.$bg-secondary;
    border: 1px solid theme.$border-strong;
    color: theme.$text-primary;
    padding: 10px;
    border-radius: theme.$border-radius;
    max-width: 100%;
  }
}

#add-project-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  .add-project-action {
    width: 50%;
    padding: 10px;
    border-radius: theme.$border-radius;
    cursor: pointer;
    font-size: 1rem;
    color: theme.$text-primary;
  }
}

#add-project-accept {
  background: theme.$status-ok;
}

#add-project-cancel {
  background: theme.$status-danger;
}
</style>
