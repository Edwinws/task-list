<template>
  <div>
    <h1>{{ isEditMode ? 'Edit Task' : 'Create Task' }}</h1>
    <form @submit.prevent="submit">
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
      <button type="submit">{{ isEditMode ? 'Update' : 'Create' }}</button>
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
      isEditMode: false,
      minDueDate: this.getTomorrowDate(),
    };
  },
  methods: {
    async submit() {
      try {
        if (this.isEditMode) {
          await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks/${this.$route.params.id}`, this.task);
        } else {
          await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks`, this.task);
        }
        this.$router.push('/');
      } catch (error) {
        console.error('Error submitting task:', error);
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
    async getTask(id: string) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks/${id}`);
        const taskData = response.data as Task;
        taskData.dueDate = this.formatDate(taskData.dueDate);
        this.task = taskData;
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    },
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
  },
  async mounted() {
    if (this.$route.params.id) {
      this.isEditMode = true;
      await this.getTask(this.$route.params.id as string);
    }
  },
});
</script>
