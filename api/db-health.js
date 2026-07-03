const db = require('../server/db');

module.exports = (req,res)=>{
    db.query('SELECT 1 AS ok',(err,result)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message:'Database connection failed',
                error:err.message
            });
        }

        res.status(200).json({
            ok:true,
            result:result[0]
        });
    });
};
