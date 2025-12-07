<template>
  <div>
    <h2>Subjects</h2>

    <b-button variant="success" class="mb-3" @click="openCreate">
      Add Subject
    </b-button>

    <b-table :items="subjects" :fields="fields" small striped hover>
      <template #cell(color)="{ item }">
        <span
          class="rounded-circle d-inline-block"
          :style="{
            backgroundColor: item.color,
            width: '14px',
            height: '14px'
          }"
        ></span>
        <span class="ms-2">{{ item.color }}</span>
      </template>

      <template #cell(actions)="{ item }">
        <b-button size="sm" variant="primary" class="me-2" @click="openEdit(item)">
          Edit
        </b-button>
        <b-button size="sm" variant="danger" @click="remove(item)">
          Delete
        </b-button>
      </template>
    </b-table>

    <b-modal
      v-model="showModal"
      :title="editing ? 'Edit Subject' : 'Add Subject'"
      hide-footer
    >
      <b-form @submit.prevent="save">
        <b-form-group label="Name">
          <b-form-input v-model="form.name" required />
        </b-form-group>

        <!-- COLOR DROPDOWN USING NAMES -->
        <b-form-group label="Color">
          <b-form-select
            v-model="form.color"
            :options="colorOptions"
            required
          />
        </b-form-group>

        <b-form-group label="Description">
          <b-form-textarea v-model="form.description" rows="3" />
        </b-form-group>

        <div class="d-flex justify-content-end mt-3">
          <b-button variant="secondary" class="me-2" @click="showModal = false">
            Cancel
          </b-button>
          <b-button variant="primary" type="submit">
            {{ editing ? 'Update' : 'Create' }}
          </b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import api from '../services/api';

const toast = useToast();

const subjects = ref([]);
const fields = ['id', 'name', 'color', 'description', 'actions'];

const showModal = ref(false);
const editing = ref(false);
const currentId = ref(null);

const form = ref({
  name: '',
  color: 'steelblue', // default color
  description: '',
});

// 👉 COLOR OPTIONS (NAMES ONLY)
const colorOptions = [
  { value: 'steelblue', text: 'Blue' },
  { value: 'orange', text: 'Orange' },
  { value: 'tomato', text: 'Red' },
  { value: 'mediumseagreen', text: 'Green' },
  { value: 'gold', text: 'Yellow' },
  { value: 'purple', text: 'Purple' },
  { value: 'skyblue', text: 'Sky Blue' },
  { value: 'pink', text: 'Pink' },
];

const loadSubjects = async () => {
  try {
    const res = await api.get('/subjects');
    subjects.value = res.data;
  } catch (err) {
    console.error(err);
    toast.error('Failed to load subjects');
  }
};

const openCreate = () => {
  editing.value = false;
  currentId.value = null;
  form.value = {
    name: '',
    color: 'steelblue', // default matches one of the options
    description: '',
  };
  showModal.value = true;
};

const openEdit = (subject) => {
  editing.value = true;
  currentId.value = subject.id;
  form.value = {
    name: subject.name,
    color: subject.color || 'steelblue',
    description: subject.description || '',
  };
  showModal.value = true;
};

const save = async () => {
  if (!form.value.name || form.value.name.trim().length < 2) {
    toast.error('Name must be at least 2 characters');
    return;
  }

  if (!form.value.color) {
    toast.error('Please select a color');
    return;
  }

  try {
    if (editing.value && currentId.value) {
      await api.put(`/subjects/${currentId.value}`, form.value);
      toast.success('Subject updated');
    } else {
      await api.post('/subjects', form.value);
      toast.success('Subject created');
    }
    showModal.value = false;
    await loadSubjects();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Failed to save subject');
  }
};

const remove = async (subject) => {
  if (!confirm(`Delete subject "${subject.name}"? This will remove its tasks too.`)) return;
  try {
    await api.delete(`/subjects/${subject.id}`);
    toast.success('Subject deleted');
    await loadSubjects();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Failed to delete subject');
  }
};

onMounted(() => {
  loadSubjects();
});
</script>
