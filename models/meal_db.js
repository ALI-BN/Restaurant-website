const Database = require('better-sqlite3')
const old_meal_db = require('./meal')
const db = new Database('./databases/db.db', { verbose: console.log })

function getAveragRating(id) {
    const stm = db.prepare('SELECT avg(rating) as \'rating\' FROM reviews WHERE meal_id = ?')
    let result = stm.get(id).rating;
    if (result == undefined) {
        result = 5
    }
    return result;
}

function getMealNutration(id) {
    return old_meal_db.getMealById(id).nutrition
}


function getAllMeals() {
    const stm = db.prepare('SELECT * from meals')
    const meals = stm.all();
    for (const meal of meals) {
        meal.rating = getAveragRating(meal.id)
        meal.nutrition = getMealNutration(meal.id)
    }
    return meals
}


function getMealById(id) {
    const stm = db.prepare('SELECT * from meals where id = ?')
    const meal = stm.get(id)
    if (meal == undefined) return meal
    meal.rating = getAveragRating(meal.id)
    meal.nutrition = getMealNutration(meal.id)
    return meal
}

function getMealReviews(id) {
    const stm = db.prepare('SELECT * from reviews where meal_id = ?')
    const reviews = stm.all(id)
    return reviews
}
function addMealReview(review) {

    const stm = db.prepare
        (`INSERT INTO reviews 
        (reviewer_name, city, date, rating,image, review, meal_id) VALUES
        (:reviewer_name, :city, :date, :rating, :image, :review, :meal_id)`)
    const result = stm.run(review)
    return result
}

// addMealReview({
//     reviewer_name: "ali",
//     city: "Macca",
//     date: "12/12/2000",
//     rating: 2,
//     image: "meal3.png",
//     review: "Good",
//     meal_id: 3
// })
module.exports = { getAllMeals, getMealById, getMealReviews, addMealReview }
