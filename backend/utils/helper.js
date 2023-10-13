const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const db = require('../models/index');
const bcrypt = require('bcrypt');
const User = db.user;

const generateToken = (userID,loginDate) => {
    let token = jwt.sign({userID:userID},loginDate);
    return token;
};

const verifyToken = async(req,res,next) => {
    let token = req.headers['authorization'];
    if(token){
        tokenPart = token.split(" ");
        token = tokenPart[1];
        const decodedToken = jwt.decode(token);
        const userID = decodedToken.userID;
        const user = await User.findOne({where:{userID:userID}});
        if(user){
            const date = user.loginDate;
            const loginDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
            jwt.verify(token,loginDate,(err) => {
                if(err){
                    return res.status(402).json({stautscode:402,message:"UnAuthorized",err});
                }
                req.user=user;
                next();
            })
        } else {
            return res.status(404).json({stautscode:404,message:"Token Has Invalid"});
        }
    }else {
        return res.status(422).json({statuscode:422,message:"Token Has Invalid"});
    }
};

const algorithm = "aes-256-cbc";
const key = "B374A26A71490437AA024E4FADD5B49F";
const iv = "7E892875A42C59A3";


function encrypt(value) {
    let cipher = crypto.createCipheriv(algorithm,key,iv);
    let encrypted = cipher.update(value,'utf-8','hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(value){
    let decipher = crypto.createDecipheriv(algorithm,key,iv);
    let decrypted = decipher.update(value,'hex','utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

async function crypt(value) {
    try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(value, salt);
        return password;
    } catch (error) {
        throw error;
    }
}

module.exports = { generateToken,verifyToken,encrypt,decrypt,crypt};