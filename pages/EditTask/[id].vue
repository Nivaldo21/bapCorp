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
        created(){
            let config = useRuntimeConfig();
            this._token = config.public.token;
            this._tokenParam = config.public.tokenParam;
        },
        data(){
            return{
                _token: '',
                _tokenParam: '',
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
                    formData.append('token', this._tokenParam);
                    formData.append('is_completed', task.check ? 1 : 0);
                    formData.append('title', task.title);
                    formData.append('comments', task.comments);
                    formData.append('due_date', task.date);
                    formData.append('description', task.description);
                    formData.append('tags', cadena);

                    const response = await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${task.id}`, {
                        headers: { 'Authorization': `Bearer ${this._token}`, 'Content-Type': 'application/x-www-form-urlencoded' },
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
                    const url = `https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${this.idTask}?token=${this._tokenParam}`;
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${this._token}`,
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