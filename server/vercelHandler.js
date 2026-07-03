const app = require('./server');

function handleAs(path){
    return (req,res)=>{
        req.url = path;
        return app(req,res);
    };
}

module.exports = handleAs;
