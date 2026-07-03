require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const allowedOrigins = [
    'https://company-search-production-74f6.up.railway.app',
    'https://company-search-beryl.vercel.app',
    'http://localhost:3000',
    'https://studyisfunny.online',
    ...(process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean)
];

app.use(cors({
    origin(origin, callback){
        if(!origin || allowedOrigins.includes(origin)){
            return callback(null,true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());

// Favicon handler - prevent 404 errors
app.get('/favicon.ico', (req, res) => {
    res.status(204).send();
});

// ROUTES
const authRoutes = require('./routes/auth');
const linkRoutes = require('./routes/links');

app.use('/api/auth',authRoutes);
app.use('/api/links',linkRoutes);


// FRONTEND
app.use(
    express.static(
        path.join(__dirname,'../client')
    )
);

app.use(
'/uploads',

express.static(
path.join(__dirname,'../client/uploads')
)

);

app.get('/',(req,res)=>{

    res.sendFile(
        path.join(__dirname,'../client/index.html')
    );

});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 Handler
app.use((req,res)=>{
    res.status(404).json({message:'Endpoint not found'});
});

const PORT =
process.env.PORT || 3000;

if(require.main === module){
app.listen(PORT, ()=>{

    console.log(
        `✓ Server Running On Port ${PORT}`
    );

});
}

module.exports = app;
