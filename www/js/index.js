//Location content
var lc;
//PhoneGap Ready variable
var pgr = false;
var path = '';


/**************************************** GLOBAL VARIABLE ****************************************/
var startTime, endTime;
var flag = false;
var timeToRec = 5;
/**************************************** GLOBAL VARIABLE ****************************************/



/**************************************** WINDOW EVENTS ****************************************/
/**************************************** WINDOW EVENTS ****************************************/
/**************************************** WINDOW EVENTS ****************************************/

window.addEventListener('load', function () {
    document.getElementById('playAudioPush').style.visibility="hidden";
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

/* ------------- TOUCH START -------------*/
document.getElementById('recordAudioPush').addEventListener('touchstart',function(event) {
    startTime = new Date().getTime();
    flag = false;


    document.getElementById('divlegend').style.visibility="visible";
    document.getElementById('recordAudioPush').src="img/micro_push_rec.png.png";

    recStatus=0;
    recordAudioPush();

},false);

/* ------------- TOUCH MOVE -------------*/
document.getElementById('recordAudioPush').addEventListener('touchmove',function(event) {
    document.getElementById('divlegend').style.visibility="hidden";
    flag = true;
},false);

/* ------------- TOUCH END -------------*/
document.getElementById('recordAudioPush').addEventListener('touchend',function(event) {
    endTime = new Date().getTime();
    if(!flag && ((endTime-startTime) > timeToRec * 1000))   //logout after more then 5 sec= 5000 msec
    {
        document.getElementById('playAudioPush').style.visibility="visible";
        playStatus=0;
    }
    else {
        recStatus = 1;  //STOP Record
        recordAudioPush();
    }
    startTime = null;
    endTime = null;
    flag = false;
},false);

/**************************************** WINDOW EVENTS ****************************************/
/**************************************** WINDOW EVENTS ****************************************/
/**************************************** WINDOW EVENTS ****************************************/


/***************************   AUDIO - INI   ***************************/
/***************************   AUDIO - INI   ***************************/
/***************************   AUDIO - INI   ***************************/


/*************************** PLAY AUDIO PUSH - INI ***************************/
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
                        setAudioPlayPosition("Play... " + (position) + " sec");
                        document.getElementById('playAudioImg').src="img/black_stop_play_back.png";
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

function iniPlayAudio(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onError);
    fileSystem.root.getFile(myFileName, {create: true, exclusive: false}, gotFileEntry(), onError);
}

function stopAudio() {
    clearInterval(recInterval);
    my_media.stop();
    document.getElementById('playAudioPush').src="img/black_play.png";
    setAudioPlayPosition("STOP Audio");
}

function playAudio2(){

    if (playStatus == 0)
    {
        // Inicia el play del Audio
        playStatus = 1;
        document.getElementById('playAudioPush').src="img/black_stop_play_back.png";
        iniPlayAudio();
    }
    else if (playStatus == 1)
    {
        // para el play del audio
        playStatus = 0;
        document.getElementById('playAudioPush').src="img/black_play.png";
        stopAudio();
    }
}
/*************************** PLAY AUDIO PUSH - END ***************************/

function recordAudioPush() {
    if (recStatus == 0){
        iniRecordAudioPush();
    }
    else{
        stopRecordAudioPull();
    }
}

function iniRecordAudioPush() {

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
            if (recTime >= timeToRec) {
                setAudioPosition("Record Audio --> OK");
                clearInterval(recInterval);
                meFileRecord.stopRecord();
                document.getElementById('recordAudioPush').src="img/micro_push.png";
            }
            else
            {
                var iin = recTime % 2;
                if (iin == 0) {
                    document.getElementById('recordAudioPush').src="img/micro_push_rec.png";
                }
                else{
                    document.getElementById('recordAudioPush').src="img/micro_push_rec_2.png";
                }
            }
        }
        , timeToRec * 1000);

}

function stopRecordAudioPull(){

    recStatus = 0;
    clearInterval(recInterval);
    meFileRecord.stopRecord();
    document.getElementById('recordAudioPush').src="img/micro_push.png";

    playStatus=0;
    document.getElementById('playAudioPush').style.visibility="visible";
    setAudioPosition("STOP Recording audio");
}


function playAudioPush(){

    if (playStatus == 0)
    {
        // Inicia el play del Audio
        playStatus = 1;
        document.getElementById('playAudioPush').src="img/stop_red.png";
        iniPlayAudio();
    }
    else if (playStatus == 1)
    {
        // para el play del audio
        playStatus = 0;
        document.getElementById('playAudioPush').src="img/play_red.png";
        stopAudio();
    }

}




/*************************** LABEL SUCCESS/ERROR - INI ***************************/
// onSuccess Callback
//
function onSuccess(action) {
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

    clearInterval(recInterval);
    if (recStatus == 1){
        meFileRecord.stopRecord();
    }
    if (playStatus == 1){
        my_media.stop();
    }
    navigator.app.exitApp();
}
/*************************** EXIT APP - END ***************************/



/***************************   AUDIO - END   ***************************/
/***************************   AUDIO - END   ***************************/
/***************************   AUDIO - END   ***************************/




/*************************** RECORD AUDIO - INI ***************************/
/*
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
 */
/*************************** RECORD AUDIO - END ***************************/

