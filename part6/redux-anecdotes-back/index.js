const app = require('./app')
const cors = require('cors')
app.use(cors())

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})