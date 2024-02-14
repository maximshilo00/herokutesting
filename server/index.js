const path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.static(path.resolve(__dirname, '../client/build')))
app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb+srv://maximshilo00:326974359max@projectdb.j3ljufi.mongodb.net/echodb')

const userSchema = mongoose.Schema({
    username : String,
    password : String,
    fullName : String,
    following : Array
})

const postSchema = mongoose.Schema({
    title : String, 
    content : String,
    user : String,
    date : Date,
    likes : Number,
    author : String
})

const usersModel = mongoose.model('users', userSchema)
const postsModel = mongoose.model('posts', postSchema)

app.post('/db/searchItems', async (req, res) => {
    let tempRes = {
        found : false,
        results : []
    }

    let tempUsersResults = await usersModel.find({ fullName : { $regex : req.body.search, $options : 'i'} })
    // ADD AN OPTION TO FIND POSTS LATER
    // let tempPosts Results = null


    if (tempUsersResults) {
        tempRes.found = true
        tempRes.results = [...tempUsersResults.map((result) => { return {
            type : 'user',
            id : result.id.toString(),
            info : result.fullName
        }})]
    }

    console.log(tempRes)
    res.json(tempRes)
})

app.post('/db/addLikeToPostById', async (req, res) => {
    let tempPost = null
    let tempRes = {
        found : false,
        liked : false
    }

    tempPost = await postsModel.findOne({ _id : req.body.id })

    if (tempPost) {
        tempRes.found = true

        let tempLikes = tempPost.likes + 1
        await postsModel.updateOne({ _id : req.body.id },
            {
                $set: {likes : tempLikes}
            })
        tempRes.liked = tempLikes
    }

    res.json(tempRes)
})

app.post('/db/addNewPost', async (req, res) => {
    let tempRes = {
        added : true,
        valid : true
    }
    let tempPost = {
        title : req.body.title,
        content : req.body.content,
        user : req.body.user,
        author : '',
        date : req.body.date,
        likes : 0
    }

    let tempUser = await usersModel.findOne({ _id : tempPost.user })

    if (tempUser) {
        tempPost.author = tempUser.fullName
        await postsModel.insertMany(tempPost)
    }
    
    // GOTTA FIND A FIND TO CHECK IF THE POST WAS ADDED CORRECTLY
    // tempPost = null
    // tempPost = await postsModel.findOne({ user : req.body.user, date : req.body.date })

    // if (tempPost) {
        // tempRes.added = true
        // tempRes.valid = tempPost.id.toString()
    // }

    res.json(tempRes)
})

app.post('/db/getPostsByUser', async (req, res) => {
    let tempPosts = null
    let tempRes = {
        found : false,
        valid : false
    }

    tempPosts = await postsModel.find({ user : req.body.user })

    if (tempPosts) {
        tempRes.found = true
        tempRes.valid = tempPosts
    }

    res.json(tempRes)
})

app.post('/db/getPostsByFollowing', async (req, res) => {
    let tempUser = null
    let tempPosts = []
    let tempRes = {
        found : false,
        valid : false
    }

    tempUser = await usersModel.findOne({ _id : req.body.user })

    if (tempUser) {
        for (let i = 0; i < tempUser.following.length; i++) {
            await postsModel.find({ user: tempUser.following[i] }).then(posts => tempPosts.push([...posts]))
        }
    }

    if (tempPosts.length) {
        tempRes.valid = [...tempPosts]
        tempRes.found = true
    }

    res.json(tempRes)
})

app.post('/db/logInUser', async (req, res) => {

    console.log(req.body)

    let tempUser = null
    let tempRes = {
        found : false,
        valid : false
    }

    tempUser = await usersModel.findOne({ username : req.body.username })
    console.log(tempUser)
    if (tempUser) {
        tempRes.found = true

        if (tempUser.password == req.body.password) {
            tempRes.valid = tempUser.id.toString()
        }
    }

    res.json(tempRes)
})

app.post('/db/getUserFullName', async (req, res) => {
    let tempUser = null
    let tempRes = {
        found : false,
        valid : false
    }

    tempUser = await usersModel.findOne({ _id : req.body.id })

    if (tempUser) {
        tempRes.found = true
        tempRes.valid = tempUser.fullName
    }

    res.json(tempRes)
})

app.post('/db/getUsernameById', async (req, res) => {
    let tempUser = null
    let tempRes = {
        found : false,
        valid : false
    }

    tempUser = await usersModel.findOne({ _id : req.body.id })

    if (tempUser) {
        tempRes.found = true
        tempRes.valid = tempUser.username
    }

    res.json(tempRes)
})

app.post('/db/getUserFollowing', async (req, res) => {
    let tempUser = null
    let tempRes = {
        found : false,
        valid : false
    }

    tempUser = await usersModel.findOne({ _id : req.body.id })

    if (tempUser) {
        tempRes.found = true
        tempRes.valid = await getFollowingNamesAndIds(tempUser)
    }

    res.json(tempRes)
})

async function getFollowingNamesAndIds (user) {
    let tempFollowing = []

    for (let i = 0; i < user.following.length; i++) {
        await usersModel.findOne({ _id : user.following[i] })
            .then(u => {
                tempFollowing.push({
                    fullName : u.fullName,
                    id : u.id.toString()
                })
            })
    }

    return tempFollowing
}

app.post('/db/followUser', async (req, res) => {
    let tempRes = {
        found : false,
        valid : false,
        following : false 
    }

    let tempUser = null

    tempUser = await usersModel.findOne({ _id : req.body.id })
    tempSubject = await usersModel.findOne({ _id : req.body.subject})
    
    if (tempUser) {
        tempRes.found = true
        tempFollowing = tempUser.following

        if (tempSubject) {
            tempRes.valid = true
            tempFollowing.push(req.body.subject)
            await usersModel.updateOne({ _id : req.body.id }, {
                $set : { following : [...tempFollowing]}
            })
            tempRes.following = await getFollowingNamesAndIds(tempSubject)
        }
    }

    res.json(tempRes)
})

app.post('/db/registerNewUser', async (req, res) => {
    let newUser = {
        username : req.body.username,
        password : req.body.password,
        fullName : req.body.fullName,
        following : []
    }

    let tempUser = null
    let tempRes = {
        found : false,
        added : false,
        valid : false
    }

    tempUser = await usersModel.findOne({ username : newUser.username })

    if (tempUser) {
        tempRes.found = true
    } else {
        await usersModel.insertMany(newUser)
        tempUser = await usersModel.findOne({ username : newUser.username })
        
        if (tempUser) {
            tempRes.added = true
            tempRes.valid = tempUser.id.toString()
        }
    }

    res.json(tempRes)
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})