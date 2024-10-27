<template>
  <div>
    <h1>Task List - Showing {{ currentPageTasks }} of {{ totalTasks }} tasks</h1>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.name }}</td>
          <td>{{ task.description }}</td>
          <td>{{ task.dueDate }}</td>
          <td>{{ task.status }}</td>
          <td>{{ task.createdAt }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="goToPage(metas.prev)" :disabled="!metas.prev">Previous</button>
      <span>Page {{ metas.currentPage }} of {{ metas.lastPage }}</span>
      <button @click="goToPage(metas.next)" :disabled="!metas.next">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';

interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  status: string;
  createdAt: string;
}

interface Meta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

export interface DataTableData {
  tasks: Task[];
  metas: Meta;
  current: number;
  total: number;
}

export default {
  data(): DataTableData {
    return {
      tasks: [],
      metas: {
        total: 0,
        lastPage: 1,
        currentPage: 1,
        perPage: 10,
        prev: null,
        next: null,
      },
      current: 0,
      total: 0,
    };
  },
  mounted() {
    this.fetchData(); // Fetch data when component is mounted
  },
  methods: {
    async fetchData(page = 1) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks`, {
          params: { page },
        });
        this.tasks = response.data.data;
        this.metas = response.data.meta;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    goToPage(page: number | null) {
      this.fetchData(page ?? 1);
    },
  },
  computed: {
    currentPageTasks(): number {
      return this.tasks.length;
    },
    totalTasks(): number {
      return this.metas.total;
    },
  },
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.pagination button {
  margin: 0 0.5rem;
}
</style>
