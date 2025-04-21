const express=require('express');
const { isLogin } = require('../authentication/auth');
const { getUserData, signUp, login } = require('../controller/userController');

const router=express.Router();
router.get('/',isLogin,getUserData);
router.post('/signup',signUp);
router.post('/login',login);

module.exports=router;