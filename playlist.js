const express = require("express");
const bodyParser = require("body-parser");
const iheart = require("iheart");
const request = require("request");
var fs = require('fs');     // require filereader

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));  // put css in /public storage

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");  
});

app.post("/", function(req, res) {    

    var status = res.statusCode;
    console.log(status);

    var email = req.body.email;
    
    // get artist list from user
    var artists = req.body.artist;
    console.log(artists);
    
    // split list into various artists
    artists = artists.split(',');
    console.log(artists);
    
    // get size for reference
    var size = artists.length;
    console.log(size);
    
    
    var region = req.body.region;   
    // convert: east(=NY), west(=LA), south(=Atlanta), central(=Chicago)
    console.log(region);
    
    // use for timer
    var timer2 = req.body.timer_drop;
    
    async function main() {
        const matches = await iheart.search(artists[0]);    // search 1st selected artist from arraylist
        var test = JSON.stringify(matches);
        
        // GET ARTIST - use first for debugging
        
        const artistName = matches.artists[0].artistName;
        const artistId = matches.artists[0].artistId;
        console.log(artistName);
        
        
        // best artist match has objType: 'ARTIST'       
        //const artistID = matches.bestMatch.id;  // no need index for artist search
        
        // GET ALBUMS BY ID - 
        // want to cycle through all albums here??
        // in iHeart API, trackbundles == albums
        const artistAlbum = matches.trackBundles[0].title;
        console.log(artistAlbum);
        
        
        res.write("Best Match Artist Name: " + artistName);
        res.write("\n");
        res.write("\n");

        
        
        // Can make multiple calls to iheart API inside this async function
        // this call takes the genre from FAVORITE ARTIST and gets station/artist matches
        //const matches2 = await iheart.search(bundleGenre);
        //var test2 = JSON.stringify(matches2);

        
        res.send();
        
        
        // READ OTHER PAGES TO BOUNCE OFF OF THIS SERVER
    /*    fs.readFile('success.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);    // respond by writing html page
            res.end();
        }); */
    }
 
    main().catch(err => {
    console.error(err);
    process.exit(1); });
    
});


var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function() {
    console.log("Server started on port 8000");
});

// psuedo code for script...
// allow user to enter artist names
// go to api to get artist
// using ids we want to get albums
// then get tracks
// then build playlist

/*

// SEARCH BY 'GENRE' (user defined) RETURNS trackbundles, artists, stations and more...

{ errors: null,
  duration: 183,
  bestMatch:
   { objType: 'STATION',    <= can we search by objType?
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

// SEARCH BY 'ARTIST' (user defined) ONLY RETURNS TRACKBUNDLES

"trackBundles":
[
{
"title":"Elvis Presley",
"artist":"ElvisPresley",
"albumId":22586522,
"artistId":1014,
"copyright":null,
"numberOfTracks":0,
"tracks":null,
"streamReady":false,
"trackBundleType":null,
"version":null,
"releaseDate":-434764800000,
"numberOfVolumes":0,
"genre":"Pop",
"genreId":null,
"explicitLyrics":false,
"score":180539.17,
"rank":null,
"searchScore":180539.17,
"allowStreaming":false,
"rightsAllowed":false,
"calculatedType":null,
"imagePath":"http://image.iheart.com/ihr-ingestion-pipeline-production-sbmg/A10301A0003017544V_20190305013532161/58152286.20126.jpg",

"recordLabelRestValue" {
    "recordProvider":null,
    "recordLabel":null,
    "recordLabelId":0,
    "recordSublabel":null 
    },
    
"smallAlbumCover":null,
"mediumAlbumCover":null,
"largeAlbumCover":null,
"currencyCode":null,
"fileSize":0,
"albumRank":null,
"albumType":null,
"trackOnly":false 
},

{
"title":"Elvis Presley",
"artist":"Elvis Presley",
"albumId":63683325,
"artistId":1014,
"copyright":"Makondo",
"numberOfTracks":0,
"tracks":null,
"streamReady":false,
"trackBundleType":null,
"version":"On Stage",
"releaseDate":1540512000000,
"numberOfVolumes":0,
"genre":"Rock - Rock 'n' Roll",
"genreId":null,
"explicitLyrics":false,
"score":180539.17,
"rank":null,
"searchScore":180539.17,
"allowStreaming":false,
"rightsAllowed":false,
"calculatedType":null,
"imagePath":"http://image.iheart.com/ihr-ingestion-pipeline-production-believe/NEW_CONTENT_DROP_HERE/20181025/3615935052559/3615935052559.jpg",
"recordLabelRestValue":
{"recordProvider":null,
"recordLabel":null,"recordLabelId":0,"recordSublabel":null},

"smallAlbumCover":null,"mediumAlbumCover":null,"largeAlbumCover":null,"currencyCode":null,"fileSize":0,"albumRank":null,"albumType":null,"trackOnly":false},

{"title":"Elvis Presley Christmas Duets","artist":"Elvis Presley","albumId":2642436,"artistId":1014,"copyright":null,"numberOfTracks":0,"tracks":null,"streamReady":false,"trackBundleType":null,"version":null,"releaseDate":1223596800000,"numberOfVolumes":0,"genre":"Holiday","genreId":null,"explicitLyrics":false,"score":154025.11,"rank":null,"searchScore":154025.11,"allowStreaming":false,"rightsAllowed":false,"calculatedType":null,"imagePath":"http://image.iheart.com/content/music/prod/SBMG7/Thumb_Content/Full_PC/SBMG/Jan15/011514/A10301A0001662949Q_20150114203232783/resources/A10301A0001662949Q_T-10202_Image.jpg","recordLabelRestValue":

{"recordProvider":null,"recordLabel":null,"recordLabelId":0,"recordSublabel":null},"smallAlbumCover":null,"mediumAlbumCover":null,"largeAlbumCover":null,"currencyCode":null,"fileSize":0,"albumRank":null,"albumType":null,"trackOnly":false}

*/
