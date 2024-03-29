import express from 'express'

import {router} from './router'

const app = express()
app.use(express.json())
app.use(router)

const port = 3333
app.listen(port, () => console.log('Server is running on port ' + port))