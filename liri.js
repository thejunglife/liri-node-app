require('dotenv').config()

/***************
 *** variables****
 ***************/

// const fs = require('./random.txt')

// moment for date change
const moment = require('moment')

// to be able to fetch OMDB and BandsInTown API
const axios = require('axios')

// lets me use the spotify npm
const Spotify = require('node-spotify-api')

// grabs the spotify key from keys.js file
const keys = require('./keys.js')
// provides the hidden spotify key....
// hiding this for now
const spotify = new Spotify(keys.spotify)

let entry = ''

// include the + when there is a space
const nodeArg = process.argv
for (var i = 3; i < nodeArg.length; i++) {
  if (i > 3 && i < nodeArg.length) {
    entry = entry + '+' + nodeArg[i]
  } else {
    entry += nodeArg[i]
  }
}

/****************
 *** functions****
 ***************/

// function for Bandsintown Api
axios.get(`https://rest.bandsintown.com/artists/${entry}/events?app_id=codingbootcamp`)
  .then(concert => {
    if (process.argv[2] === 'concert-this') {
      for (let i = 0; i < concert.data.length; i++) {
        console.log(`
     ------------------------------------------
     Venue: ${concert.data[i].venue.name}
     Location: ${concert.data[i].venue.city}
     Date: ${moment(concert.data[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM-DD-YYYY')}
     ------------------------------------------
     `)
        //  used moment() to change the date format
      }
    }
  })
  .catch(e => console.log(e))

// function for OMDB
axios.get(`https://www.omdbapi.com/?apikey=trilogy&t=${entry}`)
  .then(movie => {
    if (process.argv[2] === 'movie-this') {
      console.log(`
   Movie: ${movie.data.Title}
   Release Date: ${movie.data.Year}
   IMDB Rating: ${movie.data.imdbRating}
   Rotten Tomatoe Rating: ${movie.data.Ratings[1].Value}
   Country of Production: ${movie.data.Country}
   Movie Language: ${movie.data.Language}
   ----------------------------------
   Plot: ${movie.data.Plot}
   ----------------------------------
   Actors: ${movie.data.Actors}
   `)
    }
  })
  .catch(e => console.log(e))

// Spotify Function
spotify.search({ type: 'track', query: `${entry}`, limit: 1 })
  .then(song => {
    let songs = song.tracks.items[0]

    if (process.argv[2] === 'spotify-this-song') {
      console.log(` 
     Artist(s): ${songs.artists[0].name}
     Song: ${songs.name}
     Preview Link: ${songs.preview_url}
     Album: ${songs.album.name}
      `)
    }
  })

// Liri Function
// fs.readFile('file.txt', 'utf8', (e, data) => {
//   if (e) {
//     console.log(e)
//   } else {
//     if (process.argv[2] === 'spotify-this-song') {
//      console.log(data)
//     }
//   }
// })
