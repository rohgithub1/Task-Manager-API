const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const router = express.Router()
const auth = require('../middleware/auth')
const { sendWelcomeEmail , sendCancelEmail } = require('../emails/account')


//route handler for posting user
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
         
      await user.save();
      sendWelcomeEmail(user.email, user.name)
      const token = await user.generateAuthToken()
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  });

  //router for login action on user
router.post('/users/login', async (req, res)=> {
  try{

    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  }catch(e){
    res.status(400).send(e)
  }
})

router.post('/users/logout', auth, async(req, res)=>{
  try{
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token
    }) 
    await req.user.save()

    res.send()
  }catch(e){
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async(req, res)=>{
  try{
    //mnore optimized way to execute logout all to delete all the tokens is after the below comments
    // req.user.tokens = req.user.tokens.filter((token)=>{
    //   return !token
    // })

    req.user.tokens = []
    await req.user.save()

    res.status(200).send()
  }catch(e){
    res.status(500).send(e)
  }
})

  //route handler for getting all user
router.get("/users/me", auth ,async (req, res) => {
    res.send(req.user)
  });
  

  //route handler for updating user using id
router.patch('/users/me', auth,  async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isvalidOperations = updates.every((update)=>allowedUpdates.includes(update))

    if(!isvalidOperations){
        res.status(400).send({ error : 'Invalid updates!'})
    }
    try{
        updates.forEach((update)=> req.user[update] = req.body[update])

        await req.user.save()
        
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

//route handler for deleting user using id
router.delete('/users/me', auth, async(req,res)=>{
    try{
        req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

const upload = multer({
 limits : {
    fileSize : 1000000
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('Please upload images with jpg or jpeg or png type only'))
    }
    return cb(undefined, true)
  }
})

router.post('users/me/avatar', auth, async(req, res)=>{
  const buffer = await sharp(req.file.size).resize({width:250, height: 250}).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  req.send()
}, (error, req, res, next)=>{
  res.status(400).send({error:error.message})
})

router.delete('/users/me/deleteAvatar', auth, async(req, res)=>{
  req.user.avatar = undefined
  await req.user.save()
  res.send(req.user)
}, (error, req, res, next)=>{
  res.status(400).send({error : error.message})
})

router.get('/users/:id/avatar', async(req, res)=>{
  try{
    const user = await User.findById(req.params.id)

    if(!user || !user.avatar){
      throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  }catch(e){
    res.status(404).send()
  }
})

module.exports = router