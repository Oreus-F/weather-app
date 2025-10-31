import "./style.css";

function getURL(location){
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=QZQJWVZEFRGJ3V7D55UPCMH24`
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


getURL('paris')