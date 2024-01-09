import express from 'express'

const app = express()

app.get('/', (request, response) => {
    return response.json({message: 'Hello World'})
})

const port = 3333

app.listen(port, () => console.log('Server is running on port ' + port))