<template>
  <div>
    <h1>Create Task</h1>
    <form @submit.prevent="createTask">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="task.name" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <input type="text" id="description" v-model="task.description" required />
      </div>
      <div>
        <label for="dueDate">Due Date:</label>
        <input type="date" id="dueDate" v-model="task.dueDate" :min="minDueDate" required />
      </div>
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

interface Task {
  name: string;
  description: string;
  dueDate: string;
}

export default defineComponent({
  data() {
    return {
      task: {
        name: '',
        description: '',
        dueDate: '',
      } as Task,
      minDueDate: this.getTomorrowDate(),
    };
  },
  methods: {
    async createTask() {

      try {
        await axios.post(import.meta.env.VITE_BACKEND_BASE_URL + "/tasks", this.task);
        this.$router.push('/');
      } catch (error) {
        console.error('Error creating task:', error);
      }
    },
    getTomorrowDate(): string {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const day = String(tomorrow.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  },
});
</script>
