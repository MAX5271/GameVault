const cookieParser = require('cookie-parser');
const express = require('express');
const connectDB = require('./src/config/dbConn');
const { default: mongoose } = require('mongoose');
const app = express();
require('dotenv').config();
const ApiRoutes = require('./src/routes/index');
const cors = require('cors');
const corsOptions = require('./src/config/corsOptions');
const credentials = require('./src/middlewares/credentials');

const PORT = process.env.PORT||3000;

//connect to mongoDB
connectDB();


app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(credentials)
app.use(cors(corsOptions));

app.use(cookieParser());

app.use('/api',ApiRoutes);

mongoose.connection.once('open',()=>{

    console.log('Connected To mongoDB');

    app.listen(PORT,()=>{
        console.log('Server running on port ',PORT);
    });
});