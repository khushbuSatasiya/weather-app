import { FC, useEffect, useState } from "react";

import axios from "axios";

import { formattedTime, getDate, getDay, getTime } from "shared/util/utility";
import Spinner from "shared/components/spinner/spinner";

import LineChart from "./lineChart";

import "../style/weather.scss";

const Weather: FC = () => {
  let apiKey = process.env.REACT_APP_API_KEY;

  const [currentWeatherData, setCurrentWeatherData] = useState<any>(null);
  const [forecastWeatherData, setForecastWeatherData] = useState<any>(null);
  const [filteredForecasts, setFilteredForecasts] = useState<any>();
  const [locationData, setLocationData] = useState<string>("");

  const fetchCurrentWeatherData = async (location = "Ahmedabad") => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}`
      );
      setCurrentWeatherData(response.data);
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  const fetchForecastWeatherData = async (location = "Ahmedabad") => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`
      );
      setForecastWeatherData(response.data);
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  const time = getTime(currentWeatherData?.location.localtime);
  const date = getDate(currentWeatherData?.location.localtime);
  const days = getDay(currentWeatherData?.location.localtime);

  useEffect(() => {
    const hourlyForecasts = currentWeatherData?.forecast.forecastday[0].hour;
    if (hourlyForecasts) {
      const filteredForecast = hourlyForecasts.filter(
        (hour: any, index: number) => index % 4 === 0
      );
      setFilteredForecasts(filteredForecast);
    }
  }, [currentWeatherData]);

  const getWeatherLabel = (code: number) => {
    let label = "Unknown";

    switch (code) {
      case 1000:
        label = "Sunny";
        break;
      case 1063:
        label = "Patchy rain nearby";
        break;
      case 1003:
        label = "Partly cloudy";
        break;
      default:
        break;
    }

    return label;
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      fetchForecastWeatherData(e.target.value);
      fetchCurrentWeatherData(e.target.value);
    }
  };
  const handleChange = (value: string) => {
    setLocationData(value);
  };

  useEffect(() => {
    console.log(currentWeatherData);
  }, [currentWeatherData]);

  useEffect(() => {
    fetchCurrentWeatherData();
    fetchForecastWeatherData();
  }, []);

  if (!currentWeatherData && !forecastWeatherData) {
    return (
      <div className="display-flex-center height--full-viewport">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="weather width--full">
        <div className="box flex flex--column width--full height--full m--0-auto border-radius--md z-index--2">
          <div className="flex flex--row">
            <div className="current">
              <div className="today__weather">
                <div className="flex flex--row align-items--center justify-content--between">
                  <div>
                    <div className="flex align-items--center">
                      <h3 className="text--white font--semi-bold">
                        {currentWeatherData?.location.name}
                      </h3>
                      {/* {WeatherIcon(currentWeatherData?.current.condition.code)} */}
                      <img
                        src={currentWeatherData?.current.condition.icon}
                        alt="weather-img"
                      />
                    </div>
                    <p className="text--white">
                      Currently in {currentWeatherData?.location.name} {date}-{" "}
                      {time}, {days}
                    </p>
                    <h1 className="text--white mt--8">
                      {currentWeatherData?.current.temp_c}°c
                    </h1>
                  </div>
                  <input
                    type="text"
                    className="search-input bg--white font-size--browser-default"
                    value={locationData}
                    placeholder="Search.."
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                  <div className="submit__search border-radius--xxl cursor--pointer pl--10 pr--5">
                    <span>Search</span>
                  </div>
                </div>
              </div>
              <div className="today-forecast__weather border-radius--md">
                <h5 className="text--white">Today's Forecast</h5>
                <div className="flex justify-content--around">
                  {filteredForecasts?.map((data: any, index: number) => {
                    const { time, temp_c } = data;
                    return (
                      <div
                        className="today-forecast__weather-box flex flex--column  "
                        key={index}
                      >
                        <p className="text--center font--medium">
                          {formattedTime(time)}
                        </p>
                        <img src={data.condition.icon} alt="weather-img" />
                        <h6 className="text--center no--margin">{temp_c}°c</h6>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                {currentWeatherData?.forecast.forecastday[0].hour.length >
                  0 && (
                  <LineChart
                    chartData={currentWeatherData?.forecast.forecastday[0].hour}
                  />
                )}
              </div>
            </div>
            <div className="forecast border-radius--md">
              <h5 className="text--center">7-day Forecast</h5>
              <div className="flex flex--column">
                {forecastWeatherData?.forecast?.forecastday.map(
                  (data: any, index: number) => {
                    const { date, code } = data;
                    return (
                      <div
                        className="day-forecast__weather-box flex flex--row align-items--center justify-content--around"
                        key={index}
                      >
                        <p className="text--center font--medium max-width--125px">
                          {getDay(date)}
                        </p>
                        <div className="flex flex--column align-items--center">
                          <div className="weather-img">
                            <img
                              src={data.day.condition.icon}
                              alt="weather-img"
                            />
                          </div>
                          <p>{getWeatherLabel(data.day.condition.code)}</p>
                        </div>
                        <h6 className="text--center ">
                          {data.day.avgtemp_c}°c/ {data.day.avgtemp_f}°F
                        </h6>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Weather;
