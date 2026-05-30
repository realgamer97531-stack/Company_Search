require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({
    origin: [
        'https://company-search-production-74f6.up.railway.app',
        'http://localhost:3000'
    ],
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());

// Favicon handler - prevent 404 errors
app.get('/favicon.ico', (req, res) => {
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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

// 404 Handler
app.use((req,res)=>{
    res.status(404).json({message:'Endpoint not found'});
});

const PORT =
process.env.PORT || 3000;

app.listen(PORT, ()=>{

    console.log(
        `✓ Server Running On Port ${PORT}`
    );

});