const body = document.getElementById('body');
const wrapper = document.getElementById('wrapper');
const arrowBack = document.getElementById('arrowback');
const infoTxt = document.getElementById('info-txt');
const inputField = document.getElementById('input');
const locationBtn = document.getElementById('location');
const image = document.getElementById('image');
const temp = document.getElementById('temp');
const weatherDesc = document.getElementById('weatherdesc');
const cityName = document.getElementById('cityname');
const feelsLike = document.getElementById('feelslike');
const humidityValues = document.getElementById('humidityvalue');
const windSpeed = document.getElementById('windspeed');

let api;
const apiKey = '011f387330d678efd96cdcad7ae6235c';


inputField.addEventListener("keyup", (e)=>{
    if(e.key == "Enter" && inputField.value != ""){
        requestAPI(inputField.value);
    }
})

function requestAPI(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = 'Getting Weather Details...'
    infoTxt.classList.add('pending');

    fetch(api)
    .then((res) => res.json())
    .then((result) =>{
        console.log("Weather Response: ", result);
        weatherDetails(result);
    })
    .catch(() => {
        infoTxt.innerText = "Something went wrong, API Error";
        infoTxt.classList.replace("pending", "error");
    })
}

const changeBg = (temp) => {
    if(temp < 10){
        body.style.backgroundImage = 'url("images/rain_umbrella.jpeg")'
        body.style.backgroundSize = 'cover';
        body.style.overflow = 'hidden';
    }
    else if (temp >= 10 && temp <= 20){
        body.style.backgroundImage = 'url("images/cold_weather.jpg")'
        body.style.backgroundSize = 'cover';
        body.style.overflow = 'hidden';
    }
    else if (temp >= 20 && temp <= 30){
        body.style.backgroundImage = 'url("images/ocean_moon.jpg")'
        body.style.backgroundSize = 'cover';
        body.style.overflow = 'hidden';
    }
    else if (temp >= 30 && temp <= 45){
        body.style.backgroundImage = 'url("images/land_city.jpeg")'
        body.style.backgroundSize = 'cover';
        body.style.overflow = 'hidden';
    }
}


function weatherDetails(res){
    if(res.cod == '404'){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        changeBg(res.main.temp);
        const id = res.weather[0].id;
        if (id === 800) {
            image.src = "images/id_800.png";
        } else if (id >= 200 && id <= 232) {
            image.src = "images/id_200_to_232.png";
        } else if (id >= 600 && id <= 622) {
            image.src = "images/id_600_to_622.png";
        } else if (id >= 701 && id <= 781) {
            image.src = "images/id_700_to_781.png";
        } else if (id >= 801 && id <= 804) {
            image.src = "images/id_801_to_804_CLOUDS.png";
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            image.src = "images/id_500_to_531_AND_300_to_331.png";
        }

        temp.innerText = Math.round(res.main.temp);

        let desc = res.weather[0].description;
        let captializeDesc = desc.split(' ').map
        (word=>word[0].toUpperCase() + word.slice(1)).join(' ');
        weatherDesc.innerText = captializeDesc;


        cityName.innerText = res.name + "," + " " + res.sys.country;
        feelsLike.innerText = Math.round(res.main.feels_like);
        humidityValues.innerText = res.main.humidity + "%";
        windSpeed.innerText = Math.round(res.wind.speed) + "Km/H";

        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }

}

locationBtn.addEventListener("click",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    } else {
        alert("Your Browser not support Geolocation API");
    }
})

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    console.log("Coordinates: ", latitude, longitude);
    console.log("API URL: ", api);

    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add('error');
}


arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});