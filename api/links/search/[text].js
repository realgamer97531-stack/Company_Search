const handleAs = require('../../../server/vercelHandler');

module.exports = (req,res)=>{
    const text =
    req.query && req.query.text;

    req.url =
    `/api/links/search/${encodeURIComponent(text || '')}`;

    return handleAs(req.url)(req,res);
};
