import * as sets from "../asset/WeatherIcons/SVG";


function getIcon(iconString){
    for(const set in sets){
        console.log(set)
    }
}


export {getIcon}