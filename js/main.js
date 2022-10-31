document.getElementById("next_chapter").style.visibility = "hidden";

var i = 0;
var stopPlayTimer;   // Reference to settimeout call
let form;

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("player", {
    "height": "315",
    "width": "560",
    "videoId": videoId,
    "events": {
      "onReady": onPlayerReady,
      "onStateChange": onPlayerStateChange
    }
  });
}

// The API will call this function when the video player is ready.
// This automatically starts the video playback when the player is loaded.
function onPlayerReady(event) {
  event.target.playVideo();
}

// The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
  var time, rate, remainingTime;
  clearTimeout(stopPlayTimer);
  if (event.data == YT.PlayerState.PLAYING) {
    time = player.getCurrentTime();
    // Add .4 of a second to the time in case it's close to the current time
    // (The API kept returning ~9.7 when hitting play after stopping at 10s)
    if (time + .4 < questions[i].time) {
      rate = player.getPlaybackRate();
      remainingTime = (questions[i].time - time) / rate;
      stopPlayTimer = setTimeout(pauseVideo, remainingTime * 1000);
    }
  }
  if (event.data == YT.PlayerState.PAUSED && i >= 0) {
    renderQuestion(questions[i]);
    i++;
  }

  if (event.data == YT.PlayerState.ENDED) {
    console.log("Play the next video.");
    document.getElementById("next_chapter").style.visibility = "";
  }
}

function pauseVideo() {
  player.pauseVideo();
}

function renderQuestion(data) {
  let result = '<p>' + data['text'] + '</p>';
  data['options'].forEach(
    element => result += '<input id="' + element['id'] + '" type="radio" onclick="saveFormItem("'+ data['text'] +'","' + element['text'] +'")"> ' + element['text'] + '<br>'
  );

  form = "<form action='#'>" + result + "</form>";
  document.getElementById("question").innerHTML = form;
}

function saveFormItem (q, a) {
  console.log(q, a);
}