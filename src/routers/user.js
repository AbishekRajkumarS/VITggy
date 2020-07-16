const express = require('express')
const multer = require('multer')
const sharp = require('sharp')


const User = require('../models/user')
const normalUser = require('../models/normalUser')
const restaurant = require('../models/restaurants')

const auth = require('../middleware/auth')
const stdAuth = require('../middleware/stdAuth')

const { sendWelcomeEmail, sendCancelationEmail } = require('../email/account')
const router = new express.Router()

const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(csv)$/)) {
            return cb(new Error('Please upload a proper csv file.'))
        }
        cb(undefined, true)
    }
})

router.get('/', async (req, res) => {
    res.render("everyone")
})

router.get('/home', stdAuth, async (req, res) => {
    res.render("home", {
        user: req.user,
        name: req.user.username
    })
})

router.get('/admin', auth, async(req, res) => {
    res.render("index", {
        user: req.user,
        name: req.user.name
    })
})

router.get('/create-order', stdAuth, (req, res) => {
    res.render("create-order", {
        user: req.user,
        name: req.user.username
    });
})

router.get('/order-list', auth, (req, res) => {
    res.render("order-list", {
        user: req.user,
        name: req.user.name
    });
})

// router.get('/add-user', auth, (req, res) => {
//     res.render("add-user", {
//         user: req.user,
//         name: req.user.name
//     });
// })

router.get('/user-list', auth, (req, res) => {
    res.render("user-list", {
        user: req.user,
        name: req.user.name
    });
})

router.get('/add-restaurant', auth, (req, res) => {
    res.render("add-restaurant", {
        user: req.user,
        name: req.user.name
    });
})


router.get('/restaurant-list', auth, (req, res) => {
    restaurant.find({}).then((restaurant) => {
        res.send(restaurant)
    }).catch((e) => {
        res.send(e)
    })
})

router.get('/std-restaurant-list', stdAuth, (req, res) => {
    res.render("std-res-list", {
        user: req.user,
        name: req.user.username
    });
})

router.get('/every-res-list', async (req, res) => {
    res.render("every-res-list")
})


router.get('/adminLogin', (req, res) => {
    res.render("adminLogin");
})

router.get('/stdLogin', (req, res) => {
    res.render("studentLogin");
})

router.get('/adminSignUp', (req, res) => {
    res.send("<script>alert('This page is Curenntly unavilable')</script>");
})

router.get('/signUp', (req, res) => {
    res.render("studentSignUp");
})

//Data Base Part
 
router.post('/addAdminUsers', async(req, res) => {
    //console.log(req.body);
    const user = new User(req.body)
    try {
        await user.save()
        //sendWelcomeEmail(user.email, user.name)
        // const token = await user.generateAuthToken()
        res.status(201).render("adminLogin")
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/addNewStd', async(req, res) => {
    console.log(req.body);
    const newUser = new normalUser(req.body)
    try{
        await newUser.save()
        // const token = await newUser.generateAuthToken()
        res.status(201).redirect("/stdLogin") 
    }catch (e) {
        res.status(400).send(e)
    }
})

router.post('/addNewRes', upload.single('csv-file'), async(req, res) => {
    // console.log(req.body);
    const newRes = new restaurant(req.body)
    try{
        await newRes.save()
        // const token = await newRes.generateAuthToken()
        res.status(201).render("index") 
    }catch (e) {
        res.status(400).send(e)
    }
})

router.post('/login', async(req, res) => {
    try {
        // console.log('Hii')
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // console.log(user)
        const token = "Bearer " + await user.generateAuthToken()
        req.session.token = token
        console.log(req.session.token)
        res.redirect("/admin")
        // res.send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/stdlogin', async(req, res) => {
    try {
        // console.log('Hii')
        const user = await normalUser.findByCredentials(req.body.email, req.body.password)
        // console.log(user)
        const token = "Bearer " + await user.generateAuthToken()
        req.session.stdtoken = token
        console.log(req.session.stdtoken)
        res.redirect("/home")
        // res.send({user, token});
    } catch (e) {
        res.status(400).send("ERROR");
    }
})

router.post('/admin/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        req.session.token = null

        res.send().redirect("/")
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/student/logout', stdAuth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        req.session.stdtoken = null

        res.send().redirect("/")
    } catch (e) {
        res.status(500).send()
    }
})


// router.post('/restaurant/csv', auth, upload.single('csv-file'), async (req, res) => {
    
//     const buffer = req.file.buffer
//     // req.user.menu = buffer
//     // await req.user.save()
//     console.log(req.body)
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
//     next()
// })

// router.delete('/users/me/avatar', auth, async (req, res) => {
//     req.user.avatar = undefined
//     await req.user.save()
//     res.send()
// })

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



router.get('/dummy', (req, res) => {
    res.send(`
        <form id="my-form">
            <input type='file' id='file' >
            <button type='submit'>Upload</button>
        </form>
        <script>
            const myForm = document.getElementById("my-form")
            const myInp = document.getElementById("file")

            myForm.addEventListener("submit", e => {
                e.preventDefault();

                const endpoint = "/restaurant/csv"
                const formData = new FormData();

                // console.log(myInp.files)

                formData.append("csv-file", myInp.files[0])

                fetch(endpoint, {
                    method: "post",
                    body: formData
                }).catch(console.error)
            })
             
        </script>
    `)
})

module.exports = router