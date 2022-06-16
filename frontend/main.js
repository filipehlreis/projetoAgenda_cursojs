import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Contato from './modules/Contato';
import Login from './modules/Login';

const login = new Login('.form-login');
const cadastro = new Login('.form-cadastro');
const contato = new Contato('.form-contato');

login.init();
cadastro.init();
contato.init();

// import './assets/css/style.css';

