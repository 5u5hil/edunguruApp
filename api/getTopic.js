var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();

var course = QueryString.course;

var chapter = QueryString.chapter;
var topic = QueryString.topic;
var courseIndex = QueryString.courseIndex;
var chapterIndex = QueryString.chapterIndex;
var index = QueryString.index;
var video = QueryString.video;



var play = 1;

var pth = require('path');
var fs = require('fs');
var cmd = require('node-cmd');

var javaPath = pth.resolve("./.content/java/bin");
var classPath = pth.resolve("./.content/java");

var vpath = pth.resolve('./.content/videos/') + "\\";
var tmp = window.localStorage.getItem('tmp');


if (fs.existsSync(tmp)) {
    var cpath = tmp + "\\";
} else {
    var cpath = vpath;
}



cmd.get(javaPath + '/java -Xmx1024M -cp ' + classPath + ' cln ' + cpath + " " + video.slice(0, -4), function (err, data, stderr) {});



function decrypt() {
    if (play == 1) {
        $("#load").show();
        cmd.get(javaPath + '/java -Xmx1024M -cp ' + classPath + ' dv ' + vpath + video, function (err, data, stderr) {
            if (stderr == "") {
                $("video").attr('src', data);
                fullscreen($("video"));
                $("#load").hide();
            } else {
                alert("Sorry! Something has gone wrong!");
                window.close();
            }
        });
        play = 0;
    }
}



function destroy() {
    play = 1;
    cmd.get(javaPath + '/java -cp ' + classPath + ' del ' + cpath + video.slice(0, -4), function (err, data, stderr) {
    });
}



function fullscreen(elem) {
    elem = elem || document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }

}