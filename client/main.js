import './style.css'
import Alpine from 'alpinejs';
import { Login } from './login';
import './movies.css'

window.Alpine = Alpine;


Alpine.data('login', Login);

Alpine.start();


