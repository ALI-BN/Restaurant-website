var tabEl = document.getElementById('pills-reviews-tab')
tabEl.addEventListener('shown.bs.tab', function (event) {
    showReviews(tabEl.dataset.meal)
})

function toCart(id) {
    let count = document.querySelector("#counter-number").innerHTML;
    location.href = `/sales/cart?id=${id}&count=${count}&back=/detail/${id}`
}

function inc() {
    let a = document.querySelector("#counter-number").innerHTML;
    a = parseInt(a)
    a = a + 1;
    document.getElementById("counter-number").innerHTML = a;
}

function dec() {
    let a = document.querySelector("#counter-number").innerHTML;
    a = parseInt(a)
    if (a > 0) {
        a = a - 1;
    }

    document.getElementById("counter-number").innerHTML = a;
}

function updateCartCounter() {
    document.querySelector("#cart-item").innerHTML = cart.length
}

function showForm() {
    let form = document.querySelector(".rate-form")
    if (form.classList.contains("show-transition")) {
        form.classList.remove("show-transition")
    }
    else {
        form.classList.add("show-transition")
    }
}
async function showReviews(id) {
    const carousel = document.querySelector('#carousel-reviwes')

    const response = await fetch(`/${id}/reviews`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const data = await response.json()
    let innerhtml = '';
    let indicators = '';
    if (data.length != 0) {
        carousel.classList.remove('hide')
        carousel.parentElement.children[0].classList.add('hide')
        for (let i = 0; i < data.length; i++) {
            const item = data[i]
            const rating = Math.round(item.rating)
            const date = new Date(parseInt(item.date)).toLocaleDateString()
            const stars = '<span class="star star_rating">&starf;</span>'.repeat(rating)
            const empStars = '<span class="star">&star;</span>'.repeat(Math.abs(5 - rating))
            indicators += `<button type="button" data-bs-target="#carousel-reviwes" data-bs-slide-to="${i}" ${i == 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${i}"></button>`
            innerhtml += `
            <div class="carousel-item ${innerhtml == '' ? 'active' : ''}">
            <div class="row" id="testimonials-body">
                <img class="picture col-lg-6" src="/projectImages/${item.image}" alt="review image"/>
                <div class="description-text col-lg-6">
                    <h4>${item.reviewer_name}</h4>
                    <h5>
                        <strong>${item.city} - ${date}</strong>
                        ${stars}
                        ${empStars}
                    </h5>
                    <p>${item.review}</p></div></div>
            </div>`
        }
        carousel.querySelector('.carousel-inner').innerHTML = innerhtml
        carousel.querySelector('.carousel-indicators').innerHTML = indicators
    }
    else {
        carousel.classList.add('hide')
        carousel.parentElement.children[0].classList.remove('hide')
    }

}

async function addReview(e) {
    let isValid = true
    e.preventDefault()
    const form = document.getElementsByName('rate-form')[0]
    const id = form.dataset.meal
    const name = form["name"]
    const review = form["review"]
    if (name.value === "" || name.value == null)
        name.value = "customer"
    if (review.value === "" || review.value == null) {
        form.querySelector("#review-error").innerHTML = `review is required`
        isValid = false
    }
    if (isValid) {
        const result = await submitNewReview(id, new FormData(form));
        if (result) {
            await showReviews(id)
            showForm()
        }
    }
}
async function submitNewReview(id, form) {
    const response = await fetch(`/${id}/reviews`, {
        method: "Post",
        headers: {
            'Accept': 'application/json', //receive json
            "enctype": "multipart/form-data"
        },
        body: form
    })
    if (response.ok) {
        return true
    }
}

function countText(field, cnt) {
    var lng = field.value.length;
    document.getElementById(cnt).innerHTML = lng + '/500';
}
