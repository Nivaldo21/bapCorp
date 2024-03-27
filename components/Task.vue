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
                @click="toggleCustomSelection"
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
            let config = useRuntimeConfig();
            this._token = config.public.token;
            this._tokenParam = config.public.tokenParam;
        },
        data(props){
          return {
            checkbox: props.isCompleted == 1 ? true : false,
            showCustomSelector: false,
            _token: '',
            _tokenParam: '',
          }
        },
        watch:{
          checkbox(newValue,oldValue){
            this.checkTask(newValue);
          }
        },
        emits: ['deleteEmit','checkedEmit'],
        methods: {
          toggleCustomSelection() {
              this.showCustomSelector= !this.showCustomSelector;
          },
          async deleteTask(){
            try {
              const response = await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${this.id}?token=${this._tokenParam}`, {
                headers: { 'Authorization': `Bearer ${this._token}` },
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
              formData.append('token', this._tokenParam);
              formData.append('is_completed', stateTask ? 1 : 0);
              formData.append('title', this.title);
              formData.append('date', this.date);
              
              const response = await fetch(`https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks/${this.id}`, {
                headers: { 'Authorization': `Bearer ${this._token}`, 'Content-Type': 'application/x-www-form-urlencoded' },
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