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

function stopAudio() {
    alert('Entra en stopAudio');

}
/*************************** CAPTURE AUDIO - END ***************************/





/*************************** RECORD AUDIO - INI ***************************/
function recordAudio() {
    alert('entra recordAudio');
    var src = "myrecording_001.amr";
    var mediaRec = new Media(src, onSuccess, onError);

    // Record audio
    mediaRec.startRecord();
    alert('startRecord');

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
    alert('sale recordAudio');
}
// device APIs are available
//
function onDeviceReady() {
    alert('entra onDeviceReady');
    recordAudio();
    alert('sale onDeviceReady');
}

// onSuccess Callback
//
function onSuccess() {
    console.log("recordAudio():Audio Success");
}

// onError Callback
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
    'message: ' + error.message + '\n');
}

// Set audio position
//
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}

/*************************** RECORD AUDIO - END ***************************/