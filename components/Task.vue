<template>
      <v-list-item>
          <template v-slot:prepend>
            <v-checkbox
              v-model="checkbox"
              color="success"
            ></v-checkbox>
          </template>
          <template v-slot:title>
            <h3 :class="{ 'text-decoration-line-through text-success' : checkbox }">{{title}}</h3>
          </template>
          <template v-slot:subtitle>
            <div>{{date ? date : 'Sin fecha registrada'}}</div>
          </template>
          <template v-slot:default>
            <v-btn
                class="rounded my-2 text-capitalize"
                variant="tonal"
                size="small"
                color="blue-lighten-1"
                append-icon="mdi-page-next-outline"
            > Detalle
            </v-btn>
          </template>
          <template v-slot:append>
            <v-btn
              class="mx-1"
              size="small"
              color="blue"
              icon="mdi-pencil"
              variant="tonal"
              :to="`/EditTask/${id}`" 
              nuxt
            ></v-btn>
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
      <v-divider></v-divider>
      <!-- <DialogDetailTask :idTask="id"/> -->
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
        data(props){
          return {
            checkbox: props.isCompleted == 1 ? true : false,
            config: "e864a0c9eda63181d7d65bc73e61e3dc6b74ef9b82f7049f1fc7d9fc8f29706025bd271d1ee1822b15d654a84e1a0997b973a46f923cc9977b3fcbb064179ecd"
          }
        },
        watch:{
          checkbox(newValue,oldValue){
            this.checkTask(newValue);
          }
        },
        emits: ['deleteEmit','checkedEmit'],
        methods: {
          async deleteTask(){
            try {
              const response = await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${this.id}?token=nivaldo21`, {
                headers: { 'Authorization': `Bearer ${this.config}` },
                method: 'DELETE',
              });
              const res = await response.json();
              this.$emit('deleteEmit',res.detail);
            } catch (error) {
              alert('Error fetching tasks:' + error);
            } 
          },
          async checkTask(stateTask){
            try {
              const formData = new URLSearchParams();
              formData.append('token', 'nivaldo21');
              formData.append('is_completed', stateTask ? 1 : 0);
              formData.append('title', this.title);
              formData.append('date', this.date);
              
              const response = await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${this.id}`, {
                headers: { 'Authorization': `Bearer ${this.config}`, 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'PUT',
                body: formData,
              });
              const res = await response.json();
              this.$emit('checkedEmit',res.detail);
            } catch (error) {
              alert('Error fetching tasks:' + error);
            } 
          }
        },
    });
</script>