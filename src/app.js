const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userController = require('./controllers/users');
const profileController = require('./controllers/profiles');
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api-rest', userController);
app.use('/api-rest/profiles', profileController)


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Se ha conectado a la Base de datos')
    })
    .catch( err => {
        console.log('Error al conectar a la Base de datos')
    })



app.listen(process.env.PORT || 8080, () => {
    console.log(`Server running on Port: http://localhost:${process.env.PORT || 8080}`);
})