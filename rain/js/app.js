
(function() {

  'use strict'

  var context;
  var bufferLoader;
  var bufferList;
  var sounds = [
    'assets/rain.mp3'
  ];

  if( Dolby.checkDDPlus() === true ) {
    sounds[0] = 'assets/rain_Dolby.mp4';
    
    var imageBlock = document.getElementById('image_block');

    var dolbyLogo = document.createElement('img');
    dolbyLogo.src = 'assets/white-dolby-logo.png';
    dolbyLogo.style.zIndex = "2000";
    dolbyLogo.style.position = "relative";
    imageBlock.appendChild(dolbyLogo);

  }

  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    sounds,
    finishedLoading
    );

  bufferLoader.load();

  function finishedLoading(bufferList) {

    playSound( bufferList[0] );

  }

  function playSound( buffer ){
    var sound = context.createBufferSource();
    sound.buffer = buffer;
    sound.connect(context.destination);
    sound.start(0);
  }

}).call(this);

/*

Special thanks to Boris Smus for this helpful example

http://www.html5rocks.com/en/tutorials/webaudio/intro/

*/
