const mongoose = require('mongoose')
const validator = require('validator')

orderSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true,  
        trim: true
    },
    restaurantDesc: {
        type: String,
        required: true,
        maxlength: 200
    },
    contactNum: {
        type: Number,
        default: 0,
        required: true,
        validate(value) {
            if (value < 10) {
                throw new Error('Phone number must be a Valid.')
            }else if(value < 0) {
                throw new Error("Phone number can't be negative.");
            }
        }
    },
    gstin: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    restaurantAddr: {
        type: String,
        required: true,
        maxlength: 50
    },
    menu: [{
        food_id : {
            type: String,
            minlength: 1,
            maxlength: 5
        },
        food_name: {
            type: String,
            minlength: 1,
            maxlength: 15
        },
        food_cost: {
            type: Number,
            minlength: 1,
            maxlength: 4
        }
    }],
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