<template>
  <div>
    <h1>Task List - Showing {{ currentPageTasks }} of {{ totalTasks }} tasks</h1>
    <div class="dev-tools">
      <input type="text" v-model="searchQuery" @input="search" placeholder="Search task" />
      <button @click="seedData" class="seed-button" :disabled="isSeeding">Seed Data</button>
      <button @click="deleteAllData">Delete all data</button>

    </div>
    <table border="1">
      <thead>
        <tr>
          <th @click="sortByCol('id')">ID</th>
          <th @click="sortByCol('name')">Name</th>
          <th>Description</th>
          <th @click="sortByCol('dueDate')">Due Date</th>
          <th>Status</th>
          <th @click="sortByCol('createdAt')">Created At</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.name }}</td>
          <td>{{ task.description }}</td>
          <td>{{ formatDate(task.dueDate, false) }}</td>
          <td>{{ task.status }}</td>
          <td>{{ formatDate(task.createdAt) }}</td>
          <td><button @click="editTask(task.id)">Edit</button></td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="goToPage(metas.prev ?? 1)" :disabled="!metas.prev">Previous</button>
      <span>Page {{ metas.currentPage }} of {{ metas.lastPage }}</span>
      <button @click="goToPage(metas.next ?? 1)" :disabled="!metas.next">Next</button>
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
  sortOrder: 'asc' | 'desc';
  sortBy: string;
  searchQuery: string;
  page: number;
  isSeeding: boolean;
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
      sortOrder: 'desc',
      sortBy: 'id',
      searchQuery: '',
      page: 1,
      isSeeding: false,
    };
  },
  mounted() {
    this.fetchData(); // Fetch data when component is mounted
  },
  methods: {
    async fetchData(page: number = 1) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks`, {
          params: { page, sortBy: this.sortBy, sortOrder: this.sortOrder, search: this.searchQuery },
        });
        this.tasks = response.data.data;
        this.metas = response.data.meta;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    goToPage(page: number = 1) {
      this.page = page;
      this.fetchData(page);
    },
    search(e: Event) { // TODO: add debounce
      this.searchQuery = (e.target as HTMLInputElement).value;
      this.fetchData();
    },
    sortByCol(column: string) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortBy = column;
      this.fetchData(this.metas.currentPage);
    },
    editTask(id: number) {
      this.$router.push({ name: 'EditTask', params: { id } });
    },
    formatDate(date: string, includeTime = true): string {
      const dateObj = new Date(Number(date));
      const month = dateObj.getMonth().toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');

      if (!includeTime) {
        return `${dateObj.getFullYear()}-${month}-${day}`;
      }

      return `${dateObj.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
    },
    async seedData() {
      this.isSeeding = true;

      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks/seed`);
        this.fetchData();
      } catch (error) {
        console.error('Error seeding data:', error);
      } finally {
        this.isSeeding = false;
      }
    },
    async deleteAllData() {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks`);
        this.fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  },
  computed: {
    currentPageTasks(): number {
      return this.tasks.length;
    },
    totalTasks(): number {
      return this.metas.total;
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.pagination button {
  margin: 0 0.5rem;
}

.dev-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.seed-button {
  margin-left: auto;
}

.dev-tools button {
  margin-right: 3px;
}
</style>
