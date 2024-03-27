<template>
  <!-- Form for adding/editing tasks -->
  <v-form>
    <v-container>
      <!-- Input for task title -->
      <v-row class="mb-3">
        <v-col cols="12" sm="6">
          <!-- Task Title -->
          <v-text-field
            hint="Por ejemplo: Reparar el carro"
            density="compact"
            label="Titulo de la tarea"
            variant="outlined"
            v-model="form.title"
          ></v-text-field>
        </v-col>
        <!-- Input for task date -->
        <v-col cols="12" sm="6" md="3">
          <!-- Task Date -->
          <v-text-field
            hint="Elige una fecha"
            density="compact"
            type="date"
            label="Fecha Tarea"
            variant="outlined"
            v-model="form.date"
          ></v-text-field>
        </v-col>
        <!-- Checkbox for task status -->
        <v-col cols="12" sm="6" md="3">
            <v-checkbox
                class="mb-5"
                v-model="form.check"
                color="success"
                :label="flagNewTaks ? 'Iniciar la tarea activa' : 'Estado de la Tarea'"
                hide-details
            ></v-checkbox>
        </v-col>
        <!-- Task Description -->
        <v-col cols="12" sm="6">
          <v-text-field
            hint="Descripción principal de la tarea"
            density="compact"
            label="Descripción"
            variant="outlined"
            v-model="form.description"
          ></v-text-field>
        </v-col>
        <!-- Additional Comments -->
        <v-col cols="12" sm="6">
          <v-text-field
            hint="Comentarios extras de la tarea"
            density="compact"
            label="Comentarios"
            variant="outlined"
            v-model="form.comments"
          ></v-text-field>
        </v-col>
        <!-- Input for adding new tags -->
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" sm="6" md="8">
              <!-- Tags -->
              <v-text-field
                hint="Por ejemplo: Cocina o Trabajo"
                density="compact"
                label="Tags"
                variant="outlined"
                v-model="newTag"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <!-- Button to add tags -->
              <v-btn @click="addTag" class="text-capitalize" block prepend-icon="mdi-plus" color="blue">Añadir Tag</v-btn>
            </v-col>
          </v-row>
        </v-col>
        <!-- List of added tags -->
        <v-col cols="12" md="6">
          <h5>Tags Añadidos</h5>
          <v-chip closable v-for="(tag, index) in form.tags" :key="tag" color="blue" variant="tonal" @click:close="eliminarTag(tag)">  <v-icon icon="mdi-label" start></v-icon> {{tag}} </v-chip>
        </v-col>
      </v-row>
      <!-- Divider -->
      <v-divider></v-divider>
      <!-- Button to add/edit task -->
      <v-btn @click="setTask" block class="mt-5" prepend-icon="mdi-plus" color="green">{{flagNewTaks ? 'Agregar Tarea' : 'Editar Tarea'}}</v-btn>
    </v-container>
  </v-form>
  <!-- Snackbar for warning messages about empty tags -->
  <v-snackbar v-model="emptyTag" color="warning" :timeout="2000">
    <v-icon icon="mdi-tag-hidden" start></v-icon>
    No puedes añadir un tag vacio
  </v-snackbar>
  <!-- Snackbar for warning messages about incomplete form -->
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
      // Set data if task is not new
      if (!this.flagNewTaks) {
        this.setData();
      } 
    },
    data(){
      return{
        emptyTag: false,
        emptyForm: false,
        newTag: '',
        // Object representing the task form
        form: {title: '', comments: '', description: '', tags: [], date: new Date().toISOString().slice(0, 10), check: false, id: null}
      }
    },
    emits: ['addTask','editTask'],
    methods: {
      // Set data for existing task to edit
      setData(){
        this.form.id = this.dataTask.id;
        this.form.title = this.dataTask.title;
        this.form.comments = this.dataTask.comments ? this.dataTask.comments : '';
        this.form.description =  this.dataTask.description ? this.dataTask.description : '';
        this.form.tags = this.dataTask.tags ? this.dataTask.tags.split(',') : [];
        this.form.date = this.dataTask.due_date ? this.dataTask.due_date  : new Date().toISOString().slice(0, 10);
        this.form.check = this.dataTask.is_completed == 1 ? true  : false;
      },
      // Method to add a new tag
      addTag(){
        if (!this.newTag) {
          this.emptyTag = true;
          return;
        }
        this.form.tags.push(this.newTag);
        this.newTag = '';
      },
      // Method to delete an existing tag
      eliminarTag(tag){
        let resultado = this.form.tags.filter(val => val != tag);
        this.form.tags = resultado;
      },
      // Method to add or edit the task
      setTask(){
        // Validate that the task title is not empty
        if (!this.form.title) {
          this.emptyForm = true;
          return;
        }
        // Emit event to add or edit task
        this.flagNewTaks ? this.$emit('addTask', this.form) :  this.$emit('editTask', this.form);
      }
    },
  });
</script>