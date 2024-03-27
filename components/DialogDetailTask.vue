<template>
    <!-- Dialog for displaying task details -->
    <v-dialog
      :model-value="modelValue"
      max-width="400"
      persistent
    >
      <v-card>
        <!-- Show skeleton loader while data is pending -->
        <v-skeleton-loader v-if="pending" type="paragraph"></v-skeleton-loader>
        <!-- Display error message if there was an error fetching data -->
        <div v-else-if="error">Hubo un error al obtener la infrmación</div>
        <!-- Display task details if data is available -->
        <div v-else>
          <!-- Task title and due date -->
          <v-card-item>
            <v-card-title class="d-flex justify-space-between align-center flex-wrap"> {{ task.title }}<span class="text-subtitle-2">{{ task.due_date ? task.due_date  : 'Sin Fecha'}}</span></v-card-title>
            <!-- Task tags -->
            <v-card-subtitle>
              <div v-if="task.tags">
                <!-- Display each tag as a chip -->
                <v-chip v-for="tag in task.tags.split(',')" color="blue" variant="tonal">  <v-icon icon="mdi-label" start></v-icon> {{tag}} </v-chip>
              </div>
              <div v-else>
                <!-- Display message if there are no tags -->
                <v-chip color="red"> <v-icon icon="mdi-label" start></v-icon>Sin Tags</v-chip>
              </div>
            </v-card-subtitle>
            <!-- Divider -->
            <v-divider></v-divider>
          </v-card-item>
          <!-- Task description and comments -->
          <v-card-text>
            <p class="m-1"><v-icon icon="mdi-text-long"></v-icon> {{ task.description ? task.description : 'Sin Descripcion' }} </p> 
            <p class="m-1"> <v-icon color="primary" icon="mdi-comment-processing-outline"></v-icon>  {{ task.comments ? task.comments : 'Sin Comentarios'  }}</p> 
          </v-card-text>
          <!-- Close button -->
          <div class="d-flex justify-end mb-3 mx-3">
            <v-btn  @click="close" variant="tonal" color="red-lighten-2">Cerrar</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
    // Import necessary utilities
    import { ref } from 'vue';
  
    // Define component props
    const props = defineProps({
      idTask: Number,
      modelValue: Boolean
    });
  
    // Define component emits
    const emit = defineEmits(['update:modelValue']);
  
    // Function to close the dialog
    function close() {
      emit('update:modelValue', false);
    }
  
    // Fetch runtime configuration
    const runtimeConfig = useRuntimeConfig();
    const _token = runtimeConfig.public.token;
    const _tokenParam = runtimeConfig.public.tokenParam;
    
    // Define reactive variables for task data, pending state, and error message
    let task = ref([]);
    let pending = ref(true);
    let error = ref('');
  
    // Function to fetch task data
    const fetchData = async () => {
      try {
        pending.value = true;
        // Fetch task data from API
        const response = await useFetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${props.idTask}`, {
          params: { token: _tokenParam },
          headers: { 'Authorization': `Bearer ${_token}` },
        });
        // Update task data
        task.value = response.data._rawValue[0];
      } catch (err) {
        // Handle errors
        error.value = err;
      } finally {
        // Update pending state
        pending.value = false;
      }
    };
  
    // Call fetchData function when component is mounted
    fetchData();
  </script>  