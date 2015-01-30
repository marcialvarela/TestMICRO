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
var captureSuccess  = function(mediaFiles) {
    alert('Entra en captureSuccess');
    alert(mediaFiles);
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
        alert(path);
        // do something interesting with the file
    }
    alert(path);
};

// capture error callback
var captureError = function(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Uh oh!');
};

function captureAudio() {
    alert('Entra en captureAudio');
    var options = { limit: 2, duration: 10 };
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 2, duration: 10});
    alert('Sale de captureAudio');
}

var captureSuccess2  = function(mediaFiles) {
    alert('Entra en captureSuccess2');
    // mediaFiles will be an array of MediaFile objects

    var options = new FileUploadOptions();
    alert('Pasa por 2');
    var ft = new FileTransfer();
    alert('Pasa por 3');
    var fileURI = mediaFiles[0].fullPath;
    alert('Pasa por 4');


    options.params = _.extend({}, {id: 5});
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.headers = {Connection: "close"};

    alert('Pasa por 5');
    alert(options.fileName);
};
function captureAudio2() {
    alert('Entra en captureAudio2');
    navigator.device.capture.captureAudio(captureSuccess2, captureError, { limit: 1, duration: 4 });
    alert('Sale de captureAudio2');
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
    alert('Entra en recordAudio');

    var src = "myfile001.wav";
    var meFile1 = new Media(src, onSuccess('Record'), onError);

    navigator.notification.beep(1);
    // Record audio
    meFile1.startRecord();
    // Stop recording after 10 sec
    var recTime = 0;
    var recInterval = setInterval(function() {
        recTime = recTime + 1;
        setAudioPosition(recTime + " sec");
        if (recTime >= 10) {
            clearInterval(recInterval);
            meFile1.stopRecord();
            navigator.notification.beep(1);
            alert('End record');
            //meFile1.play();
            var src="http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3";
            playAudio(src);
            alert('End play');
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




/*************************** PHOTO - INI ***************************/
/*************************** PHOTO - INI ***************************/
/*************************** PHOTO - INI ***************************/

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Wait for device API libraries to load
//
document.addEventListener("deviceready",onDeviceReady,false);

// device APIs are available
//
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64-encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
    alert('Failed because: ' + message);
}

/*************************** PHOTO - END ***************************/
/*************************** PHOTO - END ***************************/
/*************************** PHOTO - END ***************************/
