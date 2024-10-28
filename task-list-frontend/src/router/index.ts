import { createRouter, createWebHistory } from 'vue-router';
import CreateTask from '../components/CreateEditTask.vue';
// import DataTable from '../components/DataTable.vue';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TaskList',
      component: HomeView,
    },
    {
      path: '/create',
      name: 'CreateTask',
      component: CreateTask,
    },
    {
      path: '/edit/:id',
      name: 'EditTask',
      component: CreateTask,
      props: true,
    }
  ],
})

export default router
