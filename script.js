"use strict"

const all_web = document.querySelector(".all-web")
const btnMiles = document.querySelector(".btnMiles")
const btnKm = document.querySelector(".btnKm")
const searchCar = document.querySelector(".search")
const base_url = "./data.json"
let carsData

getCars(base_url)

async function getCars(base_url) {
    const resp = await fetch(base_url)
    carsData = await resp.json()
    console.log({
        carsData
    })
    showCars(carsData)
} 

searchCar.addEventListener("input", (e) => {
    if (!carsData) return
    const searchValue = e.target.value.toLowerCase()

    const filteredCars = carsData.filter(car => {
        return car?.make?.toLowerCase()?.includes(searchValue) ||
            car?.model?.toLowerCase()?.includes(searchValue) ||
            car?.version?.toLowerCase()?.includes(searchValue)
    })

    if (searchValue?.length == 0) {
        showCars(carsData)
        return
    }
    showCars(filteredCars)
})

//  Favorite icon
const addFavorite = (favoriteId) => {
    const car = carsData.find(c => c.id == favoriteId)
    if (car.status == "SOLD") return
    const icon = document.getElementById("fav-" + favoriteId)

    icon.classList.toggle("favorite-active")
    const favorites = getFavorites()
    const isFavoriteIndex = favorites.findIndex(favId => favId == favoriteId)
    if (isFavoriteIndex >= 0) {
        favorites.splice(isFavoriteIndex, 1)
    } else {
        favorites.push(favoriteId)
    }
    localStorage.setItem("favorites", JSON.stringify(favorites))
}

function getFavorites() {
    const favorites = localStorage.getItem('favorites')
    if (favorites) {
        return JSON.parse(favorites)
    }
    return []
}

function showCars(cars) {
    if (!cars) return
    const newCard = document.createElement("div")
    const favorites = getFavorites()
    let allWebInnerHtmlStr = ``
    cars.forEach((car) => {
        allWebInnerHtmlStr += `
        <div class="col-sm-12 col-md-6 col-lg-4" id="${car.id}">
        <div class="bg-body car_shop ${car.status=="SOLD"?"soldCar":""}">
          <figure class="figure img_relativ w-100 mb-0">
            <p class="km">
              <span class="bullet"></span>
              <span class='kmMi'> Km </span>
              <span class='kmMi-value'>${car?.isKm0?"0":car.km}</span>
            </p>
            <img src="${car.image}" class="figure-img img-fluid" alt="...">
          </figure>
          <div class="content">
            <h3>${car.make}</h3>
            <h6 class="mb-0">${car.model}</h6>
            <div class="ruler"></div>
            <p>A partire da</p>
            <h4 class="d-flex justify-content-between car-price">€ ${car.price} <ion-icon class='favorite ${favorites.includes(car.id)?"favorite-active":""}' id="fav-${car.id}" onclick="addFavorite(${car.id})" name="heart"></ion-icon>
            </h4>
            <div>
              <div class="row details">
                <div class="car-details">
                  <h6>${car?.registrationYear ? car?.registrationYear +"-":""} <span class='km_or_miles'>${car?.isKm0?0:car.km}</span>- Electro </h6>
                  <h6 class="car-specs">Cons.Comb. Carburante: ${car.homologationStandard.wltp.consumption.combined} ${car.homologationStandard.wltp.consumption.unitOfMeasure} - ${car.co2}: 147 g/km </h6>
                </div>
                <div class="green-icon">
                  <img class="energyTabel" src="./assets/a+.png">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`

        //  Convert km to miles
        btnMiles.addEventListener("click", () => {
            cars.forEach((car) => {
                let km = car.km
                let miles = km / 1.609
                if (car.isKm0) {
                    miles = 0;
                };
                miles = miles.toFixed(0)
                let carElem = document.getElementById(car.id)
                carElem.querySelector('.km_or_miles').innerHTML = miles
                carElem.querySelector('.kmMi-value').innerHTML = miles
                carElem.querySelector('.kmMi').innerHTML = '  Miles  '
            })
        })

        //  Convert miles to km
        btnKm.addEventListener("click", () => {
            cars.forEach((car) => {
                if (car.km < 0) {
                    car.km = 0
                }
                let carElem = document.getElementById(car.id)
                carElem.querySelector('.km_or_miles').innerHTML = car.km
                carElem.querySelector('.kmMi-value').innerHTML = car.km
                carElem.querySelector('.kmMi').innerHTML = 'Km  '
            })
        })
    })
    all_web.innerHTML = allWebInnerHtmlStr
    all_web.appendChild(newCard);
}