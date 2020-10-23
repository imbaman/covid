import React, {useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2';
import numeral from "numeral"
const options = {
    legend:{
        display:false
    },
    elements:{
        point:{
            radius:3,
        },
    },
    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect:false,
        callbacks:{
            label:function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[{
            type:"time",
            time:{
                format:'MM/DD/YY',
                tooltipFormat:"ll",
            }
        }],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    callback:function(value,index,values){
                        return numeral(value).format('0a')
                    }
                }
            }
        ]
    }
}

function LineGraphPolska({casesType = 'cases'}) {
    const [data, setData] = useState({});

const buildChartData = (data, casesType='cases') =>{
        const chartData = [];
        let lastDataPoint;
        for(let date in data.timeline.cases){
            if(lastDataPoint){
                const newDataPoint = {
                    x:date,
                    y:data.timeline[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data.timeline['cases'][date];
        }
        return chartData
    }


    useEffect(()=>{
        const fetchData = async () =>{
            await fetch('https://disease.sh/v3/covid-19/historical/Poland?lastdays=200')
        .then(response => response.json())
        .then(data=>{
            const chartData = buildChartData(data, 'cases');
            setData(chartData);
        })
        }
        fetchData()
        console.log(data)
    },[casesType]);

    

    return (
        <div>
            {data?.length > 0 && (
 <Line
            data={{
                datasets: [{
                    borderColor:'#f17e7e',
                    data:data,
                }],
            }}
           options={options}
            />
            )}
           
        </div>
    )
}

export default LineGraphPolska
