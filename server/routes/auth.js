const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db');

const SECRET = "SUPER_SECRET_KEY";

const verifyToken =
require('../middleware/authMiddleware');

// REGISTER
router.post('/register', async (req,res)=>{

    const {username,password,role} = req.body;

    // Validation
    if(!username || !password){
        return res.status(400).json({message:'Username and password required'});
    }

    if(username.length < 3){
        return res.status(400).json({message:'Username must be at least 3 characters'});
    }

    if(password.length < 6){
        return res.status(400).json({message:'Password must be at least 6 characters'});
    }

    try{
        const hashedPassword = await bcrypt.hash(password,10);

        const sql = `
        INSERT INTO users (username,password,role)
        VALUES (?,?,?)
        `;

        db.query(sql,[username,hashedPassword,role || 'viewer'],(err,result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    return res.status(409).json({message:'Username already exists'});
                }
                return res.status(500).json({message:'Database error',error:err});
            }

            res.json({
                message:'User Created Successfully'
            });
        });
    }catch(error){
        res.status(500).json({message:'Server error',error:error.message});
    }

});

// ADD USER (ADMIN ONLY)

router.post(

'/add-user',

verifyToken,

async (req,res)=>{

    // ADMIN ONLY
    if(req.user.role !== 'admin'){

        return res.status(403).json({

            message:'Admins Only'

        });

    }

    const {

        username,
        password,
        role

    } = req.body;

    // Validation
    if(!username || !password){
        return res.status(400).json({message:'Username and password required'});
    }

    if(username.length < 3){
        return res.status(400).json({message:'Username must be at least 3 characters'});
    }

    if(password.length < 6){
        return res.status(400).json({message:'Password must be at least 6 characters'});
    }

    try{

        // HASH PASSWORD
        const hashedPassword =

        await bcrypt.hash(
        password,
        10
        );

        const sql = `

        INSERT INTO users

        (

            username,
            password,
            role

        )

        VALUES (?,?,?)

        `;

        db.query(sql,[

            username,
            hashedPassword,
            role || 'viewer'

        ],(err,result)=>{

            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    return res.status(409).json({message:'Username already exists'});
                }

                return res
                .status(500)
                .json({message:'Database error',error:err.message});

            }

            res.json({

                message:'User Added Successfully'

            });

        });

    }

    catch(error){

        res.status(500).json({message:'Server error',error:error.message});

    }

});

// GET USERS

router.get(

'/users',

verifyToken,

(req,res)=>{

    if(req.user.role !== 'admin'){

        return res.status(403).json({

            message:'Admins Only'

        });

    }

    const sql = `

    SELECT

    id,
    username,
    role,
    created_at

    FROM users

    ORDER BY created_at DESC

    `;

    db.query(sql,(err,result)=>{

        if(err){

            return res
            .status(500)
            .json(err);

        }

        res.json(result);

    });

});

// LOGIN
router.post('/login',(req,res)=>{

    const {username,password} = req.body;

    // Validation
    if(!username || !password){
        return res.status(400).json({message:'Username and password required'});
    }

    const sql = `
    SELECT * FROM users
    WHERE username = ?
    `;

    db.query(sql,[username],async(err,result)=>{

        if(err){
            return res.status(500).json({message:'Database error',error:err.message});
        }

        if(result.length === 0){
            return res.status(401).json({
                message:'User Not Found'
            });
        }

        const user = result[0];

        const validPassword =
        await bcrypt.compare(password,user.password);

        if(!validPassword){
            return res.status(401).json({
                message:'Wrong Password'
            });
        }

        try{
            const token = jwt.sign({
                id:user.id,
                role:user.role
            },SECRET,{expiresIn:'7d'});

            res.json({
                token,
                role:user.role,
                username:user.username
            });
        }catch(error){
            res.status(500).json({message:'Token generation failed',error:error.message});
        }

    });

});

module.exports = router;