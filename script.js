// Logging a message to indicate that the script is connected
console.log("This is connected");

function secondsToMinutesSeconds(seconds) {
  // Calculate minutes and seconds
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60); // Remove any decimal part

  // Format the output with leading zeros if necessary
  let minutesStr = String(minutes).padStart(2, '0');
  let secondsStr = String(remainingSeconds).padStart(2, '0');

  // Return the formatted time string
  return `${minutesStr}:${secondsStr}`;
}

// Example usage:
console.log(secondsToMinutesSeconds(90)); // Output: "01:30"
console.log(secondsToMinutesSeconds(3660)); // Output: "61:00"


// Creating an Audio object to play songs with a default song loaded
let currentSong = new Audio("./songs/Dynasty%20-%20MIIA_.m4a");

// Selecting the main play button
let mainPlayButton = document.querySelector("#playButton");

// Function to play audio track
const playAudio = (track) => {
  // Setting the source of the current song to the provided track
  currentSong.src = track;
  // Playing the current song
  currentSong.play();
  // Changing the play button icon to pause
  mainPlayButton.src = "Resources/pause.svg";
  let songInfo = track.split("/songs/")[1].split("_.m4a")[0].replaceAll("%20", " ");
  document.querySelector(".song-info").innerHTML = songInfo;
  console.log(document.querySelector(".song-info"));
  document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
};

// Async function to fetch list of songs
async function getSongs() {
  // Fetching songs from the server
  let a = await fetch("./songs");
  // Getting response as text
  let response = await a.text();
  // Parsing the response to extract song URLs
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.querySelectorAll("a.icon-m4a");
  let songs = [];
  as.forEach((element) => {
    songs.push(element.href);
  });
  return songs;
}

// Main function to execute the program
async function main() {
  // Fetching the list of songs
  let songs = await getSongs();
  // Logging the list of songs
  console.log(songs);
  // Populating the song list UI with fetched songs
  let songUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    // Cleaning up song information and appending to the UI
    let songInfo = song.split("/songs/")[1].split("_.m4a")[0].replaceAll("%20", " ");
    let [songName, songartist] = songInfo.split(" - ");
    songUl.innerHTML +=
      `<li class="justify-space-between">
        <img src="Resources/song.svg" alt="SongsSVG">
        <div class="info direction-col g-1">
          <span>${songName}</span>
          <span>By - ${songartist}</span>
        </div>
        <div class="play-option justify-center item-center g-1">
          <span>Plan Now</span>
          <img class="playButton invert-color" src="Resources/play.svg" alt="play button"></img>
        </div>
      </li>`;
  }

  // Adding click event listeners to each song in the list
  Array.from(document.querySelector(".song-list > ul").getElementsByTagName("li")).forEach((ele, idx) => {
    ele.addEventListener("click", () => {
      // Playing the selected song on click
      playAudio(songs[idx]);
      
    });
  });

  // Adding click event listener to the main play button to toggle play/pause
  mainPlayButton.addEventListener("click", () => {
    playPause();
  });


  //timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    let currentTime = secondsToMinutesSeconds(currentSong.currentTime);
    let duration = currentSong.duration;
    // Check if duration is a valid number
    let durationStr = isNaN(duration) ? "00:00" : secondsToMinutesSeconds(duration);
    document.querySelector(".song-time").innerHTML = `${currentTime} / ${durationStr}`;

    document.querySelector(".circle").style.left = `${(currentSong.currentTime/currentSong.duration)*100}%`

    if(currentSong.currentTime > 1)
      document.querySelector('.circle').style.transition = 'left 0.5s';
    else {
      document.querySelector('.circle').style.transition = 'left 0.2s';
    }
  });
  

  //seekbar listerner
  document.querySelector(".seek-bar").addEventListener("click", e=> {
    let position = document.querySelector(".circle");
    console.log(e.offsetX, e.target.getBoundingClientRect());
    let percentage = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    position.style.left = percentage + '%';
    currentSong.currentTime = currentSong.duration * percentage / 100;
    
  })

  //space bar pause play
  document.addEventListener('keydown', e =>{
    if(e.key == ' ') {
      playPause();
    }
      
      
  })

  //play or pause the song
  function playPause() {
    if (currentSong.paused) {
      currentSong.play();
      mainPlayButton.src = "Resources/pause.svg";
      console.log('Music Started');
    } else {
      currentSong.pause();
      mainPlayButton.src = "Resources/play.svg";
      console.log('Music Paused');
    }
  }



  // event lister for hamberger
  document.querySelector(".hamberger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  })


// eventlistner for close btn
  document.querySelector(".close-icon").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  })




}

// Calling the main function to start the program
main();
