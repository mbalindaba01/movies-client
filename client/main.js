import Alpine from 'alpinejs';
import { Login } from './login';
import Fun from './fun';

window.Alpine = Alpine;


Alpine.data('login', Login);
Alpine.data('fun', Fun);

Alpine.start();


