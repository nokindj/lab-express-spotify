require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

   


 // Our routes go here:

 // Entry point of our aplication 
 app.get('/', (req, res) => {
  res.render("index");
})

 app.get("/artist-search", (req, res) => {
   // I want to get here the text Ive typed on the 
  
  let artistName = req.query.artist; // its req.query because it comes 
                                    // from a form 
                                    // and its .artist because is the   
                                    // name of the input in index.js

  spotifyApi
 .searchArtists(artistName) // input text box (beatles, etc)
 .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
   // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  res.render("artist-search-results", {artistsList : data.body.artists.items}); // showing the user the rendered search results 
  })
 .catch(err => console.log('The error while searching artists occurred: ', err))
});

app.get("/albums/:artistId", (req, res) => { // the route param is the :artistId 
  let artistId = req.params.artistId; // use route params when using  
                                  // a link href to get the artist Id. 
                                  // resuming -> when its a form we use req.query , when we use a link we use .req.params
                                 
  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
    console.log("The received data from the API: ", data.body);
   let albums = data.body.items;
   res.render("albums", {albums: albums});
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
});
 
  app.get("/tracks/:albumId", (req, res) => {
    let albumId = req.params.albumId;
    spotifyApi.getAlbumTracks(albumId)
    .then((data) => {
      console.log("Response from the getAlbumTracks", data.body);
      res.render("tracks", {tracks: data.body.items});
    });
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
