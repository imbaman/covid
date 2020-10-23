import React from 'react'
import { Circle,Popup} from 'react-leaflet';
import numeral from 'numeral'

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd7",
    multiplier: 1200,
  },
  deaths: {
    hex: "#000",
    multiplier: 2000,
  },
};

export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b)=>{
        return b.cases - a.cases
        })
        return sortedData;

}

export const showDataOnMap = (data, casesType='cases') => (
    data.map((country) => (
        <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.5}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        radius={
            Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }>
        <Popup>
            <div>
                <div> {country.country}</div>
                <div>Cases {numeral(country.cases).format("0,0")}</div>
                <div>Deaths {numeral(country.deaths).format("0,a")}</div>
                <div></div>
            </div>
        </Popup>
        </Circle>
    ))
)