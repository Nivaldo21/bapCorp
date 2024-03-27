<template>
    <v-container>
        <v-toolbar class="px-5" color="blue-lighten-1 rounded-lg">
            <v-icon icon="mdi-calendar-check" />
            <v-toolbar-title >Lista Tareas</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              class="bg-green rounded-circle"
              color="white"
              icon="mdi-plus"
              variant="tonal"
              to="/NewTask" nuxt
            ></v-btn>
        </v-toolbar>
        <div v-if="pending">
            <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
            <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
            <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
        </div>
        <div v-else-if="error">
            {{ error }}
            <h1>error</h1>
        </div>
        <div v-else-if="tasks.length == 0">
            <v-empty-state
            headline="No se encontrarón tareas"
            title="Descuida!"
            text="Puedes agregar una nueva tarea en el botón de abajo"
            image="https://vuetifyjs.b-cdn.net/docs/images/logos/v.png"
            >
                <template v-slot:actions>
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
        <div v-else>
            <v-list lines="two">
                <Task v-for="task in tasks" :key="task.id" :id="task.id" :title="task.title" :isCompleted="task.is_completed" :date="task.due_date" @deleteEmit="deleteSuccess" @checkedEmit="checkedSuccess"/>
            </v-list>
        </div>
    </v-container>
    <v-snackbar v-model="snackbar" color="success" :timeout="2000" type="success">
        <v-icon icon="mdi-check" start></v-icon>
        {{ text }}
    </v-snackbar>
</template>

<script setup>
    let snackbar = ref(false);
    let text = ref('');

    const _token = "e864a0c9eda63181d7d65bc73e61e3dc6b74ef9b82f7049f1fc7d9fc8f29706025bd271d1ee1822b15d654a84e1a0997b973a46f923cc9977b3fcbb064179ecd";

    const { data: tasks, pending, error } = await useLazyFetch('https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks',{
        params: { token: 'nivaldo21' },
        headers: { 'Authorization': `Bearer ${_token}`}
    });

    const checkedSuccess = (msg)=>{
        text.value = msg;
        snackbar.value = true;
    }

    const deleteSuccess = (msg) =>{
        text.value = msg;
        snackbar.value = true;
    };

</script>