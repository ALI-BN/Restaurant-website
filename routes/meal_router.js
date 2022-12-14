const express = require('express')
const mealModel = require('../models/meal_db')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: './public/projectImages/', //path to upload
    filename: (req, file, callback) => {//filename template
        callback(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage: storage })
const router = express.Router()
router.use(express.json());

function getMealsFromIds(ids) {
    if (ids === undefined) return
    return ids.map((id) => mealModel.getMealById(id))
}
router
    .get('/', (req, res) => {
        const meals = mealModel.getAllMeals()
        let recentBought = req.cookies['recent-bought']
        if (typeof recentBought === 'undefined') recentBought = []
        recentBought = recentBought.map((id) => mealModel.getMealById(id))
        res.render('index.njk', {
            title: "Main Page",
            meals: meals,
            recentBought: recentBought,
            cart: getMealsFromIds(req.cookies.cart)
        })
    })
router.get('/detail/:id', (req, res) => {
    const id = req.params.id
    const meal = mealModel.getMealById(id)
    res.render('detail.njk', {
        title: meal.title,
        meal: meal,
        cart: getMealsFromIds(req.cookies.cart)
    })
})
router.get('/:mealID/reviews', (req, res) => {
    const id = req.params.mealID;
    const reviews = mealModel.getMealReviews(id)
    res.send(JSON.stringify(reviews))
})

router.post('/:mealID/reviews', upload.single('image'), (req, res) => {
    const id = req.params.mealID
    const review = {
        reviewer_name: req.body.name,
        city: req.body.city,
        date: new Date().getTime(),
        rating: req.body.rating,
        review: req.body.review,
        meal_id: id,
        image: req.file.filename
    }
    mealModel.addMealReview(review)
    res.status(201).send(review)
})

module.exports = router