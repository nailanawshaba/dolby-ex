/* 

Inspired by: Petr TIchy, http://codepen.io/ihatetomatoes/pen/KwMLGP

*/

(function(){

  /* Global Variables */
  var $Presents = $('#Presents'),
    $box = $('.box'),
    $PresentB = $('#PresentB'),
    $sIcons = $('.sIcon'),
    $socialLinkP = $('.socialLinkP'),
    $boxStatus = 0, // 0 closed or 1 open
    $bufferList;

  var bufferLoader,
      context;

  var imageSource = 'https://pbs.twimg.com/profile_images/598529744997494784/HJcj4Bnl_400x400.jpg';
  var linkSource = 'http://www.titusblair.com';

  var sounds = [
    'assets/sounds/open-box.mp3',
    'assets/sounds/surprise.mp3',
    'assets/sounds/jingle-bells.mp3'   
  ];

  // if browser support DDPlus then use DDPlus files
  if( Dolby.checkDDPlus() === true ) {

    sounds = [
      'assets/sounds/open-box_Dolby.mp4',
      'assets/sounds/surprise_Dolby.mp4',
      'assets/sounds/jingle-bells_Dolby.mp4'
    ];

  }

  // setup AudioContext
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
  context = new AudioContext();
  // load sounds
  bufferLoader = new BufferLoader(
    context,
    sounds,
    finishedLoading
    );
  bufferLoader.load();

  $box.mouseenter( bouncingBox );
  $box.click(function(){  
    event.preventDefault();

    // eventually we can add more methods to close and open the box
    if( ( 1 - $boxStatus ) == 1 ) {

      $boxStatus = 1 - $boxStatus; // switch box state
      openBox(this);

    } else {


    }

  });

  function stopHover(element){

    $(element).unbind('mouseenter click');
    $(element).css('cursor: default');

  }

  function openBox(element){
    $thisBox = element,
      $PresentBoxRibbon = $(element).find('.PresentBoxRibbon'),
      $PresentBoxTop = $(element).find('.boxTop'),
      $PresentBoxTopShadow = $(element).find('.boxTopShadow'),
      $PresentRibbonSide = $(element).find('.ribbonSide'),
      $socialLinkP = $(element).find('.socialLinkP');

    /* Open Present */
    tlOpenPresent = new TimelineMax({paused: true});
    tlOpenPresent
      .to($PresentBoxRibbon, 0.4, {
              yPercent: 252, 
              ease:Power4.easeInOut,
              onComplete: (function(){ 
                playSound( $bufferList[0] , 1 , 0 , 0.65 ); 
              }),                 
            })
      .to($PresentBoxTop, 0.4, {
              yPercent: -80, 
              ease:Power4.easeOut,           
            }, "0")
      .to($PresentBoxTopShadow, 0.2, {
              autoAlpha: 0
            }, "0")
      .to($PresentRibbonSide, 0.4, {
              scaleY: 0.3, 
              transformOrigin:"bottom center", 
              onComplete: stopHover, 
              onCompleteParams: [$thisBox]
            }, "0.2")
      .to($PresentBoxTop, 0.4, {
              rotation: -90, 
              transformOrigin:"left center", 
              ease:Power4.easeInOut
            }, "0")
      .to($PresentBoxTop, 0.3, {
              yPercent: 410, 
              transformOrigin:"left center", 
              ease:Bounce.easeOut
            }, "0.4")

      tlOpenPresent.play();

    /* Open Present */
    tlOpenPresent = new TimelineMax({paused: true});
    tlOpenPresent
      .to($PresentBoxTop, 0.4, {
              rotation: -195, 
              transformOrigin:"left center", 
              ease:Power4.easeIn,
              onComplete: (function(){ 
                playSound( $bufferList[1] , 1 , 0, 0 ); 
              }),
            }, "0.7")
      .to($socialLinkP, 0.5, {
              scale: 3.5, 
              yPercent: -350, 
              transformOrigin:"top center", 
              ease:Power4.easeInOut
            }, "-=0.4");
      tlOpenPresent.play();

  }

  function closeBox(element) {

  }

  function bouncingBox(){

    /* Jump Presents */
    tlJumpPresent = new TimelineMax({paused: true});
    $PresentBox = $(this).find('.PresentBox'),
    $PresentBoxShadow = $(this).find('.PresentBoxShadow');

    tlJumpPresent
      .to($PresentBox, 0.5, {scaleX: 0.8, transformOrigin:"bottom center", y: -20, ease:Power4.easeInOut})
      .to($PresentBox, 0.2, {scaleX: 1, transformOrigin:"bottom center", y: 0, ease:Bounce.easeOut})
      .to($PresentBoxShadow, 0.5, {scaleX: 0.8, transformOrigin:"bottom center", ease:Power4.easeInOut}, "0")
      .to($PresentBoxShadow, 0.2, {scaleX: 1, transformOrigin:"bottom center", ease:Bounce.easeOut}, "0.5");

    tlJumpPresent.play();

  }

  function finishedLoading(bufferList) {

    // pull in image
    $("#loading").css("visibility", "hidden");

    // pull in image
    $("#imageSource").attr("xlink:href", imageSource );
   $("#linkSource").attr("xlink:href", linkSource );

    $('#imageInput').val( imageSource );
    $('#linkInput').val( linkSource );

    $("#submitButton").bind('click', updatePresent);

    // make the present visible
    $("#wrapper").css("visibility", "visible");
    $bufferList = bufferList;
    
    // start playing background music
    playSound( $bufferList[2] , .5 , 0 , 0 );

    // bounce the box
    $( document ).ready( bouncingBox );

  }

  function playSound( buffer , volume, delay, offset ){
    
    var sound = context.createBufferSource();
    sound.buffer = buffer;

    var gainNode = context.createGain();
    gainNode.gain.value = volume;

    sound.connect(gainNode);
    gainNode.connect(context.destination);

    sound.start( delay, offset );

  }

  function updatePresent() {

    //https://pbs.twimg.com/profile_images/3438737633/780dc2843c1826fca9b4564d30b54716_400x400.png

    var imageSource = $('#imageInput').val();
    $("#imageSource").attr("xlink:href", imageSource );

    var linkSource = $('#linkInput').val();
    $("#linkSource").attr("xlink:href", linkSource );

  }


}).call(this);
