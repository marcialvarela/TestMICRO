//Location content
var lc;
//PhoneGap Ready variable
var pgr = false;
var path = '';

//var capture = navigator.device.capture;

window.addEventListener('load', function () {
    document.addEventListener("deviceReady", onDeviceReady, false);
}, false);

function onDeviceReady() {
    try {
        //Get a handle we'll use to adjust the accelerometer
        //content
        lc = document.getElementById("locationInfo");
        //Set the variable that lets other parts of the program
        //know that PhoneGap is initialized
        pgr = true;

        // window.requestFileSystem is recognized, so far so good.
        window.requestFileSystem(1, 0, function(fileSystem){
            alert('success');
        }, function(e){
            // 'e' is an object, {code: 'Class not found'}
            alert('Error accessing local file system');
        });
    }
    catch (ex) {
        alert("deviceReady error: "+ex.message);
    }
}

var requestFileSystem = function(type, size, successCallback, errorCallback) {
    argscheck.checkArgs('nnFF', 'requestFileSystem', arguments);
    var fail = function(code) {
        errorCallback && errorCallback(new FileError(code));
    };

    if (type < 0) {
        fail(FileError.SYNTAX_ERR);
    } else {
        // if successful, return a FileSystem object
        var success = function(file_system) {
            if (file_system) {
                if (successCallback) {
                    // grab the name and root from the file system object
                    var result = new FileSystem(file_system.name, file_system.root);
                    successCallback(result);
                }
            }
            else {
                // no FileSystem object returned
                fail(FileError.NOT_FOUND_ERR);
            }
        };
        // The error happens in exec()
        exec(success, fail, "File", "requestFileSystem", [type, size]);
    }
};

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
var meFile = null;
var my_media = null;
var mediaTimer = null;
//var mediaRec = null;


// Play audio
//
function playAudio(src) {
    // Create Media object from src
    //var src = meFile;
    alert('Entra en Play Audio');
    alert(src);
    //src="http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3";
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

    meFile = new Media("/Recording/myfilerecord_001.ogg", onSuccess('Record'), onError);
    // Record audio
    meFile.startRecord();
    // Stop recording after 10 sec
    var recTime = 0;
    var recInterval = setInterval(function() {
        recTime = recTime + 1;
        setAudioPosition(recTime + " sec");
        if (recTime >= 10) {
            clearInterval(recInterval);
            meFile.stopRecord();
            alert('End record');
            meFile.play();
            //playAudio(meFile);
        }
    }, 1000);

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
    console.log(action + " :Audio Success");
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



/*************************** EXIT APP - INI ***************************/
function exitApp() {
    navigator.app.exitApp();
}
/*************************** EXIT APP - END ***************************/
