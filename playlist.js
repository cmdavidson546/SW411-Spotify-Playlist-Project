const express = require("express");
const bodyParser = require("body-parser");
const iheart = require("iheart");
const request = require("request");
var fs = require('fs');     // require filereader

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");  
});

app.post("/", function(req, res) {    

    var status = res.statusCode;
    console.log(status);

    var user_name = req.body.name;
    var email = req.body.email;
    var uStation = req.body.station;
    var timer2 = req.body.timer_drop;
    
    async function main() {
        
        const matches = await iheart.search(uStation);
        var stationData = JSON.stringify(matches);
         
         fs.writeFile('iheartRETURN.json', stationData, function (err) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            console.log('Saved!');
        });
        /*
        // OPEN SPOTIFY LOGIN PAGE - DOES NOT WORK
        // NEED TO CONNECT THE DESTINATION PAGE BACK TO SERVER
        // place inside fs.writefile function
        fs.readFile('spotifyAuth.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);    // respond by writing html page
            res.end();
        });
        */
        
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

// CALLBACK FROM SPOTIFY LOGIN DOES NOT WORK...need to "catch" the page here or create another page to catch http://localhost:8000/callback

var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function() {
    console.log("Server started on port 8000");
});


/*

// HERE ARE INITIAL SEARCH RESULTS...header of response
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

// THEN WE GET TO THE PARENT AND CHILD SEARCH TERMS returned from iHeart
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
       trackOnly: false }, ...

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
       externalTrackId: null }, ...

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
       format: 'OTHER' }, ...
        
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
        'http://i.iheart.com/v3/re/new_assets/15a39216-5608-4302-8640-7a13c46bcd40' }, ...


*/