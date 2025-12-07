<template>
  <div>
    <h2 class="mb-4">Dashboard</h2>

    <!-- Summary cards -->
    <b-row class="mb-4">
      <b-col md="4" class="mb-3">
        <b-card title="Total Tasks">
          <h3>{{ totalTasks }}</h3>
        </b-card>
      </b-col>
      <b-col md="4" class="mb-3">
        <b-card title="Completed Tasks">
          <h3>{{ completedTasks }}</h3>
        </b-card>
      </b-col>
      <b-col md="4" class="mb-3">
        <b-card title="Completion Rate">
          <h3>{{ completionRate }}%</h3>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6" class="mb-4">
        <b-card title="Tasks per Subject">
          <Bar v-if="tasksPerSubjectData.labels.length" :data="tasksPerSubjectData" :options="chartOptions" />
          <p v-else class="text-muted mb-0">No tasks yet. Add some tasks to see this chart.</p>
        </b-card>
      </b-col>

      <b-col md="6" class="mb-4">
        <b-card title="Task Status">
          <Doughnut v-if="statusChartData.datasets[0].data.some(v => v > 0)" :data="statusChartData" :options="chartOptions" />
          <p v-else class="text-muted mb-0">No tasks yet. Add some tasks to see this chart.</p>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12" class="mb-4">
        <b-card title="Upcoming Deadlines">
          <Line v-if="upcomingDeadlinesData.labels.length" :data="upcomingDeadlinesData" :options="chartOptions" />
          <p v-else class="text-muted mb-0">No upcoming deadlines.</p>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>




<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';

// vue-chartjs + chart.js setup
import {
  Chart as ChartJS,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  LineController,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

import { Bar, Doughnut, Line } from 'vue-chartjs';

ChartJS.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  LineController,
  Tooltip,
  Legend,
  Title
);

const subjects = ref([]);
const tasks = ref([]);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const SUBJECT_COLORS = [
  "steelblue",
  "orange",
  "tomato",
  "mediumseagreen",
  "gold",
  "purple",
  "skyblue",
  "pink",
];

// Load data from backend
const loadSubjects = async () => {
  const res = await api.get('/subjects');
  subjects.value = res.data;
};

const loadTasks = async () => {
  const res = await api.get('/tasks'); // all tasks for this user
  tasks.value = res.data;
};

onMounted(async () => {
  try {
    await Promise.all([loadSubjects(), loadTasks()]);
  } catch (err) {
    console.error('Failed to load dashboard data', err);
  }
});

// ---- Summary metrics ----
const totalTasks = computed(() => tasks.value.length);

const completedTasks = computed(
  () => tasks.value.filter((t) => t.status === 'done').length
);

const completionRate = computed(() => {
  if (!totalTasks.value) return 0;
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

// ---- Chart 1: Tasks per subject (bar) ----
const tasksPerSubjectData = computed(() => {
  if (!subjects.value.length) {
    return { labels: [], datasets: [{ data: [] }] };
  }

  const countsBySubjectId = new Map();

  tasks.value.forEach((t) => {
    const sid = t.subject?.id;
    if (!sid) return;
    countsBySubjectId.set(sid, (countsBySubjectId.get(sid) || 0) + 1);
  });

  const labels = [];
  const data = [];
  const backgroundColors = [];

  subjects.value.forEach((s, i) => {
    labels.push(s.name);
    data.push(countsBySubjectId.get(s.id) || 0);
    backgroundColors.push(SUBJECT_COLORS[i % SUBJECT_COLORS.length]);
  });

  return {
    labels,
    datasets: [
      {
        label: "Tasks",
        data,
        backgroundColor: backgroundColors,
      },
    ],
  };
});


// ---- Chart 2: Status (pending vs done) ----
const statusChartData = computed(() => {
  const pending = tasks.value.filter((t) => t.status === "pending").length;
  const done = completedTasks.value;

  return {
    labels: ["Pending", "Done"],
    datasets: [
      {
        data: [pending, done],
        backgroundColor: ["orange", "mediumseagreen"], 
      },
    ],
  };
});


// ---- Chart 3: Upcoming deadlines (line) ----
const upcomingDeadlinesData = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countsByDate = new Map();

  tasks.value.forEach((t) => {
    if (!t.dueDate) return;
    const d = new Date(t.dueDate);
    d.setHours(0, 0, 0, 0);
    if (d < today) return;

    const key = d.toISOString().slice(0, 10);
    countsByDate.set(key, (countsByDate.get(key) || 0) + 1);
  });

  const sortedDates = Array.from(countsByDate.keys()).sort();
  const data = sortedDates.map((d) => countsByDate.get(d));

  return {
    labels: sortedDates,
    datasets: [
      {
        label: "Tasks due",
        data,
        borderColor: "steelblue",
        backgroundColor: "rgba(70,130,180,0.2)", // steelblue 20%
        tension: 0.25,
        pointRadius: 4,
        pointBackgroundColor: "steelblue",
      },
    ],
  };
});

</script>

<style scoped>
/* So charts have some height */
.card :deep(canvas) {
  max-height: 260px;
}
</style>
