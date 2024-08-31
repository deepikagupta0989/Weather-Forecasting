import { DateTime } from "luxon";

const API_KEY = "d0faf0255577960336594739ca0edf85";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const iconUrlFromCode = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

const FormatToLocalTime = (
  secs,
  offset,
  format = "cccc dd LLL yyyy ' | Local Time ' hh:mm a"
) => DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);

const FormatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0];
  const formattedLocalTime = FormatToLocalTime(dt, timezone);

  return {
    lat,
    lon,
    name,
    country,
    temp,
   feels_like,
  temp_min,
   temp_max,
    humidity,
    details,
    icon,
    speed,
    sunrise: FormatToLocalTime(sunrise, timezone, "hh:mm a"),
    sunset: FormatToLocalTime(sunset, timezone, "hh:mm a"),
    icon: iconUrlFromCode(icon),
    formattedLocalTime,
    dt,
    timezone,
  };
};

const formatForecastweather = (secs, offset, data) => {
  //hourly
  const hourly = data
    .filter((f) => f.dt > secs)
    .map((f) => ({
      temp: f.main.temp,
      title: FormatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    })).slice(0, 5);

    const daily=data.filter((f)=>f.dt_txt.slice(-8)==="00:00:00")
    .map((f)=>({
      temp: f.main.temp,
      title: FormatToLocalTime(f.dt, offset, "ccc"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }))
  return { hourly ,daily};
};

const getFormattedWeatherData = async (searchParams) => {
  const weatherData = await getWeatherData("weather", searchParams);
  const formattedWeather = FormatCurrent(weatherData);
  const { dt, lat, lon, timezone } = formattedWeather;
  const formattedForecastweather = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units,
  }).then((d) => formatForecastweather(dt, timezone, d.list));
  return { ...formattedWeather, ...formattedForecastweather };
};

export default getFormattedWeatherData;
