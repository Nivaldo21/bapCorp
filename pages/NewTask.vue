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
        data(){
            return{
                config: 'e864a0c9eda63181d7d65bc73e61e3dc6b74ef9b82f7049f1fc7d9fc8f29706025bd271d1ee1822b15d654a84e1a0997b973a46f923cc9977b3fcbb064179ecd'
            }
        },
        methods: {
            async addNewTask(newTask){
                try {
                    const cadena = newTask.tags.join(',');
                    const formData = new URLSearchParams();
                    formData.append('token', 'nivaldo21');
                    formData.append('is_completed', newTask.check ? 1 : 0);
                    formData.append('title', newTask.title);
                    formData.append('comments', newTask.comments);
                    formData.append('due_date', newTask.date);
                    formData.append('description', newTask.description);
                    formData.append('tags', cadena);
                    
                    const response =  await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks`, {
                        headers: { 'Authorization': `Bearer ${this.config}`, 
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