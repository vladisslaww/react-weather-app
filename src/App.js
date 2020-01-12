import React, { useState } from 'react';
import Unsplash from 'unsplash-js';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

const apiWeather = {
  key: "f8c74810d55e5f51d4eae1a2bb4a9c25",
  base: "https://api.openweathermap.org/data/2.5/"
}

const unsplash = new Unsplash({ accessKey: "9bef8449c24d6e11fbf70b1d1b2a35573821f80710f14e02c12f0d1afcc4d0cb" });
const gradient = 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75)), ';

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('warm-bg.jpg');
  const [isLoading, setIsLoading] = useState(false);

  const search = async () => {
    if (query.length > 0) {
      setIsLoading(true);
      const responseWeather = await fetch(`${apiWeather.base}weather?q=${query}&units=metric&APPID=${apiWeather.key}`);
      const resultWeather = await responseWeather.json();

      if (resultWeather.weather === undefined) return setIsLoading(false);

      const responseUnsplash = await unsplash.photos.getRandomPhoto({ query: resultWeather.weather[0].main + ' weather'})
      const resultUnsplash = await responseUnsplash.json();

      if (resultUnsplash.urls !== undefined) setBackgroundUrl(resultUnsplash.urls.regular)
      setWeather(resultWeather);
      setIsLoading(false);
    }
  }

  return (
    <BlockUi tag="main" blocking={isLoading} className="app" style={{backgroundImage: gradient + "url(" + backgroundUrl + ")"}}>
      <div className="search-box">
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setQuery('')}
          value={query}
          onKeyPress={(e) => e.key === 'Enter' && search()}
          onBlur={search}
        />
      </div>
      { weather.main === undefined &&
        <h2 className="location">Enter your city</h2>
      }
      { weather.main !== undefined &&
        <React.Fragment>
          <h2 className="location">{weather.name}, {weather.sys.country}</h2>
          <h3 className="date">{dateBuilder(new Date())}</h3>
          <h1 className="temp">{Math.round(weather.main.temp)}°C</h1>
          <p className="weather">{weather.weather[0].main}</p>
        </React.Fragment>
      }
    </BlockUi>
  );
}

function dateBuilder(date) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export default App;
