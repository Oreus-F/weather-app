import "./style.css";

let unitGroup = "metric";


function getURL(location, unit){
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=QZQJWVZEFRGJ3V7D55UPCMH24&unitGroup=${unit}`
    getJson(url);
};


async function getJson(url){
    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`Response Error: ${response.status}`);
        };

        const weatherData = await response.json();

        console.log(weatherData);

    } catch(err){
        throw new Error(err)
    }
};


function getData(json, unit){
    const tempUnit = unit === "us" ? "°F" : "°C";
    const windUnit = unit === "metric" ? "Km/h" : "mph";

    let weatherData = {
        adress: json.adress,
        conditions: json.currentConditions.conditions,
        actualTemp: json.currentConditions.temp + "" + tempUnit,
        feelsLike: json.currentConditions.feelslike + "" + tempUnit,

        windSpeed: json.currentConditions.windspeed + "" + windUnit
    }

    const windDir = json.currentConditions.windDir;
};


function getWindDir(deg){
    const directions = {
        N: {
            min: 337.5,
            max: 22.5
        },
        NE: {
            min: 22.5,
            max: 67.5
        },
        E: {
            min: 67.5,
            max: 112.5
        },
        SE: {
            min: 112.5,
            max: 157.5
        },
        S: {
            min: 157.5,
            max: 202.5
        },
        SW: {
            min: 202.5,
            max: 247.5
        },
        W: {
            min: 247.5,
            max: 292.5
        },
        NW: {
            min: 292.5,
            max: 337.5
        },
    }

    let result;

    for(const [key, value] of Object.entries(directions)){
        if(key === "N"){
            if((deg > value.min && deg <= 360) || (deg >= 0 && deg < value.max)){
                result = key
            };
        } else {
            if (deg > value.min && deg < value.max){
                result = key
            };
        };
    };


    return result
}


getURL('paris', unitGroup)