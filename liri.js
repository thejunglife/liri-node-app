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
// hiding this for now
const spotify = new Spotify(keys.spotify)

let command = process.argv[2]
let entry = process.argv[3]
// let entry = ''
// better way of taking care of spaces

// let entry = process.argv.slice(3).join()
// let entry = process.argv[3]

// include the + when there is a space
// const nodeArg = process.argv
// for (var i = 3; i < nodeArg.length; i++) {
//   if (i > 3 && i < nodeArg.length) {
//     entry = entry + '+' + nodeArg[i]
//   } else {
//     entry += nodeArg[i]
//   }
// }

/****************
 *** functions****
 ***************/

// function for Bandsintown Api
function concertThis () {
  let concert = process.argv[3]
axios.get(`https://rest.bandsintown.com/artists/${concert}/events?app_id=codingbootcamp`)
  .then(concert => {
    if (concert) {
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
function movieThis () {
  let movies = process.argv[3]
axios.get(`https://www.omdbapi.com/?apikey=trilogy&t=${movies}`)
  .then(movie => {
    if (movies) {
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
}


// Spotify Function
function spotifyThis () {
  let title = process.argv[3]
  spotify.search({ type: 'track', query: `${title}`, limit: 1 })
    .then(song => {
    // variable to shorten up code
      let songs = song.tracks.items[0]

      if (title) {
        console.log(` 
     Artist(s): ${songs.artists[0].name}
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

// Liri Function
// function doThis () {
//   fs.readFile('random.txt', 'utf8', (e, data) => {
//     if (e) {
//       console.log(e)
//     }
//     const str = data.replace(/"/g, '').split(',')
    
//    str[0] = process.argv[2]
   
    
//     movieThis()
//   })
// }
const doThis = _ => {
  fs.readFile('random.txt', 'utf8', (e, data) => {
    let str = data
    let newStr = str.split(',')
    
    
    let new3 = newStr[1] 
    
    
    new3 = process.argv[3]
    console.log(new3)

  })
  

}



// function commandFunc (command, entry) {
  switch (command) {
    case 'concert-this':
      concertThis()
      break

    case 'movie-this':
      movieThis()
      break

    case 'spotify-song':
      spotifyThis()
      break

    case 'do-this':
      doThis()
      break

    default:
      console.log('please enter a command!')
      break
  }
// }
// commandFunc(command, entry)

