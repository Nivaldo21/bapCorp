<template>
    <!-- List item representing a task -->
      <v-list-item>
        <!-- Checkbox for task completion -->
          <template v-slot:prepend>
            <v-checkbox
              v-model="checkbox"
              color="success"
            ></v-checkbox>
          </template>
          <!-- Task title -->
          <template v-slot:title>
            <h3 :class="{ 'text-decoration-line-through text-success' : checkbox }">{{title}}</h3>
          </template>
          <!-- Task date -->
          <template v-slot:subtitle>
            <div>{{date ? date : 'Sin fecha registrada'}}</div>
          </template>
          <!-- Default slot with button for task details -->
          <template v-slot:default>
            <v-btn
                class="rounded my-2 text-capitalize"
                variant="tonal"
                size="small"
                color="blue-lighten-1"
                append-icon="mdi-page-next-outline"
                @click="toggleCustomSelection"
            > Detalle
            </v-btn>
          </template>
          <!-- Buttons for editing and deleting tasks -->
          <template v-slot:append>
            <!-- Button to edit task -->
            <v-btn
              class="mx-1"
              size="small"
              color="blue"
              icon="mdi-pencil"
              variant="tonal"
              :to="`/EditTask/${id}`" 
              nuxt
            ></v-btn>
            <!-- Button to delete task -->
            <v-btn
              class="mx-1"
              size="small"
              color="red-lighten-1"
              icon="mdi-trash-can"
              variant="tonal"
              @click="deleteTask"
            ></v-btn>
          </template>
      </v-list-item>
      <!-- Divider -->
      <v-divider></v-divider>
      <!-- Custom dialog for task details -->
      <DialogDetailTask :idTask="id" v-model="showCustomSelector" />
</template>

<script lang="ts">
   import { defineComponent } from 'vue';
    export default defineComponent({
        name: 'TaskComponent',
        props: {
            title: {
                type: String,
                required: false,
            },
            isCompleted: {
                type: Number,
                required: false,
            },
            date: {
              type: String,
              required: false,
              default: 'Sin fecha registrada',
            },
            id:{
              type: Number,
              required: true,
            }
        },
        created(){
          // Fetch token from runtime config
            let config = useRuntimeConfig();
            this._token = config.public.token;
            this._tokenParam = config.public.tokenParam;
        },
        data(props){
          return {
             // Checkbox state for task completion
            checkbox: props.isCompleted == 1 ? true : false,
            // State for showing/hiding custom dialog
            showCustomSelector: false,
            // API token parameters
            _token: '',
            _tokenParam: '',
          }
        },
        watch:{
          // Watch for changes in checkbox state
          checkbox(newValue,oldValue){
             // Call method to update task completion status
            this.checkTask(newValue);
          }
        },
        emits: ['deleteEmit','checkedEmit'],
        methods: {
          // Toggle visibility of custom dialog
          toggleCustomSelection() {
              this.showCustomSelector= !this.showCustomSelector;
          },
          // Method to delete a task
          async deleteTask(){
            try {
              // Send delete request to API
              const response = await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${this.id}?token=${this._tokenParam}`, {
                headers: { 'Authorization': `Bearer ${this._token}` },
                method: 'DELETE',
              });
              const res = await response.json();
              // Emit event with response data
              this.$emit('deleteEmit',res.detail);
            } catch (error) {
              alert('Error fetching tasks:' + error);
            } 
          },
           // Method to update task completion status
          async checkTask(stateTask){
            try {
              // Prepare form data
              const formData = new URLSearchParams();
              formData.append('token', this._tokenParam);
              formData.append('is_completed', stateTask ? 1 : 0);
              formData.append('title', this.title);
              formData.append('date', this.date);
              // Send put request to update task
              const response = await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${this.id}`, {
                headers: { 'Authorization': `Bearer ${this._token}`, 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'PUT',
                body: formData,
              });
              const res = await response.json();
              // Emit event with response data
              this.$emit('checkedEmit',res.detail);
            } catch (error) {
              alert('Error fetching tasks:' + error);
            } 
          }
        },
    });
</script>