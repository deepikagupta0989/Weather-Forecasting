import React, { useEffect, useState } from "react";
import { FaReact } from "react-icons/fa";
import TopButtons from "./components/TopButtons";
import Input from "./components/Input";
import TimeandLocation from "./components/TimeandLocation";
import TempAndDetail from "./components/TempAndDetail";
import Forecast from "./components/Forecast";

import getFormattedWeatherData from "./services/WeatherService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [query, setQuery] = useState({ q: "lucknow"});
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  const getweather = async () => {
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
    const CityName=query.q ?query.q:'current location';
    toast.info(`fetching weather data for ${capitalizeFirstLetter(CityName)}`)
 await getFormattedWeatherData({...query,units}).then((data) => {
  toast.success(`Data Fetched for ${data.name} and ${data.country}`)
      setWeather(data);
    });
   
  };

  useEffect(() => {
    getweather();
  },[query, units]);

const formatBackground =()=>{
  if(!weather) return 'from-cyan-600 to-blue-700';
  const threshold=units==='metric' ? 20:60
  if(weather.temp<=threshold )return 'from-cyan-600 to-blue-700'
  return 'from-yellow-600 to-orange-700'
}
  return (
    <div className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 from-cyan-600 to-blue-700 ${formatBackground()}`}>
      <TopButtons setQuery={setQuery} />
      <Input setQuery={setQuery} setUnits={setUnits} />
      { weather && (
        <>
          <TimeandLocation weather={weather} />
          <TempAndDetail weather={weather} units={units}/>
          <Forecast title="3-hour step forecast" data={weather.hourly}/>
          <Forecast title="daily forecast" data={weather.daily} />
        </>
      )}

      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored"/>
    </div>
  );
};

export default App;
