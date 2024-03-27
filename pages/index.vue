<template>
    <!-- Container for displaying task list -->
    <v-container>
      <!-- Toolbar for task list -->
      <v-toolbar class="px-5" color="blue-lighten-1 rounded-lg">
        <v-icon icon="mdi-calendar-check" />
        <v-toolbar-title>Lista Tareas</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- Button to add new task -->
        <v-btn
          class="bg-green rounded-circle"
          color="white"
          icon="mdi-plus"
          variant="tonal"
          to="/NewTask" nuxt
        ></v-btn>
      </v-toolbar>
      <!-- Show skeleton loader while data is pending -->
      <div v-if="pending">
        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
      </div>
      <!-- Show error message if there was an error fetching data -->
      <div v-else-if="error">
        {{ error }}
        <h1>error</h1>
      </div>
      <!-- Show empty state if there are no tasks -->
      <div v-else-if="tasks.length == 0">
        <v-empty-state
            headline="No se encontrarón tareas"
            title="Descuida!"
            text="Puedes agregar una nueva tarea en el botón de abajo"
            image="https://vuetifyjs.b-cdn.net/docs/images/logos/v.png"
        >
          <template v-slot:actions>
            <!-- Button to add new task -->
            <v-btn
              color="green"
              elevation="1"
              text="Agregar Tarea"
              append-icon="mdi-plus"
              to="/NewTask" nuxt
            >
            </v-btn>
          </template>
        </v-empty-state>
      </div>
      <!-- Show task list -->
      <div v-else>
        <v-list lines="two">
          <!-- Render Task component for each task -->
          <Task v-for="task in tasks" :key="task.id" :id="task.id" :title="task.title" :isCompleted="task.is_completed" :date="task.due_date" @deleteEmit="deleteSuccess" @checkedEmit="checkedSuccess"/>
        </v-list>
      </div>
    </v-container>
    <!-- Snackbar for displaying success message -->
    <v-snackbar v-model="snackbar" color="success" :timeout="2000" type="success">
      <v-icon icon="mdi-check" start></v-icon>
      {{ text }}
    </v-snackbar>
  </template>
  
  <script setup lang="ts">
    // Import necessary utilities
    import { ref } from 'vue';

    interface ITask{
      id: number,
      title: string,
      is_completed: number,
      due_date?: string
    };
  
    // Define reactive variables for snackbar, text, tasks, pending state, and error message
    let snackbar:Ref<Boolean> = ref(false);
    let text:Ref<string> = ref('');
    let tasks:Ref<ITask[]>  = ref([]);
    let pending:Ref<Boolean> = ref(true);
    let error:Ref<string>  = ref('');
  
    // Fetch runtime configuration
    const runtimeConfig:any = useRuntimeConfig();
    const _token:string = runtimeConfig.public.token;
    const _tokenParam:string = runtimeConfig.public.tokenParam;
  
    // Function to fetch task data
    const fetchData = async (): void => {
      try {
        const response:ITask[] = await $fetch('https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${_token}`
          },
          params: { 'token': _tokenParam }
        });
        tasks.value = response;
        pending.value = false;
      } catch (error) {
        console.error('Error fetching data:', error);
        pending.value = false;
        error.value = 'Error fetching data';
      }
    };
  
    // Call fetchData function when component is mounted
    fetchData();
  
    // Function to handle success message for task deletion
    const deleteSuccess = async (msg:string): void => {
      text.value = msg;
      snackbar.value = true;
      await fetchData();
    };
  
    // Function to handle success message for task checkbox state change
    const checkedSuccess = (msg:string): void => {
      text.value = msg;
      snackbar.value = true;
    };
  </script>
  