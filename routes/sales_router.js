const express = require('express')
const router = express.Router()


router.get('/cart', (req, res) => {
    let count = req.query.count
    if (count === undefined) count = 1
    const mealId = Array.apply(null, Array(parseInt(count))).map(_ => req.query.id)
    const { cookies } = req
    if ('cart' in cookies) cookies.cart = cookies.cart.concat(mealId)
    else cookies.cart = mealId
    res.cookie('cart', cookies.cart)
    res.redirect(req.query.back)
})

router.post('/order', (req, res) => {
    const elements = new Set(req.cookies.cart)
    res.cookie('recent-bought', Array.from(elements))
    res.cookie('cart', [])
    res.redirect('/')
})

module.exports = router