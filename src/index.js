import "./style.css";
import {format} from "date-fns"

const submitLocationButton = document.querySelector("#submitLocation");
const usUnitRadio = document.querySelector("#usUnit");
const metricUnitRadio = document.querySelector("#metricUnit");
const toggleTheme = document.querySelector('#toggleTheme');

let weatherData = [];

function getLocation() {
  const searchBar = document.querySelector("#searchBar");
  const value = searchBar.value;
  return value;
}

function getURL(location) {
  const metric = "metric";

  const metricUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=QZQJWVZEFRGJ3V7D55UPCMH24&unitGroup=${metric}`;
  const usUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=QZQJWVZEFRGJ3V7D55UPCMH24`;

  getJson(usUrl, metricUrl);
}

async function getJson(usUrl, metricUrl) {
  try {
    const promises = [
      fetch(usUrl).then(function (response) {
        return checkResponseError(response);
      }),
      fetch(metricUrl).then(function (response) {
        return checkResponseError(response);
      }),
    ];

    const weatherJson = await Promise.all(promises);

    console.log(weatherJson);
    const allWeatherData = getAllData(weatherJson);
    console.log(allWeatherData)

    displayForecast(allWeatherData)

    // displayData(weatherData);
  } catch (err) {
    throw new Error(err);
  }
}

function checkResponseError(response) {
  if (!response.ok) {
    throw new Error(response.status);
  }

  return response.json();
}


function getAllData(json){
  const usData = json[0];
  const metricData = json[1];

  const usWindUnit = "mph";
  const metricWindUnit = "km/h";

  for(let x =0; x < 7; x++){
    const usDay = usData.days[x];
    const metricDay = metricData.days[x];

    let dayData = {};

    if(x===0){

      const date = format(new Date(), 'EEEE dd MMMM');
      const thumbnailDate = format(new Date(), 'E.')    
      const windDeg = usData.currentConditions.winddir;
      const windDir = getWindDir(windDeg);

      dayData = {
        us: {
          address: usData.resolvedAddress,
          conditions: usData.currentConditions.conditions,
          date,
          thumbnailDate,
          icon: usData.currentConditions.icon,
          actualTemp: usData.currentConditions.temp + " °",
          feelsLike: usData.currentConditions.feelslike + " °",
          humidity: usData.currentConditions.humidity + " %",
          precipitationChance: usData.currentConditions.precipprob + " %",
          windDeg,
          windDir,
          windSpeed: usData.currentConditions.windspeed + " " + usWindUnit,
        },

        metric: {
          address: metricData.resolvedAddress,
          conditions: metricData.currentConditions.conditions,
          date,
          thumbnailDate,
          icon: metricData.currentConditions.icon,
          actualTemp: metricData.currentConditions.temp + " °",
          feelsLike: metricData.currentConditions.feelslike + " °",
          humidity: metricData.currentConditions.humidity + " %",
          precipitationChance: metricData.currentConditions.precipprob + " %",
          windDeg,
          windDir,
          windSpeed: metricData.currentConditions.windspeed + " " + metricWindUnit,
        },
      };

    } else {
      const date = format(new Date(usDay.datetime), 'EEEE dd MMMM');
      const thumbnailDate = format(new Date(usDay.datetime), 'E.')
      const windDeg = usDay.winddir;
      const windDir = getWindDir(windDeg);

      dayData = {
        us: {
          address: usData.resolvedAddress,
          conditions: usDay.conditions,
          date,
          thumbnailDate,
          icon: usDay.icon,
          actualTemp: usDay.temp + " °",
          feelsLike: usDay.feelslike + " °",
          humidity: usDay.humidity + " %",
          precipitationChance: usDay.precipprob + " %",
          windDeg,
          windDir,
          windSpeed: usDay.windspeed + " " + usWindUnit,
        },

        metric: {
          address: metricData.resolvedAddress,
          conditions: metricDay.conditions,
          date,
          thumbnailDate,
          icon: metricDay.icon,
          actualTemp: metricDay.temp + " °",
          feelsLike: metricDay.feelslike + " °",
          humidity: metricDay.humidity + " %",
          precipitationChance: metricDay.precipprob + " %",
          windDeg,
          windDir,
          windSpeed: metricDay.windspeed + " " + metricWindUnit,
        }, 
      }


    }

    weatherData.push(dayData)
  }


  return weatherData
}


function getActualData(json) {
  const usData = json[0];
  const metricData = json[1];

  const usWindUnit = "mph";
  const metricWindUnit = "km/h";


  const windDeg = usData.currentConditions.winddir;
  const windDir = getWindDir(windDeg);

  const weatherData = {
    us: {
      address: usData.resolvedAddress,
      conditions: usData.currentConditions.conditions,
      icon: usData.currentConditions.icon,
      actualTemp: usData.currentConditions.temp + " °",
      feelsLike: usData.currentConditions.feelslike + " °",
      humidity: usData.currentConditions.humidity + " %",
      precipitationChance: usData.currentConditions.precipprob + " %",
      windDeg,
      windDir,
      windSpeed: usData.currentConditions.windspeed + " " + usWindUnit,
    },

    metric: {
      address: metricData.resolvedAddress,
      conditions: metricData.currentConditions.conditions,
      icon: metricData.currentConditions.icon,
      actualTemp: metricData.currentConditions.temp + " °",
      feelsLike: metricData.currentConditions.feelslike + " °",
      humidity: metricData.currentConditions.humidity + " %",
      precipitationChance: metricData.currentConditions.precipprob + " %",
      windDeg,
      windDir,
      windSpeed: metricData.currentConditions.windspeed + " " + metricWindUnit,
    },
  };

  console.log(test)

  return weatherData;
}

function getWindDir(deg) {
  const directions = {
    N: {
      min: 337.5,
      max: 22.5,
    },
    NE: {
      min: 22.5,
      max: 67.5,
    },
    E: {
      min: 67.5,
      max: 112.5,
    },
    SE: {
      min: 112.5,
      max: 157.5,
    },
    S: {
      min: 157.5,
      max: 202.5,
    },
    SW: {
      min: 202.5,
      max: 247.5,
    },
    W: {
      min: 247.5,
      max: 292.5,
    },
    NW: {
      min: 292.5,
      max: 337.5,
    },
  };

  let result;

  for (const [key, value] of Object.entries(directions)) {
    if (key === "N") {
      if ((deg > value.min && deg <= 360) || (deg >= 0 && deg < value.max)) {
        result = key;
      }
    } else {
      if (deg > value.min && deg < value.max) {
        result = key;
      }
    }
  }

  return result;
}

function checkSearchValid() {
  const searchBar = document.querySelector("#searchBar");
  const validityState = searchBar.validity;

  if (validityState.valueMissing) {
    searchBar.reportValidity();
    searchBar.setCustomValidity("You must write a location here !");
  } else {
    const location = getLocation();
    getURL(location);
  }
}

async function displayData(json) {
  const forecastData = document.querySelector('.forecastData')
  const thumbRadio = forecastData.querySelectorAll('input');
  const thumbnails = document.querySelectorAll('.thumbnail');

  let dataPosition;

  for(let index=0 ; index < thumbRadio.length; index++){
    if(thumbRadio[index].checked){
      dataPosition = thumbnails[index].getAttribute('data-position');
    };
  };

  const dataDay = json[dataPosition]

  const unitGroup = getUnitGroup();
  const data = dataDay[unitGroup];
  let address = data.address
  .split("")
  .map((letter, index) => {
      if (index === 0) {
        return letter.toUpperCase();
      } else {
        return letter;
      }
  })
  .join("");

  const textBeforeAdress = document.querySelector('#textLocation');
  const addressBox = document.querySelector("#addressBox");
  const iconBox = document.querySelector('#iconContent');
  const dateBox = document.querySelector('#dateBox');
  const conditionsBox = document.querySelector("#conditionsBox");
  const actualTempBox = document.querySelector("#actualTempBox");
  const actualFeelLikeBox = document.querySelector("#actualFeelLikeBox");
  const arrowBox = document.querySelector('#arrowBox');
  const windDirBox = document.querySelector("#windDirBox");
  const windSpeedBox = document.querySelector("#windSpeedBox");
  const humidityBox = document.querySelector("#humidityBox");
  const precipitationBox = document.querySelector("#precipitationBox");

  textBeforeAdress.textContent = 'Result for:';
  addressBox.textContent = address;
  iconBox.src = await getWeatherIcon(data.icon);
  dateBox.textContent = data.date;
  conditionsBox.textContent = data.conditions;
  actualTempBox.textContent = `${data.actualTemp}`;
  actualFeelLikeBox.textContent = `${data.feelsLike}`;
  arrowBox.setAttribute('style', `transform: rotate(${data.windDeg}deg)`)
  windDirBox.textContent = `Direction : ${data.windDir}`;
  windSpeedBox.textContent = `Speed: ${data.windSpeed}`;
  humidityBox.textContent = `Humidity: ${data.humidity}`;
  precipitationBox.textContent = `Precipitation: ${data.precipitationChance}`;
}


async function displayForecast(json){
  const thumbnails = document.querySelectorAll('.thumbnail');
  const unitGroup = getUnitGroup();

  for(let x=0; x < thumbnails.length; x++){
    const daysData = json[x];
    const data = daysData[unitGroup];
    
    const thumbnail = thumbnails[x];
    const child = thumbnail.children;
    
    const thumbDate = child[0];
    const thumbIcon = child[1];
    const thumbTempBox = child[2];

    const thumbDateContent = document.createElement('p');
    thumbDateContent.textContent = data.thumbnailDate;

    const thumbIconContent = document.createElement('img');
    thumbIconContent.src = await getWeatherIcon(data.icon);

    const forecastTemp = document.createElement('p');
    forecastTemp.textContent = data.actualTemp
    const forecastFeelsLike = document.createElement('p');
    forecastFeelsLike.textContent = data.feelsLike

    thumbDate.appendChild(thumbDateContent);
    thumbIcon.appendChild(thumbIconContent);
    thumbTempBox.appendChild(forecastTemp);
    thumbTempBox.appendChild(forecastFeelsLike);
  }


  displayData(json)
}


function getUnitGroup() {
  const usUnit = document.querySelector("#usUnit");
  const metricUnit = document.querySelector("#metricUnit");

  let result = usUnit.checked ? usUnit.value : metricUnit.value;

  return result;
}

async function getWeatherIcon(iconString){
  const module = await import(`../asset/icons/svg/${iconString}.svg`);
  const result = await module.default;
  return result
}


submitLocationButton.addEventListener("click", (event) => {
  event.preventDefault();

  checkSearchValid();
});

usUnitRadio.addEventListener("change", () => {
  displayData(weatherData);
});
metricUnitRadio.addEventListener("change", () => {
  displayData(weatherData);
});
toggleTheme.addEventListener('click', ()=>{
  const root = document.documentElement;
  const actualTheme = root.getAttribute('class');
  const newTheme = actualTheme === 'dark' ? 'light' : 'dark';

  root.setAttribute('class', newTheme)
})

getURL("paris");
