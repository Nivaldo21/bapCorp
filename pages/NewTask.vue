<template>
    <v-container>
        <h2 class="text-blue"><v-icon icon="$vuetify"></v-icon>Agregar Nueva Tarea</h2>
        <TaskForm @addTask="addNewTask" :flagNewTaks="true" />
    </v-container>
</template>

<script>
    import { defineComponent } from 'vue';
    export default defineComponent({
        name: 'NewTask',
        created(){
            let config = useRuntimeConfig();
            this._token = config.public.token;
            this._tokenParam = config.public.tokenParam;
        },
        data(){
            return{
                _token: '',
                _tokenParam: '',
            }
        },
        methods: {
            async addNewTask(newTask){
                try {
                    const cadena = newTask.tags.join(',');
                    const formData = new URLSearchParams();
                    formData.append('token', this._tokenParam);
                    formData.append('is_completed', newTask.check ? 1 : 0);
                    formData.append('title', newTask.title);
                    formData.append('comments', newTask.comments);
                    formData.append('due_date', newTask.date);
                    formData.append('description', newTask.description);
                    formData.append('tags', cadena);
                    
                    const response =  await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks`, {
                        headers: { 'Authorization': `Bearer ${this._token}`, 
                                'Content-Type': 'application/x-www-form-urlencoded' 
                            },
                        method: 'POST',
                        body: formData,
                    });
                    if (!response.ok) {
                        throw new Error(`Error fetching data: ${response.status}`);
                    }
                    const res =  await response.json();
                    this.$router.push('/');
                } catch (error) {
                    alert('Error fetching tasks:' + error);
                } 
            }
        },
    });
</script>

<style scoped>

</style>