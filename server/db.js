db.connect((err)=>{

    if(err){

        console.log('ERROR:', err);

    }else{

        console.log('DATABASE CONNECTED');

    }

});