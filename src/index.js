import "./style.css";

let unitGroup = "metric";

function getURL(location, unit) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=QZQJWVZEFRGJ3V7D55UPCMH24&unitGroup=${unit}`;
  getJson(url);
}

async function getJson(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response Error: ${response.status}`);
    }

    const weatherJson = await response.json();
    console.log(weatherJson)
    const weatherData = getActualData(weatherJson, unitGroup);
    console.log(weatherData);
  } catch (err) {
    throw new Error(err);
  }
}

function getActualData(json, unit) {
  const tempUnit = unit === "us" ? "°F" : "°C";
  const windUnit = unit === "metric" ? "km/h" : "mph";
  const windDeg = json.currentConditions.winddir;
  const windDir = getWindDir(windDeg);

  let weatherData = {
    address: json.resolvedAddress,
    conditions: json.currentConditions.conditions,
    actualTemp: json.currentConditions.temp + " " + tempUnit,
    feelsLike: json.currentConditions.feelslike + " " + tempUnit,
    humidity: json.currentConditions.humidity + " %",
    precipitationChance : json.currentConditions.precipprob + " %",
    windDeg,
    windDir,
    windSpeed: json.currentConditions.windspeed + " " + windUnit,
  };

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

getURL("jamaique", unitGroup);
