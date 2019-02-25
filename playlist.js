const express = require("express");
const ihr = require("iheartradio");
const app = express();

// next we create body-parser requirement to parse UI data
const bodyParser = require("body-parser");
// next we HAVE TO SET UP PARSER LIKE THIS...
app.use(bodyParser.urlencoded({extended: true}));

// change "/" with HOMEPAGE (server)
// when server loads it sends the users browser the html file
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html"); 
});


// .post will handle any "method=post" requests that come in
app.post("/", function(req, res) {
    
    var userstation = req.body.station;     // get user input here
    
ihr.search(userstation, {       // place into search for parameter
  "secure": false,
  "maxRows": 5, 
  "bundle": false,
  "station": true,
  "artist": true,
  "album": false,
  "track": false,
  "playlist": true,
  "podcast": false
  }).then(results => {
    res.send(results);          // need to parse this data out
}).catch(console.error);   
    
}); // end .post()


// Horoku requires listening on PORT
// check if using local server, use localhost:8000
var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function() {
    console.log("Server started on port 8000");
});

/*
app.listen(8000, function() {
    
    console.log("Server started on port 8000");
});
*/