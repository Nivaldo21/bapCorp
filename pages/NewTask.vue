<template>
    <!-- Container for adding a new task -->
    <v-container>
        <!-- Heading for adding a new task -->
        <h2 class="text-blue"><v-icon icon="$vuetify"></v-icon>Agregar Nueva Tarea</h2>
        <!-- TaskForm component for adding a new task -->
        <TaskForm @addTask="addNewTask" :flagNewTaks="true" />
    </v-container>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'NewTask',
    created() {
        // Fetch token from runtime config
        let config = useRuntimeConfig();
        this._token = config.public.token;
        this._tokenParam = config.public.tokenParam;
    },
    data() {
        return {
            // API token parameters
            _token: '',
            _tokenParam: '',
        }
    },
    methods: {
        // Method to add a new task
        async addNewTask(newTask) {
            try {
                // Convert tags array to string
                const cadena = newTask.tags.join(',');
                // Prepare form data
                const formData = new URLSearchParams();
                formData.append('token', this._tokenParam);
                formData.append('is_completed', newTask.check ? 1 : 0);
                formData.append('title', newTask.title);
                formData.append('comments', newTask.comments);
                formData.append('due_date', newTask.date);
                formData.append('description', newTask.description);
                formData.append('tags', cadena);
                
                // Send post request to create new task
                const response = await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks`, {
                    headers: { 'Authorization': `Bearer ${this._token}`, 
                               'Content-Type': 'application/x-www-form-urlencoded' 
                             },
                    method: 'POST',
                    body: formData,
                });
                // Check if request is successful
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status}`);
                }
                // Redirect to home page
                this.$router.push('/');
            } catch (error) {
                alert('Error fetching tasks:' + error);
            } 
        }
    },
});
</script>
