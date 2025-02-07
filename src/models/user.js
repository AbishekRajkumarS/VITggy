const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    phoneNum: {
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
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

adminUserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

adminUserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismysecretkey');
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token 
}

adminUserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('incorrect email')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('incorrect password')
    }

    return user
}

// Hash the plain text password before saving
adminUserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', adminUserSchema)

module.exports = User