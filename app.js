
const express = require("express");
const bodyParser = require("body-parser");
const iheart = require("iheart");
const request = require("request");
//var http = require('http'); // require server access
var fs = require('fs');     // require filereader

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());   // do i need this? - jSON parses fine w/o

app.use(express.static("public"));


// SEND (RESPOND) WHEN APP.JS GETS CALLED (instead of creating server with 'http')
    // responsds to REQUESTER (user's browser) by sending file == INDEX.HTML 
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");  
});

// When index.html form is set to 'method=POST', the app picks this up here...
app.post("/", function(req, res) {    

    // get status of return button hit within index.html (from app.get)
    var status = res.statusCode;
    console.log(status);
    
    // GET POST data from Form Fields in index.html file using body.<html tag name>
    var user_name = req.body.name;
    var email = req.body.email;
    var uStation = req.body.station;
    //var timer1 = req.body.timer_user;     // offline
    var timer2 = req.body.timer_drop;
    
    /* CAN DISPLAY POST RESULTS FROM INDEX.HTML to page for debugging
    res.write(user_name + "\n");
    res.write(uStation + "\n");
    res.write(email + "\n");
    res.write(timer1 + "\n");
    res.write(timer2 + "\n");
    res.send();
    */
    
// make calls to iHeart for data asynchronously
    async function main() {
        
// MAKE API CALL TO iHEART API
        // 'matches' contains all data returned from the search call to iheart
            // STORED AS AN OBJECT...but what type???...it doesn't look like json
        
        // OPTION 1 - limit return response to N number of hits
            // set array up to N collections w/ process.argv[N]
            // argv is a convention inherited from C, where it means argument vector (array)
        //const matches = await iheart.search(process.argv[2] || uStation);
        
        // OPTION 2 - collect ALL data (returns a lot of stations by keyword)
        const matches = await iheart.search(uStation);
        
        /*
        // can log matches to console for debugging
        if(matches) {
            console.log(matches);
        } else {
            console.log("No Matching Station");
        }
        */
        
// PARSE INDIVIDUAL RETURN RESPONSE DATA BASED ON PARENT-KEY TERMS
/*        
        // to get station data, we need to use stations[] parent word 
        
        const station = matches.stations[0];
        const station2 = matches.stations[1];

        // get name of stations to display
        const name = matches.stations[0].name; 
        const name2 = matches.stations[1].name;

        // to get artist data, we need to use tracks[] parent word 
        
        const artist = matches.tracks[0].artist;
        const album = matches.tracks[0].album;
        

        // we can also (separately) get url for streaming 
        
        const stream = await iheart.streamURL(station);
        const stream2 = await iheart.streamURL(station2);
 */       
// CREATE JSON OBJECT to STORE INDIVIDUAL RESPONSE DATA (iheart doesn't return JSON specific  
        var stationData = JSON.stringify(matches);
        
  /*   
  
  //JavaScript Object not created...THIS DOES NOT WORK
        var stationData = {
            name: matches.station[0].name,
            station: matches.station[0],
            id: trackBundles.artistId[0],
            genre: trackBundles.genre[0]
        };
        
       
// TRY TO WRITE MATCHES TO A JSON FILE ON USERS COMPUTER - THIS WRITES TO A FILE 
// BUT ONLY RETURNS [Object] -> object (as text...literally...) to the file
    // for reference, sOverflow states, "[object Object] is an object toString"
    // If you want the representation of the object, use JSON.stringify
        fs.writeFile('mynewfile.json', matches.stations[0], function (err) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            console.log('Saved!');
        });
 */ 
        
        
 /*      
        // I THINK WE WILL HAVE TO FILTER THE DATE RESPONSE FROM IHEART IN ORDER TO 
        // WEED OUT - filters under PARENT.subSearchTerm like genre, id, etc...
        // we can get artistId (Parent = trackBundles) and then (hopefully) if 
        // iHeart stores this in some genre-specific order, we can filter by artist
            // ex, pull artistId from matches[0] and cross reference whether it is 
            // inside the parameters for a particular genre
        
        
         //THEN WE CAN WRITE IN HTML CODE TO DISPLAY RESULTS for debugging
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("<h1>Top 2 Stations</h1>");
        
        // using 'stations[]' search word
        res.write("<p>" + name + "</p><p>" + stream + "</p>");
        res.write("<p>" + name2 + "</p><p>" + stream2 + "</p>");
        
        // using 'tracks[]' search word
        res.write("<p>" + artist + "</p>"); 

        res.send();
*/        
        
        // we can write the JavaScript object to a file
        fs.writeFile('mynewfile.json', stationData, function (err) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            console.log('Saved!');
        });
        
       
        // RESPOND BY SENDING "SUCCESS" FILE TO USER'S BROWSER as a finale
        // read the html page, pass to <data> obj to display
        fs.readFile('success.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);    // respond by writing html page
            res.end();
        });
       
          

        
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

// HERE ARE THE PARENT TERMS FOR SPECIFIC SEARCHES - trackBundles, tracks, artists, stations; then we can parse using the following script:
// matches.PARENT_TERM[index].SUB_TERM_TO_SEARCH
/*

// HERE ARE INITIAL SEARCH RESULTS...header for response???
{ errors: null,
  duration: 183,
  bestMatch:
   { objType: 'STATION',
     id: 3278,
     confidenceVal: 0.7333333333333333 },
  bestMatches: null,
  totalTracks: 22629,
  totalBundles: 3180,
  totalArtists: 834,
  totalStations: 2,
  totalFeaturedStations: null,
  totalTalkShows: null,
  totalTalkThemes: null,
  totalPrnEpisodes: null,
  totalKeywords: null,

// THEN WE GET TO THE PARENT AND SUB SEARCH TERMS
trackBundles:
   [ { title: 'Rocke Alliansen',
       artist: 'Various Artists',
       albumId: 67055292,
       artistId: 6,
       copyright: '2015 Rapid Records',
       numberOfTracks: 0,
       tracks: null,
       streamReady: false,
       trackBundleType: null,
       version: null,
       releaseDate: 1424908800000,
       numberOfVolumes: 0,
       genre: 'Rock',
       genreId: null,
       explicitLyrics: false,
       score: 22020.46,
       rank: null,
       searchScore: 22020.46,
       allowStreaming: false,
       rightsAllowed: false,
       calculatedType: null,
       imagePath:
        'http://image.iheart.com/ihr-ingestion-pipeline-production-orchard/7071245177980/7071245177980.jpg',
       recordLabelRestValue: [Object],
       smallAlbumCover: null,
       mediumAlbumCover: null,
       largeAlbumCover: null,
       currencyCode: null,
       fileSize: 0,
       albumRank: null,
       albumType: null,
       trackOnly: false },

tracks:
   [ { artistId: 32322476,
       albumId: 9647496,
       trackId: 9647499,
       title: 'Rocketeer',
       artist: 'Far East Movement & Ryan Tedder',
       album: 'Free Wired',
       copyright: null,
       trackDuration: 211,
       volumeNumber: 1,
       trackNumber: 3,
       version: null,
       streamReady: true,
       albumCalculatedType: null,
       albumNrOfVolumes: 0,
       popularity: 0,
       searchScore: 1.7198174,
       imagePath:
        'http://image.iheart.com/ihr-ingestion-pipeline-production-umg/bypass/redelivery/NEW_CONTENT_RADIO/00602527363257_20180704111613328/00602527363257_T1_cvrart.jpg',
       previewPath:
        'null/UMG7/Thumb_Preview/Fulltrack/UMG/Oct10/100510/00602527363257/UMG_audclp_00602527363257_01_003_61.mp3',
       lastUpdated: null,
       sortOrder: 0,
       artistName: 'Far East Movement & Ryan Tedder',
       explicitLyrics: false,
       hotness: 0,
       familiarity: 0,
       lyricsId: 0,
       score: 1.7198174,
       rank: 443312,
       modifyArt: false,
       playbackRights: null,
       recordLabel: [Object],
       externalTrackId: null },

artists:
   [ { artistName: 'Rockell',
       artistId: 27181,
       info: null,
       link: null,
       artistBio: null,
       variety: null,
       score: 1.9894632,
       rank: 2742846,
       trackBundles: null,
       tracks: null,
       roviImages: null,
       totalTracks: null,
       totalBundles: null,
       formats: null,
       format: 'OTHER' },
        
stations:
   [ { id: 3278,
       name: '96.1 The Rocket',
       description: 'The Gulf Coast Home of Classic Rock',
       frequency: '96.1',
       band: 'FM',
       callLetters: 'WRKH-FM',
       city: 'Mobile',
       state: 'AL',
       logo:
        '{img_url_1}/2135/2015/09/200x200/wrkh_fm_600_0_1442242160.png',
       shareLink: null,
       dartUrl: null,
       score: 2.4884198,
       rank: null,
       newlogo:
        'http://i.iheart.com/v3/re/new_assets/15a39216-5608-4302-8640-7a13c46bcd40' },


*/

