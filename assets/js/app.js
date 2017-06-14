var edu = angular.module("EdunGuru", []);

edu.controller("courseCtrl", function ($scope, $http) {
    $scope.nwDir = "../../content/";
    $scope.courses = JSON.parse(window.localStorage.getItem('content'));
    $scope.validity = JSON.parse(window.localStorage.getItem('validity'));

});


edu.controller("chapterCtrl", function ($scope, $http) {
    var course = QueryString.course;
    var validity = QueryString.validity;
    var index = QueryString.index;
    var icon = QueryString.icon;



    $scope.nwDir = "../../content/";
    $scope.course = course;
    $scope.icon = JSON.parse(window.localStorage.getItem('content'))[index]['icon'];
    ;
    $scope.index = index
    $scope.chapters = JSON.parse(window.localStorage.getItem('content'))[index]['chapters'];
    $scope.validity = validity;


});

edu.controller("topicsCtrl", function ($scope, $http) {

    var course = QueryString.course;
    var chapter = QueryString.chapter;
    var index = QueryString.index;
    var courseIndex = QueryString.courseIndex;



    $scope.nwDir = "../../content/";


    $scope.course = course;
    $scope.chapter = chapter;
    $scope.topics = JSON.parse(window.localStorage.getItem('content'))[courseIndex]['chapters'][index]['topics'];
    $scope.courseIndex = courseIndex;
    $scope.index = index;
});

edu.controller("topicCtrl", function ($scope, $http) {



    $scope.course = course;
    $scope.chapter = chapter;
    $scope.topic = topic;
    $scope.courseIndex = courseIndex;

    $scope.chapterIndex = chapterIndex;


    document.getElementById("video").play();
    document.getElementById('video').addEventListener('ended', destroy, false);
    document.getElementById('video').addEventListener('play', decrypt, false);

});



$(document).ready(function () {



    $("#exit").click(function (e) {
        e.preventDefault();
        var r = confirm("Are you sure you want to quit?");
        if (r == true) {
            window.close();
        } else {

        }
    });

    $("#refresh").click(function (e) {
        e.preventDefault();
        window.location.reload();
    });

    $("#back").click(function (e) {
        e.preventDefault();
        window.history.go(-1);
    });

    $(document).keydown(function (e) {
        e.preventDefault();
        alert("Please don't press any keys while the app is on. The App will quit now");
        window.close();
    });




});

var shell = require('electron').shell;
//open links externally by default
$(document).on('click', 'a[href^="http"]', function (event) {
    event.preventDefault();
    shell.openExternal(this.href);
});


$(document).keydown(function (e) {

    if (e.keyCode == 37) {
        alert("windows key pressed");
        return false;
    }
});

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

setInterval(function () {
    checkBackgroundProccesses();
    console.log("Hello");
}, 30000);



function checkBackgroundProccesses() {
    var ps = require('ps-node');
    var path = require('path');
    var processes = [];

    ps.lookup({}, function (err, resultList) {
        if (err) {
            throw new Error(err);
        }

        var p = "";
        resultList.forEach(function (process) {
            if (process.command) {

                processes.push(path.basename(process.command).toLowerCase());
            }
        });
        processes = processes.filter(function (elem, pos) {
            return processes.indexOf(elem) == pos;
        });
        var notAllowed = JSON.parse(window.localStorage.getItem("validity")).blacklistedApps;
        var results = processes.filter(function (fs) {
            return notAllowed.some(function (ff) {
                return fs.indexOf(ff) > -1
            });
        });
        if (results.length <= 0) {

        } else {
            alert("Seems like you're running video recording software in the background. Please close the software and restart this app");
            window.close();
        }
    });

}