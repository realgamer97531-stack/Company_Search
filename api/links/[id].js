const handleAs = require('../../server/vercelHandler');

module.exports = (req,res)=>{
    const id =
    req.query && req.query.id;

    req.url =
    `/api/links/${id}`;

    return handleAs(req.url)(req,res);
};
