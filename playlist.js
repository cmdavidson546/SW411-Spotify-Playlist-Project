const express = require("express");
const bodyParser = require("body-parser");
const iheart = require("iheart");
const request = require("request");
//const iheart = require('./');
const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static("public"));


app.get("/", function(req, res) {
    
    res.sendFile(__dirname + "/index.html");    
});


app.post("/", function(req, res) {
    
    // get status of return button hit within index.html (from app.get)
    var status = res.statusCode;
    console.log(status);
    
    // SET VARS from User Defined Fields in index.html file
    var email = req.body.email;
    //var uStation = req.body.station;
    var uStation = req.body.dropdown;
    
    async function main() {
        
        // setup array up to N collections w/ process.argv[N]
        // then print with matches.stations[i]
        const matches = await iheart.search(process.argv[2] || uStation);
        //console.log(matches);
        
    
        // get stations from search() 
        const station = matches.stations[0];
        const station2 = matches.stations[1];
        //const station3 = matches.stations[2];

        // get name of stations to display
        const name = matches.stations[0].name; 
        const name2 = matches.stations[1].name;
        //const name3 = matches.stations[2].name;

        // get url for streaming
        const stream = await iheart.streamURL(station);
        const stream2 = await iheart.streamURL(station2);
        //const stream3 = await iheart.streamURL(station3);


        res.write("<h1>Top 2 Stations</h1>");
        res.write("<p>" + name + "</p><p>" + stream + "</p>");
        res.write("<p>" + name2 + "</p><p>" + stream2 + "</p>");
        //res.write("<p>" + name3 + "</p>");

        res.send();
 
    }

    main().catch(err => {
        console.error(err);
        process.exit(1); });
    
});



// Horoku requires listening on PORT
// check if using local server, use localhost:8000
var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function() {
    console.log("Server started on port 8000");
});


