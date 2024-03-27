<template>
    <v-container>
        <h2 class="text-blue"><v-icon icon="$vuetify"></v-icon>Editar Tarea</h2>
        <div v-if="pending">
            <v-skeleton-loader type="article"></v-skeleton-loader>
            <v-skeleton-loader type="article"></v-skeleton-loader>
        </div>
        <TaskForm v-else @editTask="_editTask" :flagNewTaks="false" :dataTask="task"  />
    </v-container>
</template>

<script>
    import { defineComponent } from 'vue';
    export default defineComponent({
        name: 'EditTask',
        mounted() {
            this.idTask = this.$route.params.id;
            if(this.idTask != null || this.idTask !=undefined)this.fetchTasks();
        },
        data(){
            return{
                config: 'e864a0c9eda63181d7d65bc73e61e3dc6b74ef9b82f7049f1fc7d9fc8f29706025bd271d1ee1822b15d654a84e1a0997b973a46f923cc9977b3fcbb064179ecd',
                pending: true,
                idTask: null,
                task: null,
            }
        },
        methods:{
            async _editTask(task){
                try {
                    const cadena = task.tags.join(',');
                    const formData = new URLSearchParams();
                    formData.append('token', 'nivaldo21');
                    formData.append('is_completed', task.check ? 1 : 0);
                    formData.append('title', task.title);
                    formData.append('comments', task.comments);
                    formData.append('due_date', task.date);
                    formData.append('description', task.description);
                    formData.append('tags', cadena);

                    console.log(formData.values);
                    
                    const response = await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${task.id}`, {
                        headers: { 'Authorization': `Bearer ${this.config}`, 'Content-Type': 'application/x-www-form-urlencoded' },
                        method: 'PUT',
                        body: formData,
                    });
                    if (!response.ok) {
                        throw new Error(`Error fetching data: ${response.status}`);
                    }
                    const res = await response.json();
                    this.$router.push('/');
                } catch (error) {
                    alert('Error fetching tasks:' + error);
                } 
            },
            async fetchTasks() {
                this.pending = true; 
                try{
                    const _token = "e864a0c9eda63181d7d65bc73e61e3dc6b74ef9b82f7049f1fc7d9fc8f29706025bd271d1ee1822b15d654a84e1a0997b973a46f923cc9977b3fcbb064179ecd";
                    const url = `https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${this.idTask}?token=nivaldo21`;
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${_token}`,
                        }
                    });
    
                    if (!response.ok) {
                        throw new Error(`Error fetching data: ${response.status}`);
                    }
                    const data = await response.json();
                    this.task = data[0];
                }finally {
                    this.pending = false; // Indicate data fetching completion
                }
            }
        }
    });
</script>

<style lang="scss" scoped>

</style>