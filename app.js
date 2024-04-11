const weatherData = async () => {
    let api = "https://api.openweathermap.org/data/2.5/weather?q=bangalore&appid=1abdea4113c7cab622904265993f9bdc";
    try{
        let res = await fetch(api);
        let data = await res.json();
        console.log(data);
    }catch(error){
        console.log(error);
    }
}

weatherData();