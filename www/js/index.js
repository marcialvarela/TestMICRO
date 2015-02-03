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

/***************************   AUDIO - INI   ***************************/
/***************************   AUDIO - INI   ***************************/
/***************************   AUDIO - INI   ***************************/


/*************************** PLAY AUDIO - INI ***************************/
// Audio player
//
var my_media = null;
var mediaTimer = null;
var myFileName = "myfile001.wav";
var meFileRecord = null;
var recInterval = null;
var setInt = 10;
var recStatus = 0;
var playStatus = 0;

function gotFS(fileSystem) {
    fileSystem.root.getFile(myFileName, {create: true, exclusive: false}, gotFileEntry, onError);
}

function gotFileEntry(fileEntry) {

    var fileUri = fileEntry.toURI();

    var scr = fileEntry.toURI();

    my_media = new Media(scr, onSuccess('Play'), onError);

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
                        setAudioPlayPosition("Playing audio..." + (position) + " sec");
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

function gotFileEntry2(fileEntry) {

    var fileUri = fileEntry.toURI();

    var scr = fileEntry.toURI();

    my_media = new Media(scr, onSuccess('Play'), onError);

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
                        setAudioPlayPosition("Playing audio..." + (position) + " sec");
                    }
                    else {
                        alert('Position: ' + position)
                        document.getElementById('playAudioImg').src="img/black_play.png";
                        setAudioPlayPosition("Playing audio...0.0 sec");
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, setInt * 100);
    }
}

// Play audio
//

function playAudio()
{
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onError);
    var myFilePath = fileSystem.root.getFile(myFileName, {create: true, exclusive: false}, gotFileEntry, onError);
}

function iniPlayAudio(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onError);
    var myFilePath = fileSystem.root.getFile(myFileName, {create: true, exclusive: false}, gotFileEntry2, onError);

}

function playAudio2(){

    alert('playStatus: ' + playStatus);
    if (playStatus == 0)
    {

        // Inicia el play del Audio
        playStatus = 1;
        document.getElementById('playAudioImg').src="img/black_stop_play_back.png";
        iniPlayAudio();
    }
    else if (playStatus == 1)
    {
        // para el play del audio
        playStatus = 0;
        document.getElementById('playAudioImg').src="img/black_play.png";
        stopAudio();
    }

}
/*************************** PLAY AUDIO - END ***************************/





/*************************** RECORD AUDIO - INI ***************************/
function recordAudio() {

    //var meFileRecord = new Media(myFileName, onSuccess('Record'), onError);
    meFileRecord = new Media(myFileName, onSuccess('Record'), onError);

    // Record audio
    meFileRecord.startRecord();
    // Stop recording after 10 sec
    var recTime = 0;
    //var recInterval = setInterval(
    recInterval = setInterval(
        function() {
            recTime = recTime + 1;
            setAudioPosition("Recording audio..." + recTime + " sec");
            if (recTime >= 10) {
                setAudioPosition("Record Audio --> OK");
                clearInterval(recInterval);
                meFileRecord.stopRecord();
            }
        }
        , 1000);

}

function recordAudio2() {

    if (recStatus == 0)
    {
        // Inicia la grabación del  Audio
        iniRecordAudio();
    }
    else
    {
        // para la grabación del audio
        stopRecordAudio();
    }
}
/*************************** RECORD AUDIO - END ***************************/

//document.addEventListener('stopAudioRecord', meFile1.stopRecord(), false)
function iniRecordAudio() {

    //var meFileRecord = new Media(myFileName, onSuccess('Record'), onError);
    meFileRecord = new Media(myFileName, onSuccess('Record'), onError);

    // Record audio
    meFileRecord.startRecord();
    recStatus = 1;
    // Stop recording after 10 sec
    var recTime = 0;
    //var recInterval = setInterval(
    recInterval = setInterval(
        function() {
            recTime = recTime + 1;
            //recordAudioImg
            setAudioPosition("Recording audio..." + recTime + " sec");
            if (recTime >= setInt) {
                setAudioPosition("Record Audio --> OK");
                clearInterval(recInterval);
                meFileRecord.stopRecord();
                document.getElementById('recordAudioImg').src="img/red_stop_rec.png";
            }
            else
            {
                var iin = recTime % 2;
                if (iin == 0) {
                    document.getElementById('recordAudioImg').src="img/red_stop_playback.png";
                }
                else{
                    document.getElementById('recordAudioImg').src="img/red_stop_playback_2.png";
                }
            }
        }
        , setInt * 100);

}

function stopRecordAudio() {

    recStatus = 0;
    clearInterval(recInterval);
    meFileRecord.stopRecord();
    document.getElementById('recordAudioImg').src="img/red_stop_rec.png";
    setAudioPosition("STOP Recording audio");

}

function stopAudio() {

    clearInterval(recInterval);
    my_media.stop();
    document.getElementById('playAudioImg').src="img/black_play.png";
    setAudioPlayPosition("STOP Audio");

}


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



/***************************   AUDIO - END   ***************************/
/***************************   AUDIO - END   ***************************/
/***************************   AUDIO - END   ***************************/










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
