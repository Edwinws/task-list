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
      },
      current: 0,
      total: 0,
    };
  },
  mounted() {
    this.fetchData(); // Fetch data when component is mounted
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_BASE_URL + "/tasks");
        this.tasks = response.data.data;
        this.metas = response.data.meta;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
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
