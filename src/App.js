import React, {useState, useEffect} from 'react';
import {MenuItem,FormControl,Select, Card, CardContent} from "@material-ui/core"
import InfoBox from './InfoBox'
import Map from './Map'
import './App.css';
import Table from "./Table"
import {sortData} from './utilities'
import LineGraph from './LineGraph'
import LineGraphPolska from './LineGraphPolska'
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter] = useState({ lat:34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([])
  const [casesType,setCasesType] = useState('cases');
  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    })
  }, [])

  useEffect(()=>{
    const getCountriesData = async () =>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) =>{
        const countries = data.map((country)=>(
          {
            name: country.country,
            value:country.countryInfo.iso2
          }
        ))

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      })
    }
    getCountriesData()
  }, []);

  const onCountryChange = async (e)=>{
    const countryCode = e.target.value;
    setCountry(countryCode)

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response =>response.json())
    .then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(5)
    })
  }
 console.log(countryInfo)

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <h1>Covid 19 tracker</h1>
        <FormControl className="app__dropdown">
      <Select
      variant="outlined"
      onChange={onCountryChange}
      value={country}
      >
        <MenuItem value='worldwide'>World</MenuItem>
        {
          countries.map(country =>(
            <MenuItem value={country.value} key={country.name}>{country.name}</MenuItem>
          ))
        }
     
      </Select>
      </FormControl> 
      </div>

    <div className="app__stats">
        <InfoBox onClick={e=>setCasesType('cases')} title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
        <InfoBox onClick={e=>setCasesType('recovered')}title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
        <InfoBox onClick={e=>setCasesType('deaths')}title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
    </div>
  <Map casesType={casesType} countries={mapCountries} center={mapCenter}
        zoom={mapZoom}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h2>Live cases by country</h2>
          <Table countries={tableData}/>
          <h2 className="app__graphTitle">Worldwide new cases last 60 days</h2>
          <LineGraph casesType={casesType} className="app__graph"/>
           {/* <LineGraphPolska/> */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
