const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function () {
    console.log("Server is up")
})

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req,res){
        const query = req.body.cityName;

    

    const url =
        "https://api.openweathermap.org/data/2.5/forecast?&q=" +query+ "&units=metric&appid=7f71cc04b3c73bbf8a6a452e96b6e330";
    https.get(url, function (response) {
        console.log(response.statusCode);

        let data = "";
        response.on("data", function (chunk) {
            data += chunk;
        });
        res.setHeader("Content-Type", "text/html");

        response.on("end", function () {
            try {
                const weatherData = JSON.parse(data);
                const temp = weatherData.list[0].main.temp;
                const description = weatherData.list[0].weather[0].description;
                const city = weatherData.city.name;
                const icon = weatherData.list[0].weather[0].icon
                const imageURL = "https://openweathermap.org/img/wn/" +icon+ "@2x.png"
                res.write("Weather of " + query + " is " + temp + " C ");
                res.write("The weather is " + description);
                res.write("<img src=" + imageURL +">");
                res.send()
                
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        });
    }).on("error", function (error) {
        console.error("Error making HTTP request:", error);
    });

});




