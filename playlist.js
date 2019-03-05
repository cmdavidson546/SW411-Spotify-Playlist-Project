const express = require("express");
const bodyParser = require("body-parser");
const iheart = require("iheart");
//const iheart = require('./');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* search for a station, pick the first match
const matches = await iheart.search(process.argv[2] || '1077 the bone');
const station = matches.stations[0];
*/

// REMAINING QUESTIONS -
// 1. need to use the JSON object returned by API
    // async function() doesn't allow use of vars outside scope
    // can we create a .JSON file? Storage issues.
    // do something with other than console.log
// 2. Do we need/want to use RECIVE() from npm download???


app.get("/", function(req, res) {
    
    res.sendFile(__dirname + "/index.html");
});


app.post("/", function(req, res) {
    
   var email = req.body.email;
   var uStation = req.body.station;
   //var name = uStation;
   
    console.log(uStation);
    
    // iheart npm requires async function to work
    async function main() {
        const N = 3;    // match search() parameter .argv[]
        var n = N;
        // setup array up to N collections w/ process.argv[N]
        // then print with matches.stations[i]
        const matches = await iheart.search(process.argv[2] || uStation);

        /* 
        // CHECK FOR EMPTY/NULL SET TO AVOID CRASH
        
        for(var i = 0; i < N; i++) {
            var test1 = matches.stations[i];
            if(test1 == null) {
                n = n-1;
            }
        }
        
        while(n > 0) {
            
        }
        */
        // get stations from search() 
        const station = matches.stations[0];
        const station2 = matches.stations[1];
        //const station3 = matches.stations[2];
 
        // get name of stations to display
        const name = matches.stations[0].name; 
        const name2 = matches.stations[1].name;
        //const name3 = matches.stations[2].name;
        
        res.write("<h1>Top 2 Stations</h1>");
        res.write("<p>" + name + "</p>");
        res.write("<p>" + name2 + "</p>");
        //res.write("<p>" + name3 + "</p>");
        res.send();

        // get url for streaming
        const stream = await iheart.streamURL(station);
        const stream2 = await iheart.streamURL(station2);
        //const stream3 = await iheart.streamURL(station3);
        
        
        
        // log to console
        // FUTURE: store in JSON file for DB
        console.log({ station, stream }, {station2, stream2 });
    }

    main().catch(err => {
        console.error(err);
        process.exit(1); });
    
    // write to page /playlist.js
    //res.write("<h1>You selected: " + uStation + " for station</h1>");
    
    // DOES NOT WORK --> does not contain async function val
    //res.write("<p>Best Matched Station: " + name + "</p>");
    
    //res.send();
    
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


