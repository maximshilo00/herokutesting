const path = require('path')
const express = require('express')

app.use(express.static(path.resolve(__dirname, '../client/build')))

const PORT = process.env.PORT || 3001

const app = express()

app.get('/api', (req, res) => {
    res.json({ message : 'Hello from server!'})
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})