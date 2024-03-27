<template>
    <!-- Container for editing a task -->
    <v-container>
        <!-- Heading for editing a task -->
        <h2 class="text-blue"><v-icon icon="$vuetify"></v-icon>Editar Tarea</h2>
        <!-- Show skeleton loader while data is pending -->
        <div v-if="pending">
            <v-skeleton-loader type="article"></v-skeleton-loader>
            <v-skeleton-loader type="article"></v-skeleton-loader>
        </div>
        <!-- TaskForm component for editing a task -->
        <TaskForm v-else @editTask="_editTask" :flagNewTaks="false" :dataTask="task"  />
    </v-container>
</template>

<script>
    import { defineComponent } from 'vue';
    export default defineComponent({
        name: 'EditTask',
        mounted() {
            // Get task ID from route params and fetch task data
            this.idTask = this.$route.params.id;
            if(this.idTask != null || this.idTask !=undefined)this.fetchTasks();
        },
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
                // Flag to indicate pending data fetch
                pending: true,
                // ID of the task being edited
                idTask: null,
                // Task data
                task: null,
            }
        },
        methods: {
            // Method to handle editing a task
            async _editTask(task) {
                try {
                    // Convert tags array to string
                    const cadena = task.tags.join(',');
                    // Prepare form data
                    const formData = new URLSearchParams();
                    formData.append('token', this._tokenParam);
                    formData.append('is_completed', task.check ? 1 : 0);
                    formData.append('title', task.title);
                    formData.append('comments', task.comments);
                    formData.append('due_date', task.date);
                    formData.append('description', task.description);
                    formData.append('tags', cadena);

                    // Send put request to update task
                    const response = await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${task.id}`, {
                        headers: { 'Authorization': `Bearer ${this._token}`, 'Content-Type': 'application/x-www-form-urlencoded' },
                        method: 'PUT',
                        body: formData,
                    });
                    // Check if request is successful
                    if (!response.ok) {
                        throw new Error(`Error fetching data: ${response.status}`);
                    }
                    // Parse response data
                    const res = await response.json();
                    // Redirect to home page
                    this.$router.push('/');
                } catch (error) {
                    alert('Error fetching tasks:' + error);
                }
            },
            // Method to fetch task data
            async fetchTasks() {
                this.pending = true;
                try {
                    // Construct URL for fetching task data
                    const url = `https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${this.idTask}?token=${this._tokenParam}`;
                    // Send get request to fetch task data
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${this._token}`,
                        }
                    });

                    // Check if request is successful
                    if (!response.ok) {
                        throw new Error(`Error fetching data: ${response.status}`);
                    }
                    // Parse response data
                    const data = await response.json();
                    // Set task data
                    this.task = data[0];
                } finally {
                    this.pending = false; // Indicate data fetching completion
                }
            }
        }
    });
</script>