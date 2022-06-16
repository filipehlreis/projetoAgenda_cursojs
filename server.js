/**
 * Padrao utilizado para o projeto será MVC (Models, Views, Controllers)
 * 
 * A rota irá decidir qual Controller que irá controlar a rota.
 * 
 * O Controller irá decidir que Model que irá controlar os dados, a base de 
 * dados e coisas relacionadas a dados, e que View que será utilizado na aplicacao. 
 * Escolher qual View e qual Model será utilizado para aquela rota.
 * 
 * 
 */

// dotenv serve para armazenar as variaveis de ambiente de desenvolvimento
// por exemplo: senhas, usuarios, tokens, etc
require('dotenv').config();

// inicializacao do express
const express = require('express');
const app = express();

// inicializacao do mongoose, que será responsavel por modelar nossos dados e 
// garantir que os dados salvos sao realmente da forma que gostariamos de salvar
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.emit('pronto');
    })
    .catch(e => console.log(e));

// identificar um navegador no cliente, salvando e checando um cookie, mostrando que é confiavel
const session = require('express-session');

// responsavel por dizer que as sessoes serao salvas no banco de dados, para evitar consumo de memoria
const MongoStore = require('connect-mongo');

// mensagens auto destrutivas, mensagens de feedback para o usuario, salvas em sessao
const flash = require('connect-flash');

// definir as rotas da aplicacao
const routes = require('./routes');

// para trabalhar com caminhos
const path = require('path');

// recomendacao do Express para poder deixar nossa aplicacao mais segura
const helmet = require('helmet');

// todos os formularios precisam de CSRF Token para nao deixar app/site externo postar em nossa aplicacao.
const csrf = require('csurf');

// middlewares sao funcoes executadas na rota, podendo ser executadas antes, durante ou depois de responder ao cliente
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

// utilizando helmet na aplicacao
app.use(helmet());

// informa que podemos postar formularios para dentro da aplicacao
app.use(express.urlencoded({ extended: true, }));

// poder trabalhar, usar parse para json dentro da applicacao
app.use(express.json());

// para poder trabalhar com arquivos estaticos (imagens,css, js, etc.)
app.use(express.static(path.resolve(__dirname, 'public')));

// configuracoes de sessoes
const sessionOptions = session({
    secret: '980sdfyn03498f s098 g34098 n() 980c4sdfg',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

// define os arquivos  que serao renderizados na tela
app.set('views', path.resolve(__dirname, 'src', 'views'));
// engine utilizada para renderizar, muito semelhante ao html
app.set('view engine', 'ejs');

// configuando o csrf token
app.use(csrf());
// Nossos proprios middlewares 
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

// pedindo para a nossa aplicacao escutar determinada porta
app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
        console.log('Servidor executando na porta 3000.');
    });
});

