require('dotenv').config()

/***************
 *** variables****
 ***************/
// to be able to read() append() write() files
const fs = require('fs')
// moment for date change
const moment = require('moment')
// to be able to fetch OMDB and BandsInTown API
const axios = require('axios')
// lets me use the spotify npm
const Spotify = require('node-spotify-api')
// grabs the spotify key from keys.js file
const keys = require('./keys.js')
// provides the hidden spotify key....
const spotify = new Spotify(keys.spotify)

let command = process.argv[2]
// better way of taking care of spaces

let put = process.argv.slice(3).join('+')


/****************
 *** functions****
 ***************/

// function for Bandsintown Api
function concertThis (event) {
axios.get(`https://rest.bandsintown.com/artists/${event}/events?app_id=codingbootcamp`)
  .then(concert => {
    if (event) {
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
}

// function for OMDB
function movieThis (movies) {
axios.get(`https://www.omdbapi.com/?apikey=trilogy&t=${movies}`)
  .then(movie => {
    if (movies) {
      console.log(`
   Movie: ${movie.data.Title}
   Release Date: ${movie.data.Year}
   IMDB Rating: ${movie.data.imdbRating}
   Rotten Tomatoe Rating: ${ movie.data.Ratings[1].Value }
   Country of Production: ${movie.data.Country}
   Movie Language: ${movie.data.Language}
   ----------------------------------
   Plot: ${movie.data.Plot}
   ----------------------------------
   Actors: ${movie.data.Actors}
   `)
  //  working after taking this out
      // Rotten Tomatoe Rating: ${ movie.data.Ratings[1].Value }
      // after IMDB Rating
}
    })
    .catch(e => console.log(e))
}


// Spotify Function working
function spotifyThis (artist) {
  spotify.search({ type: 'track', query: `${artist}`, limit: 1 })
    .then(song => {
    // variable to shorten up code
      let songs = song.tracks.items[0]
      if (artist) {
        console.log(` 
     Artist(s): ${ songs.artists[0].name }
     Song: ${songs.name}
     Preview Link: ${songs.preview_url}
     Album: ${songs.album.name}
      `)
      }
      else {
        console.log('error')
      }
    })
}


const doThis = () => {
  fs.readFile('random.txt', 'utf8', (e, data) => {
    let str = data
    let newStr = str.split(',')
    let com = newStr[0]
    let ent = newStr[1].replace(/\s/g, '')
    liriBot(com, ent)
  })
}
// 
function liriBot (command, put) {
  switch (command) {
    case 'concert-this':
      concertThis(put)
      break

    case 'movie-this':
      movieThis(put)
      break

    case 'spotify-song':
      spotifyThis(put)
      break

    case 'do-this':
      doThis()
      break

    default:
      console.log('please enter a command!')
      break
  }
}
liriBot(command, put)

