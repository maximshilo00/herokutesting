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

mongoose.connect('mongodb+srv://maximshilo00:326974359max@projectdb.j3ljufi.mongodb.net/reacttest')

const userSchema = mongoose.Schema({
    username : String,
    password : String
})

const usersModel = mongoose.model('users', userSchema)

app.get('/api', (req, res) => {
    res.json({ message : 'I LOVE YOU MIKI!'})
})

app.get('/dbgetUser', async (req, res) => {
    let tempUser = await usersModel.findOne()
    res.json(tempUser)
})

app.get('/getAllUsers', async (req, res) => {
    let tempUsers = await usersModel.find()
    res.send(tempUsers)
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.post('/registerUser', async (req, res) => {
    let tempUser = req.body
    await usersModel.insertMany(tempUser)

    tempUser = null
    tempUser = await usersModel.findOne({ username : req.body.username })

    if (tempUser) {
        res.json({ added : 'true'})
    } else {
        res.json({ added : 'false'})
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})