const express = require("express");
const bodyParser = require("body-parser");
const iheart = require("iheart");
//const iheart = require('./');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

/* search for a station, pick the first match
const matches = await iheart.search(process.argv[2] || '1077 the bone');
const station = matches.stations[0];
*/



app.get("/", function(req, res) {
    
    res.sendFile(__dirname + "/index.html");
});


app.post("/", function(req, res) {
    
   var email = req.body.email;
   var uStation = req.body.station;
   var name = uStation;
   
    console.log(uStation);
    
    // iheart npm requires async function to work
    async function main() {
        // this method works to get a single station...
        //const { stations: [ station ] } = await iheart.search(uStation);
        
        // setup array up to N collections w/ process.argv[N]
        // then print with matches.stations[i]
        const matches = await iheart.search(process.argv[2] || uStation);
        
        
        // FUTURE: create array() to hold stations collected
        // get stations from search()
        const station = matches.stations[0];
        const station2 = matches.stations[1];
 
        // get name of stations to display
        name = matches.stations[0].name; 
        console.log(name);
        
        // get url for streaming
        const stream = await iheart.streamURL(station);
        const stream2 = await iheart.streamURL(station2);
        
        // log to console
        // FUTURE: store in JSON file for DB
        console.log({ station, stream }, {station2, stream2 });
    }

    main().catch(err => {
        console.error(err);
        process.exit(1); });
    
    // write to page /playlist.js
    res.write("<h1>You selected: " + uStation + " for station</h1>");
    
    // DOES NOT WORK --> does not contain async function val
    //res.write("<p>Best Matched Station: " + name + "</p>");
    
    res.send();
    
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


