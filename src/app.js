const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

require("./db/mongoose");

const userRouter = require("./routers/user");

const app = express();

app.use(express.json());

app.use(session({
  secret: 'Secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// app.use(bodyParser.json());
app.use(userRouter);


module.exports = app;
