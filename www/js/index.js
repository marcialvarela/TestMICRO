//Location content
var lc;
//PhoneGap Ready variable
var pgr = false;
var path = '';

//var capture = navigator.device.capture;

window.addEventListener('load', function () {
    document.addEventListener("deviceReady", onDeviceReady, false);
}, false);

function deviceReady() {
    try {
        //Get a handle we'll use to adjust the accelerometer
        //content
        lc = document.getElementById("locationInfo");
        //Set the variable that lets other parts of the program
        //know that PhoneGap is initialized
        pgr = true;
    }
    catch (ex) {
        alert("deviceReady error: "+ex.message);
    }
}

/*************************** CAPTURE AUDIO - INI ***************************/
// capture callback
var captureSuccess = function(mediaFiles) {
    path = mediaFiles[0].fullPath;
};

// capture callback
var captureAllSuccess = function(mediaFiles) {
    alert('Entra en captureAllSuccess');
    alert('mediaFiles: ' + mediaFiles.length);
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
        // do something interesting with the file
    }
    alert(path);
};

// capture error callback
var captureError = function(error) {
    alert('Entra en captureError');
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
};

function captureAudio() {
    alert('Entra en captureAudio');
    var options = { limit: 2, duration: 10 };
    //navigator.device.capture.captureAudio(captureAllSuccess, captureError, {limit: 2});
    navigator.device.capture.captureAudio(captureAllSuccess, captureError, options);
}
/*************************** CAPTURE AUDIO - END ***************************/




/*************************** PLAY AUDIO - INI ***************************/
// Audio player
//
var my_media = null;
var mediaTimer = null;
var mediaRec = null;


// Play audio
//
function playAudio() {
    // Create Media object from src
    var src = "http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3";
    my_media = new Media(src, onSuccess('Play'), onError);

    // Play audio
    my_media.play();

    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        setAudioPlayPosition((position) + " sec");
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 1000);
    }
}
/*************************** PLAY AUDIO - END ***************************/


/*************************** RECORD AUDIO - INI ***************************/
function recordAudio() {
    alert('entra recordAudio');
    var src = "myrecording_001.amr";
    mediaRec = new Media(src, onSuccess('Record'), onError);

    // Record audio
    mediaRec.startRecord();

    // Stop recording after 10 sec
    var recTime = 0;
    var recInterval = setInterval(function() {
        recTime = recTime + 1;
        setAudioPosition(recTime + " sec");
        if (recTime >= 10) {
            clearInterval(recInterval);
            mediaRec.stopRecord();
        }
    }, 1000);

    if (recTime >= 10) {
        alert(mediaRec.length);
        alert('sale recordAudio');
    }
}
/*************************** RECORD AUDIO - END ***************************/


// device APIs are available
//
function onDeviceReady() {
    //alert('entra onDeviceReady');
    //recordAudio();
    //alert('sale onDeviceReady');
}




/*************************** PAUSE AUDIO - INI ***************************/
// Pause audio
//
function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}
/*************************** PAUSE AUDIO - END ***************************/



/*************************** STOP AUDIO - INI ***************************/
// Stop audio
//
function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}
/*************************** STOP AUDIO - END ***************************/



/*************************** LABEL SUCCESS/ERROR - INI ***************************/
// onSuccess Callback
//
function onSuccess(action) {
    //console.log("recordAudio():Audio Success");
    alert(action + ' :Audio Success');
}

// onError Callback
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
/*************************** LABEL SUCCESS/ERROR - END ***************************/





/*************************** LABEL AUDIO - INI ***************************/
// Set audio position
//
function setAudioPosition(position) {
    document.getElementById('audio_positionRecord').innerHTML = position;
}

function setAudioPlayPosition(position) {
    document.getElementById('audio_positionPlay').innerHTML = position;
}
/*************************** LABEL AUDIO - END ***************************/


