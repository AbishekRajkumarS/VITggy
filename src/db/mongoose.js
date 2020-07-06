const mongoose = require('mongoose')
const URL = process.env.MONGODB_URI || process.env.MOGODB_URL

mongoose.connect(URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})