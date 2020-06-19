const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

restaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true,  
        trim: true
    },
    contactNum: {
        type: Number,
        reue,
        validate(value) {
            if(value < 5 && value > 5) {
                throw new Error('Not a valid id number');
            }
        }
    },
    restaurantDesc: {
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
    gstin: {
        type: String,
        required: true
    },
    restaurantAddr: {
        type: String,
        required: true
    },
    logo: {
        type: Buffer
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

restaurantSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.avatar
    delete userObject.tokens
    
    return userObject
}

restaurantSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismysecretkey', { expiresIn: '1d'})

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}



// Delete user tasks when user is removed
restaurantSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ _id: user._id });
    next();
})

const restaurant = mongoose.model('restaurant', restaurantSchema)

module.exports = restaurant