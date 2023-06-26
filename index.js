const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const apiRoutes = require("./apiRoutes");
const path  = require("path")

const port = 4000;

app.use("/", function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Credentials",true);
    res.header("Access-Control-Allow-Header","Origin, X-Requested-With, Content-Type, Accept");
    next()
})
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'))
app.set("view engine","ejs");

app.use("/",apiRoutes)

// Start the server
app.listen(port, () => {
    console.log(`UI server is running at http://localhost:${port}`);
  });