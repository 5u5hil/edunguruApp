$("#load").show();
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
var topicIndex = QueryString.topicIndex;
var index = QueryString.index;
var note = QueryString.note;
var filename = QueryString.filename;

var pth = require('path');
var fs = require('fs');
var cmd = require('node-cmd');

var javaPath = pth.resolve("./.content/java/bin");
var classPath = pth.resolve("./.content/java");

var vpath = pth.resolve('./.content/notes/') + "\\";
var tmp = window.localStorage.getItem('tmp');



if (fs.existsSync(tmp)) {
    var cpath = tmp + "\\";
} else {
    var cpath = vpath;
}

var npath = cpath;


var noteWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));

cmd.get(javaPath + '/java -cp ' + classPath + ' ed ' + vpath + noteWithoutExtension + '.eng ' + cpath + '/' + filename + ' decrypt', function (err, data, stderr) {

    if (data.indexOf('success') >= 0) {

        $("webview").attr('src', npath + '/' + filename + '#toolbar=0&navpanes=0&scrollbar=0');


        $("#load").hide();

        webview = document.querySelector('webview')
        setTimeout(function(){
             fs.unlinkSync(npath + '/' + filename);
        },2000);
       

        const loadstop = () => {
            console.log("done")
        }


        webview.addEventListener('did-stop-loading', loadstop)

    } else {
        alert("Sorry! Something has gone wrong!");
        window.close();
    }
});




function destroy() {
    play = 1;
    cmd.get(javaPath + '/java -cp ' + classPath + ' del ' + cpath + video.slice(0, -4), function (err, data, stderr) {
    });
}






