const table = document.getElementById('forecast-table');
const url = 'https://cors-anywhere.herokuapp.com/https://samples.openweathermap.org/data/2.5/forecast?id=524901&appid=b6907d289e10d714a6e88b30761fae22';

async function getData(){
    const response = await fetch(url); //uses fetch API to get forecast info from JSON file
    
    return response.json(); //returns response to fetch request, but also converts promise => json
}

function createNode(element){
    return document.createElement(element);
}

function append(parent, element){
    return parent.appendChild(element);
}

async function getCityName(){
    let data = await getData(); //calls getData to retrieve JSON file
    return data.city.name; //gathers name of city and return after
}

function fillCityName(){
    let cell = document.getElementById("city-name");
    getCityName() //calls an async function to perform a fetch
        .then(cityName => cell.innerHTML = cityName); //change text inside td to cityName
}

function fillRest(){
    tableBody = document.getElementById("table-body");
    let forecast;

    getData().then(data => {
        forecast = data.list; //forecast stores the list where all info other than city name is stored
        let listPos = 0; //position in list

        for(let row = 0; row < 5; row++){ //to add a new row, and to begin adding data for new day
            let tblRow = createNode("tr");
            
            //for every new day, new data is created to store the new days initial values, starting from 00:00:00
            let date = new Date(forecast[listPos].dt_txt); 
            let maxTemp = forecast[listPos].main.temp_max; 
            let dailyHumidity = []; 
            let currDate = new Date(forecast[listPos].dt_txt) //used for comparing in boolean expression below

            while(currDate.getDay() == date.getDay()){ //currDate is incremented by 3 hours, while date stays the same, so you can collect data for the day within each 3 hour interval
                let currElement = forecast[listPos];
                if(currElement.main.temp_max > maxTemp){ //stores max temp through comparing new and old max temperatures
                    maxTemp = currElement.main.temp_max;
                }
                dailyHumidity.push(currElement.main.humidity);
                currDate.setHours(currDate.getHours() + 3);
                listPos+=1;
            }
            let avgHumidity = dailyHumidity.reduce((previous, current) => current + previous) / dailyHumidity.length;

            for(let col = 0; col < 3; col++){ //to fill the cell in the row
                let tblDataCell = createNode("td");
                if(col == 0){
                    tblDataCell.innerHTML = forecast[listPos].dt_txt.split(' ')[0]; //writes date ONLY as written in JSON file
                }else if(col == 1){
                    tblDataCell.innerHTML = maxTemp;
                }else{
                    tblDataCell.innerHTML = avgHumidity;
                }

                append(tblRow, tblDataCell);
            }
            append(tableBody, tblRow);
        }
    });
}

function fillTable(){
    fillCityName(); //fill the city name first, since it takes up a whole column
    fillRest(); //fill the rest using the method above
}

fillTable(); //Fill the table