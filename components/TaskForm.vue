<template>
<v-form>
    <v-container>
      <v-row class="mb-3">
        <v-col cols="12" sm="6">
          <v-text-field
            hint="Por ejemplo: Reparar el carro"
            density="compact"
            label="Titulo de la tarea"
            variant="outlined"
            v-model="form.title"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            hint="Elige una fecha"
            density="compact"
            type="date"
            label="Fecha Tarea"
            variant="outlined"
            v-model="form.date"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
            <v-checkbox
                class="mb-5"
                v-model="form.check"
                color="success"
                label="Iniciar la tarea activa"
                hide-details
            ></v-checkbox>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            hint="Descripción principal de la tarea"
            density="compact"
            label="Descripción"
            variant="outlined"
            v-model="form.description"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            hint="Comentarios extras de la tarea"
            density="compact"
            label="Comentarios"
            variant="outlined"
            v-model="form.comments"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
            <v-row>
                <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      hint="Por ejemplo: Cocina o Trabajo"
                      density="compact"
                      label="Tags"
                      variant="outlined"
                      v-model="newTag"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-btn @click="addTag" class="text-capitalize" block prepend-icon="mdi-plus" color="blue">Añadir Tag</v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" md="6">
            <h5>Tags Añadidos</h5>
            <v-chip closable v-for="(tag, index) in form.tags" :key="index" color="blue" variant="tonal" @click:close="eliminarTag(index)">  <v-icon icon="mdi-label" start></v-icon> {{tag}} </v-chip>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-btn @click="setTask" block class="mt-5" prepend-icon="mdi-plus" color="green">{{flagNewTaks ? 'Agregar Tarea' : 'Editar Tarea'}}</v-btn>
    </v-container>
  </v-form>
  <v-snackbar v-model="emptyTag" color="warning" :timeout="2000">
      <v-icon icon="mdi-tag-hidden" start></v-icon>
      No puedes añadir un tag vacio
  </v-snackbar>
    <v-snackbar v-model="emptyForm" color="warning" :timeout="2000">
        <v-icon icon="mdi-progress-alert" start></v-icon>
        El titulo de la Tarea es Obligatorio
    </v-snackbar>
</template>

<script>
    import { defineComponent } from 'vue';
    export default defineComponent({
        name: 'TaskForm',
        props:{
            flagNewTaks:{ type:Boolean, required: true},
            dataTask: { type:Object, required: false},
        },
        mounted() {
            if (!this.flagNewTaks) {
                this.setData();
            } 
        },
        data(){
            return{
                emptyTag: false,
                emptyForm: false,
                newTag: '',
                form: {title: '', comments: '', description: '', tags: [], date: '', check: false, id: null}
            }
        },
        emits: ['addTask','editTask'],
        methods: {
            setData(){
                this.form.id = this.dataTask.id;
                this.form.title = this.dataTask.title;
                this.form.comments = this.dataTask.comments ? this.dataTask.comments : '';
                this.form.description =  this.dataTask.description ? this.dataTask.description : '';
                this.form.tags = this.dataTask.tags ? this.dataTask.tags.split(',') : [];
                this.form.date = this.dataTask.due_date ? this.dataTask.due_date  : '';
                this.form.check = this.dataTask.is_completed == 1 ? true  : false;
            },
            addTag(){
                if (!this.newTag) {
                    this.emptyTag = true;
                    return;
                }
                this.form.tags.push(this.newTag);
                this.newTag = '';
            },
            eliminarTag(index){
                this.form.tags.splice(index, 0);
            },
            setTask(){
                if (!this.form.title) {
                    this.emptyForm = true;
                    return;
                }
                this.flagNewTaks ? this.$emit('addTask', this.form) :  this.$emit('editTask', this.form);
            }
        },
    });
</script>

<style scoped>

</style>