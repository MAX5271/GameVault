require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./src/config/dbConn');
const { default: mongoose } = require('mongoose');
const app = express();
const ApiRoutes = require('./src/routes/index');
const cors = require('cors');
const corsOptions = require('./src/config/corsOptions');
const credentials = require('./src/middlewares/credentials');
const sanitize = require('./src/middlewares/sanitize');
const { apiLimiter } = require('./src/middlewares/rateLimiter');

const REQUIRED_ENV_VARS = [
    'DATABASE_URI',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'RAWG_API_KEY',
];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variable(s): ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

const PORT = process.env.PORT||3000;

//connect to mongoDB
connectDB();

app.use(helmet());

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(credentials)
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(sanitize);

app.use('/api',apiLimiter,ApiRoutes);

mongoose.connection.once('open',()=>{

    console.log('Connected To mongoDB');

    app.listen(PORT,()=>{
        console.log('Server running on port ',PORT);
    });
});