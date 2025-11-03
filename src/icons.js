import * as icons from "../asset/WeatherIcons/SVG/3rd Set - Color/";

function getIcon(iconString) {
  for (const icon in icons) {
    console.log(icon);
  }
}

export { getIcon };
