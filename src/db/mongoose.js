const mongoose = require('mongoose')
const URL = "mongodb://abishek:test123@ds031957.mlab.com:31957/heroku_0hjzw5cs" || "mongodb://127.0.0.1:27017/VITggy"

mongoose.connect(URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})