const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const cookieParser = require('cookie-parser')

const mealRouter = require('./routes/meal_router')
const salesRouter = require('./routes/sales_router')

const app = express()

// configute Nunjucks with 'views' as templates directory
nunjucks.configure('views', {
    autoescape: true,
    express: app
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(express.json())


app.use('/', mealRouter)

app.use('/sales/', salesRouter)
app.listen(3000)
