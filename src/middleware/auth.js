const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async function (req, res, next) {
    try {
        
        const token = req.session.token.split(' ')[1]
        console.log(token)

        if(typeof token !== 'undefined') {
            console.log(token)
            const decoded = await jwt.verify(token, 'thisismysecretkey')
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

            console.log(user)

            if (!user) {
                throw new Error()
            }

            req.token = token
            req.user = user
            next()
        } else {
            res.status(403).send({
                error: 'Something is wrong :('
            })
        }
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth