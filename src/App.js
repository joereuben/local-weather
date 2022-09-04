import {useState, useEffect} from 'react'
const endPoint = "https://weather-proxy.freecodecamp.rocks/api/current?"

function App() {
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [temperature, setTemperature] = useState(0)
  const [metric, setMetric] = useState("°C")
  const [img, setImage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // window.addEventListener("load", (e) =>{
  //   console.log("loaded")
  // })

  function changeMetric() {
    if (metric === "°C") {
      let fa = (temperature * 1.8) + 32
      setTemperature(fa.toFixed(1))
      setMetric("°F")
      return
    }

    let c = (temperature - 32) / 1.8
    setTemperature(c.toFixed(1))
    setMetric("°C")
  }

  function fetchWeatherInfo() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
      console.log("Geolocation is not supported by this browser.")
    }
  }

  function showPosition(position) {
    let params = `lon=${position.coords.longitude}&lat=${position.coords.latitude}`
    loadInfo(endPoint+params)
  }

  function showError(error) {
    setError(true)
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.")
        setErrorMessage("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.")
        setErrorMessage("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.")
        setErrorMessage("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.")
        setErrorMessage("An unknown error occurred.")
        break;
      default:
        setErrorMessage("An unknown error occurred.")
        break;
    }
  }

  async function loadInfo(url) {
    const response = await fetch(url)
    const weather = await response.json();
    
    setTemperature(weather.main.temp.toFixed(1))
    setLocation(weather.name +", "+weather.sys.country)
    setImage(weather.weather[0].icon)
    setDescription(weather.weather[0].description)
    setMetric("°C")
    setLoading(false)
    setError(false)
    
  }

  useEffect(() => {
    fetchWeatherInfo()
  
  }, []);

  if(loading){
    return (
      <h2> Loading Weather Data...</h2>
    )
  }

  if(error){
    return (
      <h2>{errorMessage}</h2>
    )
  }
  return (
    <div className="container">
     <h1>Weather App</h1>
     <h4>The weather in your current location</h4>
     <section>
        <div className="location">
          <i className="fa-solid fa-location-dot"></i> {location}
        </div>
        
        <div className="temp">
          <span className="value">{temperature}</span>
          <span className="metric">{metric}</span>
          <button onClick={changeMetric} id="switch" title='toggle units'>
            <i className='fa-solid fa-repeat'></i>
          </button>
        </div>
        <div>
          <i><q>{description}</q></i> 
        </div>
        <div className="cloud">
          <img src={img} alt="" />
        </div>
        
     </section>
     <div>
      <code>developed by <a href="https://www.freecodecamp.org/reujoe" target="_blank" rel="noopener noreferrer">Joseph Amofa</a>  </code>
     </div>
    </div>
  );
}

export default App;
