<template>
      <v-dialog
        :model-value="modelValue"
        max-width="400"
        persistent
      >
        <v-card>
            <v-skeleton-loader v-if="pending" type="paragraph"></v-skeleton-loader>
            <div v-else-if="error">Hubo un error al obtener la infrmación</div>
            <div v-else>
                <v-card-item>
                    <v-card-title class="d-flex justify-space-between align-center flex-wrap"> {{ task.title }}<span class="text-subtitle-2">{{ task.due_date ? task.due_date  : 'Sin Fecha'}}</span></v-card-title>
                    <v-card-subtitle>
                        <div v-if="task.tags">
                            <v-chip v-for="tag in task.tags.split(',')" color="blue" variant="tonal">  <v-icon icon="mdi-label" start></v-icon> {{tag}} </v-chip>
                        </div>
                        <div v-else>
                            <v-chip color="red"> <v-icon icon="mdi-label" start></v-icon>Sin Tags</v-chip>
                        </div>
                    </v-card-subtitle>
                    <v-divider></v-divider>
                </v-card-item>
                <v-card-text>
                    <p class="m-1"><v-icon icon="mdi-text-long"></v-icon> {{ task.description ? task.description : 'Sin Descripcion' }} </p> 
                    <p class="m-1"> <v-icon color="primary" icon="mdi-comment-processing-outline"></v-icon>  {{ task.comments ? task.comments : 'Sin Comentarios'  }}</p> 
                </v-card-text>
                <div class="d-flex justify-end mb-3 mx-3">
                    <v-btn  @click="close" variant="tonal" color="red-lighten-2">Cerrar</v-btn>
                </div>
            </div>
        </v-card>
      </v-dialog>
</template>

<script setup>
    const props = defineProps({
        idTask: Number,
        modelValue: Boolean
    });
    const emit = defineEmits(['update:modelValue']);

    function close() { emit('update:modelValue', false); }

    const  runtimeConfig = useRuntimeConfig();
    const _token = runtimeConfig.public.token;
    const _tokenParam = runtimeConfig.public.tokenParam;
    
    let task = ref([]);
    let pending = ref(true);
    let error = ref('');

    const fetchData = async () => {
        try {
            pending.value = true;
            const response = await useFetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${props.idTask}`, {
                params: { token: _tokenParam },
                headers: { 'Authorization': `Bearer ${_token}` },
            });
            task.value =  response.data._rawValue[0];
            console.log(task.value);
        } catch (err) {
            error.value = err;
        } finally {
            pending.value = false;
        }
    };

    fetchData();
</script>

<style scoped>

</style>