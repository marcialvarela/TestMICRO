//Location content
var lc;
//PhoneGap Ready variable
var pgr = false;
var path = '';

//var capture = navigator.device.capture;

window.addEventListener('load', function () {
    document.addEventListener("deviceReady", deviceReady, false);
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

// capture callback
var captureSuccess = function(mediaFiles) {
    path = mediaFiles[0].fullPath;

    //document.getElementById('audioCapture').hidden= true;
    //document.getElementById('audioPlay').hidden= false;
    //document.getElementById('audioSave').hidden= false;
    //document.getElementById('audio_position').hidden= false;
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

    //document.getElementById('audioPlay').hidden= false;
    //document.getElementById('audioSave').hidden= false;
    //document.getElementById('audio_position').hidden= false;
    //document.getElementById('audioCapture').hidden= true;
};

function captureAudio() {
    alert('Entra en captureAudio');
    navigator.device.capture.captureAudio(captureAllSuccess, captureError, {limit: 2});
}

// Audio player
//
var my_media = null;
var mediaTimer = null;

// onSuccess Callback
//
function onSuccessPlay() {
    console.log("playAudio():Audio Success");
}

// onError Callback
//
function onErrorPlay(error) {
    alert('code: '    + error.code    + '\n' +
    'message: ' + error.message + '\n');

    //document.getElementById('audioPlay').hidden= true;
    //document.getElementById('audioSave').hidden= true;
    //document.getElementById('audio_position').hidden= true;
    //document.getElementById('audioCapture').hidden= false;
}

function playAudio() {

    alert('Entra en playAudio');
    if (path.length >0)
    {
        // Create Media object from src
        my_media = new Media(path, onSuccessPlay, onErrorPlay);

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
                            setAudioPosition((position) + " sec");
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
    else
    {
        console.log('Error no audio file exist.' + path.fileName + ': ' + error.code);
    }
}

// Set audio position
//
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}

// Upload files to server
function uploadFile(mediaFile) {
    var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;

    ft.upload(path,
        "http://my.domain.com/upload.php",
        function(result) {
            console.log('Upload success: ' + result.responseCode);
            console.log(result.bytesSent + ' bytes sent');
        },
        function(error) {
            console.log('Error uploading file ' + path.fileName + ': ' + error.code);
        },
        { fileName: name });
}

function saveAudio() {

    alert('Entra en saveAudio');
    if (path.length >0)
    {
        //document.getElementById('audioPlay').hidden= true;
        //document.getElementById('audioSave').hidden= true;
        //document.getElementById('audio_position').hidden= true;
        //document.getElementById('audioCapture').hidden= true;
        localStorage.myname = "audio001";
        localStorage.setItem(localStorage.myname, path);
    }
    else{
        console.log('Error no audio file exist.' + path.fileName + ': ' + error.code);
    }
}

function loadAudio() {

    alert('Entra en loadAudio');
    if (path.length >0)
    {
        //document.getElementById('audioPlay').hidden= true;
        //document.getElementById('audioSave').hidden= true;
        //document.getElementById('audio_position').hidden= true;
        //document.getElementById('audioCapture').hidden= true;
        localStorage.myname = "audio001";
        path = localStorage.getItem(localStorage.myname);
    }
    else{
        console.log('Error no audio file exist.' + path.fileName + ': ' + error.code);
    }
}

function clearLocalStorage() {

    alert('Entra en clearLocalStorage');
    if (path.length >0)
    {
        localStorage.clear();
    }
    else{
        console.log('Error no audio file exist.' + path.fileName + ': ' + error.code);
    }
}
