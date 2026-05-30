const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());


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


const PORT =
process.env.PORT || 3000;

app.listen(PORT, ()=>{

    console.log(
        `Server Running On ${PORT}`
    );

});