const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const normalUser = require('../models/addUser')
const auth = require('../middleware/auth')

const { sendWelcomeEmail, sendCancelationEmail } = require('../email/account')
const router = new express.Router()

router.get('/', async (req, res) => {
    res.render("home", {
        user: req.user
    })
})

router.get('/admin', auth, async(req, res) => {
    res.render("index", {
        user: req.user
    })
})

router.get('/create-order', auth, (req, res) => {
    res.render("create-order");
})

router.get('/order-list', auth, (req, res) => {
    res.render("order-list");
})

router.get('/add-user', auth, (req, res) => {
    res.render("add-user");
})

router.get('/user-list', auth, (req, res) => {
    res.render("user-list");
})

router.get('/add-restaurant', auth, (req, res) => {
    res.render("add-restaurant");
})

router.get('/restaurant-list', auth, (req, res) => {
    res.render("restaurant-list");
})

router.get('/adminLogin', (req, res) => {
    res.render("adminLogin");
})

router.get('/signUp', (req, res) => {
    res.render("adminSignUp");
})

//Data Base Part
 
router.post('/addAdminUsers', async(req, res) => {
    //console.log(req.body);
    const user = new User(req.body)
    try {
        await user.save()
        //sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).render("adminLogin")
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/addNewUser', async(req, res) => {
    //console.log(req.body);
    const newUser = new normalUser(req.body)
    try{
        await newUser.save()
        const token = await newUser.generateAuthToken()
        res.status(201).render("add-user") 
    }catch (e) {
        res.status(400).send(e)
    }
})

router.post('/login', async(req, res) => {
    try {
        // console.log('Hii')
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // console.log(user)
        const token = await user.generateAuthToken()
        res.render("index", {user, token})
        // res.send({user, token});
    } catch (e) {
        res.status(400).send("ERROR");
    }
})

router.post('/logout', async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// router.get('/users/me', async (req, res) => {
//     res.send({user: req.user})
// })

// router.patch('/users/me', auth, async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         updates.forEach((update) => req.user[update] = req.body[update])
//         await req.user.save()
//         res.send(req.user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.delete('/users/me', auth, async (req, res) => {
//     console.log(req.user);
    
//     try {
//         await req.user.remove()
//         //sendCancelationEmail(req.user.email, req.user.name)
//         res.send(req.user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// const upload = multer({
//     limits: {
//         fileSize: 2000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload a proper image'))
//         }
//         cb(undefined, true)
//     }
// })

// router.post('/restaurant/logo', upload.single('avatar'), async (req, res) => {
//     const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
//     req.user.logo = buffer
//     await req.user.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

// router.delete('/users/me/avatar', auth, async (req, res) => {
//     req.user.avatar = undefined
//     await req.user.save()
//     res.send()
// })

// router.get('/users/:id/avatar', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)

//         if (!user || !user.avatar) {
//             throw new Error()
//         }

//         res.set('Content-Type', 'image/png')
//         res.send(user.avatar)
//     } catch (e) {
//         res.status(404).send()
//     }
// })

// router.delete('/users/me/avatar', auth, async (req, res) => {
//     req.user.avatar = undefined
//     await req.user.save()
//     res.send()
// })

// router.get('/users/:id/avatar', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)

//         if (!user || !user.avatar) {
//             throw new Error()
//         }

//         res.set('Content-Type', 'image/png')
//         res.send(user.avatar)
//     } catch (e) {
//         res.status(404).send()
//     }
// })

module.exports = router