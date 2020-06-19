const hbs = require('hbs');
const app = require('./app');
const express = require('express')
const path = require('path');
const port =  process.env.PORT || 3000;

var getDirName = path.join(__dirname, '../templates/main/home');
var viewPath = path.join(__dirname, '../templates/main/home');
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialPath);

app.use(express.static(getDirName));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    next();
});

console.log("App is starting");

app.listen(port, () => {
console.log(`The connection was sucessfull at ${port}`);
});