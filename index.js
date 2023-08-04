//API CONNECTED

const apiKey="916448b16cde6a8ea0ced194f158de72"
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q="

async function checkweather(CITY){
  const response = await fetch(apiUrl+ CITY+ `&appid=${apiKey}`)
  let data= await response.json();
  console.log(data);
  document.querySelector('.citi').innerHTML=data.name
  document.querySelector('.tempdata').innerHTML=`Temp:  ${data.main.temp}°c`
  document.querySelector('.lon').innerHTML=`longitude: ${data.coord.lon}`
  document.querySelector('.lat').innerHTML=`latitude:${data.coord.lat}`
  document.querySelector('.sunrise').innerHTML= `<img src="imgs/sunrise.png" class="smalls"></a>  sunrise: ${unixTimestampToDateTime(data.sys.sunrise)} am`
  document.querySelector('.sunset').innerHTML = `<img src="imgs/sunset.png" class="smalls"></a> sunset:  ${unixTimestampToDateTime(data.sys.sunset)} pm`
  document.querySelector('.visibility').innerHTML=`<img src="imgs/eye_5516031.png" class="smalls"></a> Visibility: ${data.visibility}`
  document.querySelector('.sky').innerHTML=`<img src="imgs/cloud.png" class="smalls"> sky condition: ${data.weather[0].description}`
  document.querySelector('.deg').innerHTML=`<img src="imgs/360-degrees.png" class="smalls"> degree: ${data.wind.deg}°`
  document.querySelector('.direction').innerHTML=`<img src="imgs/directions.png" class="smalls"> direction: ${degToCardinal( data.wind.deg)}`
  document.querySelector('.speed').innerHTML=`<img src="imgs/speed.png" class="smalls"> speed:${data.wind.speed}`
  document.querySelector('.info').style.display="block"
  document.querySelector('.right').style.display="block"
}

//API CONNECTED

//background settings
setBackgroundByTime();

function setBackgroundByTime(){
  const date = new Date();
  const hour = date.getHours();

  if(hour>=6 && hour<18)
  {
    document.body.style.backgroundImage= "url('imgs/mor.jpg')";
  }
  else if(hour>=18 && hour<21)
  {
    document.body.style.backgroundImage="url('imgs/eve.jpg')";
  }
 else 
  {
    document.body.style.backgroundImage="url('imgs/night.jpeg')";
    let cha = document.querySelector('.title')
   cha.style.color = 'white';
  }
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundAttachment = "fixed";
}




function getWeather()
{
   const city = inserts.value.trim();
   if(city===''){
    setBackgroundByTime();
   }
   else
   {
    fetchWeatherData(city);
   }
}

async function fetchWeatherData(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = await response.json();

    
    const weatherCondition = data.weather[0].main;
    if (weatherCondition === 'Clear') {
      document.body.style.backgroundImage = "url('imgs/clear.jpeg')";
    } else if (weatherCondition === 'Rain' || (weatherCondition === 'Drizzle')) {
      document.body.style.backgroundImage = "url('imgs/rain.jpeg')";
    } else if (weatherCondition === 'Snow') {
      document.body.style.backgroundImage = "url('imgs/snow.webp')";
    }else if (weatherCondition === 'Clouds'|| weatherCondition === 'Mist') {
      document.body.style.backgroundImage = "url('imgs/cloudy.jpeg')";
    }else if (weatherCondition === 'Haze') {
      document.body.style.backgroundImage = "url('imgs/haze.jpeg')";
    }

     else {
      
      setBackgroundByTime();
    }
    document.body.style.backgroundSize = "cover";
  }
catch (error) {
  console.error('Error fetching weather data:', error);
  
}
}

//background settings



//entering a city
let myCities=[]
const enterBtn= document.querySelector('.enter')
let inserts=document.querySelector('.city')
let UlEl=document.querySelector('.list')
const FromLocalStorage = JSON.parse( localStorage.getItem("myCities") )

if(FromLocalStorage)
{
   myCities=FromLocalStorage
   render(myCities)
}



enterBtn.addEventListener("click", function(){
  checkweather(inserts.value)
  fetchWeatherData(inserts.value)
     myCities.push(inserts.value)
     inserts.value=" "
     localStorage.setItem("myCities",JSON.stringify(myCities))
     render(myCities)
})

function render(a)
{
  let mylist=""
  for(let i=0;i<a.length;i++)
  {
    mylist +=`
               <li> 
               <button class="clk">
               ${a[i]}
               </button>
               </li>
            `;
  }

  UlEl.innerHTML = mylist


  const buttons = document.querySelectorAll('.clk');
  buttons.forEach(function(button) {
    button.removeEventListener("dblclick", handleDoubleClick); 
    button.removeEventListener("click", handleSingleClick); 
    button.addEventListener("dblclick", handleDoubleClick); 
    button.addEventListener("click", handleSingleClick);
  
  });
}

function handleDoubleClick(event) {
  const cityName = event.target.textContent.trim();
  const index = myCities.indexOf(cityName);
  if (index !== -1) {
    myCities.splice(index, 1);
    localStorage.setItem("myCities", JSON.stringify(myCities));
    console.log('myCities after delete:', myCities);
    render(myCities); 
  }
}

function handleSingleClick(event){
  const cityName = event.target.textContent.trim();
    inserts.value = cityName;  
}
//entering settings
//temp conversion

let cBtn = document.querySelector('.conC')
let fBtn = document.querySelector('.conF')

cBtn.addEventListener("click", async function() {
  const city = myCities[myCities.length - 1]; 
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  const data = await response.json();
  const t = data.main.temp;
  document.querySelector('.tempdata').innerHTML = `Temp: ${t}°c`; 
});

fBtn.addEventListener("click", async function() {
  const city = myCities[myCities.length - 1]; 
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  const data = await response.json();
  const t = data.main.temp;
  const f = (t * 9/5) + 32; 
  document.querySelector('.tempdata').innerHTML = `Temp: ${f.toFixed(2)}°F`; 
});



//timeconversion

function unixTimestampToDateTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  const formattedDateTime = `${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}

//direction detect

function degToCardinal(deg) {
  const cardinalDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const directionIndex = Math.floor((deg + 22.5) / 45) % 8;
  return cardinalDirections[directionIndex];
}


let dates =document.querySelector('.current')


function curdate()
{ const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const formattedDateTime = `${day}-${month}-${year}`
  const hour=date.getHours();
  if(hour>21 || hour<6)
  {
    dates.style.color='white'; 
     dates.innerHTML = formattedDateTime;
 
  }
  else
  {
    dates.innerHTML = formattedDateTime;
  }
}
curdate();
setInterval(curdate, 1000);

//localStorage.clear()