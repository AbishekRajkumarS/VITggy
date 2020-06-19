const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const normalUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true 
    },
    idCardNum: {
        type: Number,
        required: true,
        validate(value) {
            if(value < 5 && value > 5) {
                throw new Error('Not a valid id number');
            }
        }
    },
    mobileNum: {
        type: Number,
        default: 0,
        required: true,
        validate(value) {
            if (value < 10) {
                throw new Error('Phone number must be a postive number')
            }else if(value < 0) {
                throw new Error('Phone number cant be negative');
            }
        }
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        maxlength: 25
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

normalUserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.tokens
    
    return userObject
}

normalUserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismysecretkey', { expiresIn: '1d'})

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// Delete user tasks when user is removed
normalUserSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ _id: user._id });
    next();
})

const normalUser = mongoose.model('normalUser', normalUserSchema)

module.exports = normalUser