import {createVuetify} from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import '@mdi/font/css/materialdesignicons.css';
import { VEmptyState } from 'vuetify/labs/VEmptyState'; // Import VEmptyState

export default defineNuxtPlugin((nuxt)=>{
    const vuetify = createVuetify({
        components: {
            ...components, // Spread existing components
            VEmptyState, // Add VEmptyState to components
          },
        icons: {
            defaultSet: 'mdi'
        },
        directives 
    });
    nuxt.vueApp.use(vuetify);
})