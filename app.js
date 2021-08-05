const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');



app.use(cors());
app.options('*', cors())

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
//app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
//app.use(errorHandler);

 

//Routes
 
const categoriasRuta = require('./rutas/categorias'); 
const productosRuta = require('./rutas/productos'); 
const usuarioRuta = require('./rutas/usuarios'); 
const comprasRuta = require('./rutas/compras');

const api = process.env.API_URL;

 
app.use(`${api}/categorias`, categoriasRuta); 
app.use(`${api}/productos`,productosRuta); 
app.use(`${api}/usuarios`,usuarioRuta); 
app.use(`${api}/compras`, comprasRuta);

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'carrito'
})
.then(()=>{
    console.log('BASE CONECTADA')
})
.catch((err)=> {
    console.log(err);
})

//Server
app.listen(3000, ()=>{

    console.log('SERVIDOR CORRIENDO EN  http://localhost:3000');
})