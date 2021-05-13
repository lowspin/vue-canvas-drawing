import { createApp } from 'vue'
import App from './App.vue'

// styles
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/md-light-indigo/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import './assets/style.css'

// import Primevue components
import Button from 'primevue/button';

// create App
const app = createApp(App);
app.use(PrimeVue);

// register Primevue components
app.component('Button', Button);

// mount app
app.mount('#app')
