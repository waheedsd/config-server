const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cookieParser());
router.get('/api/login',(req, res) => {
    let serverUrl = encodeURIComponent("http://localhost:4000/")
    return res.redirect("http://localhost:3001/login?service="+serverUrl+"&AppId=1");
})

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1 * 60 * 1000,
      httpOnly: true
    }
  }));

// const checkToken = async (req,res,next) => {
//     console.log("checkToken");
//     console.log('query -> token',req.query.token, req.cookies.token)
//     if(req.cookies.token || req.query.token){
//         let token = req.query.token || req.cookies.token;
//         console.log(`token -- ${token}`)
//        let decoded =  jwt.decode(token, "secret-key");
//        console.log(`decoded ${decoded}`);
//         res.cookie('token', req.query.token,{maxAge: 1*10*1000,domain:"localhost",path:"/",sameSite:"Strict"});
//         // req.session["userName"] = decoded
//         next();
//         // return res.render("dashboard",Object.assign({"userName":decoded}))
//     }else{
//         return res.redirect("/api/login");
//     }
//   }
const checkToken = async (req,res,next) => {
  console.log("checkToken");
  console.log('query -> token',req.query.token, req.cookies.token)
  if(req.cookies.token || req.query.token){
      let token = req.query.token || req.cookies.token;
      console.log(`token -- ${token}`)
     let decodedToken =  jwt.decode(token, "secret-key");
     console.log(`payload ${JSON.stringify(decodedToken)}`);
     let username = decodedToken.username;
     let AppId = decodedToken.AppId;
     let role = decodedToken.role;
     if(!req.session){
      req.session = {}
     }
     req.session.user = username;
     req.session.role = role;
     if(AppId.includes("1")){
        res.cookie('token', token,{maxAge: 1*30*1000,domain:"localhost",path:"/",sameSite:"Strict"});
        next();
     }else{
      return res.redirect("/api/login");
     }
  }else{
      return res.redirect("/api/login");
  }
}
const checkRole = (req,res, next) => {
  console.log('checkRole', JSON.stringify(req.session))
  let {user, role} = req.session;
  // let role = req.session.role;
  if(role == 'admin'){
    // res.render("dashboard",Object.assign({"userName":username,"role":role}));
    next();
  }else if(role == "operator"){
    return res.render("settings",Object.assign({"userName":user,"role":role}));
    // return res.redirect("/settings")
  }  else if(role == "user"){
    return res.render("reports",Object.assign({"userName":user,"role":role}))
  }
}
  router.get('/', checkToken,checkRole, (req, res) => {
    // let username = req.session.user;
    // let role = req.session.role;
    // console.log(`username ${username}`)
    let {user, role} = req.session;
    return res.render("dashboard",Object.assign({"userName":user, "role":role}));
  });

  router.get('/message',(req,res) => {
    return res.render("message")
  })

  router.get('/settings', (req,res)=> {
    let {user, role} = req.session;
    return res.render("settings",Object.assign({"userName":user,"role":role}))
  })
  router.get('/reports', (req,res)=> {
    console.log('reports', JSON.stringify(req.session))
    let {user, role} = req.session;
    return res.render("reports",Object.assign({"userName":user,"role":role}))
  })


module.exports = router;