<template>
      <v-dialog
        v-model="flag"
        max-width="400"
      >
        <v-card>
            <v-skeleton-loader v-if="pending" type="paragraph"></v-skeleton-loader>
            <div v-else-if="error">Hubo un error al obtener la infrmación</div>
            <div v-else>
                <v-card-item>
                    <v-card-title class="d-flex justify-space-between align-center"> {{ task[0].title }} <span class="text-subtitle-2">{{ task[0].due_date }}</span></v-card-title>
                    <v-card-subtitle>
                        <v-chip v-for="tag in task[0].tags.split(',')" color="blue" variant="tonal">  <v-icon icon="mdi-label" start></v-icon> {{tag}} </v-chip>
                    </v-card-subtitle>
                    <v-divider></v-divider>
                </v-card-item>
                <v-card-text>
                    <v-icon color="primary" icon="mdi-text-long"></v-icon> Descripcion: {{ task[0].description }} <br> 
                    <v-icon color="primary" icon="mdi-comment-alert"></v-icon>  Comentarios: {{ task[0].comments }}
                </v-card-text>
            </div>
        </v-card>
      </v-dialog>
</template>

<script setup>
    const props = defineProps({
        idTask: Number
    });

    const flag = ref(true);
    
    const _token = "e864a0c9eda63181d7d65bc73e61e3dc6b74ef9b82f7049f1fc7d9fc8f29706025bd271d1ee1822b15d654a84e1a0997b973a46f923cc9977b3fcbb064179ecd";
    const { data: task, pending, error } = await useLazyFetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${props.idTask}`,{
        params: { token: 'nivaldo21' },
        headers: { 'Authorization': `Bearer ${_token}`}
    });
</script>

<style scoped>

</style>