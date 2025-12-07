<template>
  <div>
    <h2>Tasks</h2>

    <b-row class="mb-3">
      <b-col md="3">
        <b-form-group label="Filter by Subject">
          <b-form-select v-model="filters.subjectId" :options="subjectOptions" />
        </b-form-group>
      </b-col>
      <b-col md="3">
        <b-form-group label="Status">
          <b-form-select v-model="filters.status" :options="statusOptions" />
        </b-form-group>
      </b-col>
      <b-col md="3">
        <b-form-group label="Priority">
          <b-form-select v-model="filters.priorityLevelId" :options="priorityOptions" />
        </b-form-group>
      </b-col>
      <b-col md="3" class="d-flex align-items-end">
        <b-button variant="primary" class="me-2" @click="loadTasks">Apply</b-button>
        <b-button variant="secondary" @click="resetFilters">Reset</b-button>
      </b-col>
    </b-row>

    <b-button variant="success" class="mb-3" @click="openCreate">
      Add Task
    </b-button>

    <b-table :items="tasks" :fields="fields" small striped hover>
      <template #cell(priority)="{ item }">
        <span class="badge" :style="{ backgroundColor: item.priority?.color || '#6c757d' }">
          {{ item.priority?.name }}
        </span>
      </template>
      <template #cell(subject)="{ item }">
        {{ item.subject?.name }}
      </template>
      <template #cell(status)="{ item }">
        <span class="badge" :class="item.status === 'done' ? 'bg-success' : 'bg-warning'">
          {{ item.status }}
        </span>
      </template>
      <template #cell(dueDate)="{ item }">
        {{ new Date(item.dueDate).toLocaleDateString() }}
      </template>
      <template #cell(actions)="{ item }">
        <b-button size="sm" variant="primary" class="me-2" @click="openEdit(item)">Edit</b-button>
        <b-button size="sm" variant="danger" @click="remove(item)">Delete</b-button>
      </template>
    </b-table>

    <b-modal v-model="showModal" :title="editing ? 'Edit Task' : 'Add Task'" hide-footer>
  <b-form @submit.prevent="save">
    <b-form-group label="Title">
      <b-form-input v-model="form.title" required />
    </b-form-group>

    <b-form-group label="Description">
      <b-form-textarea v-model="form.description" rows="3" />
    </b-form-group>

    <b-form-group label="Subject">
      <b-form-select v-model="form.subjectId" :options="subjectOptionsForForm" required />
    </b-form-group>

    <b-form-group label="Priority">
      <b-form-select v-model="form.priorityLevelId" :options="priorityOptionsForForm" required />
    </b-form-group>

    <b-form-group label="Due Date">
      <b-form-input v-model="form.dueDate" type="date" required />
    </b-form-group>

    <b-form-group label="Status">
      <b-form-select v-model="form.status" :options="statusOptionsForForm" />
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

const tasks = ref([]);
const subjects = ref([]);
const priorities = ref([]);

const fields = ['id', 'title', 'subject', 'priority', 'dueDate', 'status', 'actions'];

const filters = ref({
  subjectId: null,
  status: null,
  priorityLevelId: null,
});

const statusOptions = [
  { value: null, text: 'All' },
  { value: 'pending', text: 'Pending' },
  { value: 'done', text: 'Done' },
];

const statusOptionsForForm = [
  { value: 'pending', text: 'Pending' },
  { value: 'done', text: 'Done' },
];

const subjectOptions = ref([{ value: null, text: 'All subjects' }]);
const priorityOptions = ref([{ value: null, text: 'All priorities' }]);

const subjectOptionsForForm = ref([]);
const priorityOptionsForForm = ref([]);

const showModal = ref(false);
const editing = ref(false);
const currentId = ref(null);

const form = ref({
  title: '',
  description: '',
  subjectId: null,
  priorityLevelId: null,
  dueDate: '',
  status: 'pending',
});

const loadSubjects = async () => {
  try {
    const res = await api.get('/subjects');
    subjects.value = res.data;
    subjectOptions.value = [
      { value: null, text: 'All subjects' },
      ...subjects.value.map((s) => ({ value: s.id, text: s.name })),
    ];
    subjectOptionsForForm.value = subjects.value.map((s) => ({ value: s.id, text: s.name }));
  } catch (err) {
    console.error(err);
    toast.error('Failed to load subjects');
  }
};

const loadPriorities = async () => {
  try {
    const res = await api.get('/priority-levels');
    priorities.value = res.data;
    priorityOptions.value = [
      { value: null, text: 'All priorities' },
      ...priorities.value.map((p) => ({ value: p.id, text: p.name })),
    ];
    priorityOptionsForForm.value = priorities.value.map((p) => ({ value: p.id, text: p.name }));
  } catch (err) {
    console.error(err);
    toast.error('Failed to load priorities');
  }
};

const buildQuery = () => {
  const params = {};
  if (filters.value.subjectId) params.subjectId = filters.value.subjectId;
  if (filters.value.status) params.status = filters.value.status;
  if (filters.value.priorityLevelId) params.priorityLevelId = filters.value.priorityLevelId;
  return params;
};

const loadTasks = async () => {
  try {
    const res = await api.get('/tasks', { params: buildQuery() });
    tasks.value = res.data;
  } catch (err) {
    console.error(err);
    toast.error('Failed to load tasks');
  }
};

const resetFilters = () => {
  filters.value = {
    subjectId: null,
    status: null,
    priorityLevelId: null,
  };
  loadTasks();
};

const openCreate = () => {
  editing.value = false;
  currentId.value = null;
  form.value = {
    title: '',
    description: '',
    subjectId: subjects.value[0]?.id || null,
    priorityLevelId: priorities.value[0]?.id || null,
    dueDate: new Date().toISOString().slice(0, 10),
    status: 'pending',
  };
  showModal.value = true;
};

const openEdit = (task) => {
  editing.value = true;
  currentId.value = task.id;
  form.value = {
    title: task.title,
    description: task.description || '',
    subjectId: task.subject?.id || null,
    priorityLevelId: task.priority?.id || null,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    status: task.status,
  };
  showModal.value = true;
};

const save = async () => {
  if (!form.value.title || form.value.title.trim().length < 2) {
    toast.error('Title must be at least 2 characters');
    return;
  }
  if (!form.value.subjectId || !form.value.priorityLevelId || !form.value.dueDate) {
    toast.error('Subject, priority, and due date are required');
    return;
  }

  const payload = {
    ...form.value,
    dueDate: new Date(form.value.dueDate).toISOString(),
  };

  try {
    if (editing.value && currentId.value) {
      await api.put(`/tasks/${currentId.value}`, payload);
      toast.success('Task updated');
    } else {
      await api.post('/tasks', payload);
      toast.success('Task created');
    }
    showModal.value = false;
    await loadTasks();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Failed to save task');
  }
};

const remove = async (task) => {
  if (!confirm(`Delete task "${task.title}"?`)) return;
  try {
    await api.delete(`/tasks/${task.id}`);
    toast.success('Task deleted');
    await loadTasks();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Failed to delete task');
  }
};

onMounted(async () => {
  await loadSubjects();
  await loadPriorities();
  await loadTasks();
});
</script>
