<template>
  <div id="form">
    <FormKitSchema :schema="schema" :data="{ onSubmit, initialValue }" />
    <div id="form-actions">
      <button id="form-action-accept" class="form-action" @click="submitForm(formId)">
        <CheckIcon :size="20" :stroke-width="4" />
      </button>
      <button
        id="form-action-cancel"
        class="form-action"
        @click="router.push('/')"
      >
        <X :size="20" :stroke-width="4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { FormKitSchema, submitForm } from "@formkit/vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { CheckIcon, X } from "@lucide/vue";

const props = defineProps({
  schemaName: { type: String, required: true },
  project: { type: Object, default: null },
});

const schema = ref([]);
const router = useRouter();
const isEdit = !!props.project;
// the schema's top-level `form` node declares its own `id`, which is what
// submitForm() needs to find the rendered <form> element in the DOM
const formId = computed(() => schema.value[0]?.id);
const initialValue = computed(() => props.project ?? {});

const onSubmit = async (data) => {
  const url = isEdit
    ? `http://localhost:3000/projects/${props.project.id}`
    : "http://localhost:3000/projects";

  await fetch(url, {
    method: isEdit ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  router.push("/");
};

onMounted(async () => {
  schema.value = (await import(`../schemas/${props.schemaName}.json`)).default;
});
</script>

<style lang="scss">
#form {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.formkit-form,
#form-actions {
  max-width: 400px;
}

.formkit-form {
  width: 100%;
  .formkit-outer {
    margin-bottom: 10px;
  }
  .formkit-messages {
    list-style: none;
    font-size: 0.8rem;
    padding: 0;
    color: theme.$status-danger;
  }
  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
  }
  textarea {
    min-height: 200px;
    max-height: 500px;
  }
}

#form-actions {
  width: 100%;
  display: flex;
  gap: 10px;
}
.form-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  cursor: pointer;
  border-radius: theme.$border-radius;
  color: theme.$text-primary;
}

#form-action-accept {
  background: theme.$status-ok;
}

#form-action-cancel {
  background: theme.$status-danger;
}
</style>
