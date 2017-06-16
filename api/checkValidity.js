var ps = require('ps-node');
var fs = require('fs');
var path = require('path');
var macaddress = require('node-macaddress');
var os = require('os');
var tmp = os.tmpdir() + "\\croatoan";
var cmd = require('node-cmd');

var processes = [];

var macA;
var validity;
var javaPath = path.resolve("./java/bin");
var classPath = path.resolve("./java/lib");
var cpath = path.resolve('./content');


$(document).keydown(function (e) {
    e.preventDefault();
    alert("Please don't press any keys while the app is on. The appication will quit now.");
    window.close();
});

macaddress.one(function (err, mac) {
    macA = mac
});


cmd.get(javaPath + '/java TestFileEncryption ' + cpath + '/validity.eng ' + cpath + '/validity.json decrypt', function (err, data, stderr) {



    if (data.indexOf('success') >= 0) {

        validity = JSON.parse(fs.readFileSync("./content/validity.json", 'utf8'));

        cmd.get(
                'wmic diskdrive get PNPDeviceID',
                function (err, data, stderr) {
                    if (data.indexOf(validity.usbNumber) < 0) {
                        alert("Sorry! You're not authorized to run this Application!");
                        window.close();
                    }

                }
        );

        var loadingDate = new Date(validity.loadingDate);
        var validUpto = new Date(validity.validUpto);
        var lastAccessedOn = new Date(validity.lastAccessedOn);
        var today = new Date();
        validity.lastAccessedOn = today.toISOString().slice(0, 10).replace(/-/g, "-");

        if (validity.devices.length < 3 && validity.devices.indexOf(macA) < 0)
            validity.devices.push(macA)


        fs.writeFile("./content/validity.json", JSON.stringify(validity), function (err) {

            cmd.get(javaPath + '/java TestFileEncryption ' + cpath + '/validity.json ' + cpath + '/validity.eng encrypt', function (err, data, stderr) {
                if (data.indexOf('success') >= 0) {
                    cmd.get(javaPath + '/java del ' + cpath + '/validity', function (err, data, stderr) {

                    });
                } else {
                    alert("Sorry! Something has gone wrong!");
                    window.close();
                }
            });
        });

        if (loadingDate > today || today > validUpto || today < lastAccessedOn) {
            alert("Sorry! The validity of this application is over!");
            window.close();
        }

        if (validity.devices.length = 3 && $.inArray(macA, validity.devices) < 0) {
            alert("Sorry! You can use the application only on maximum two computers!");
            window.close();
        }

        window.localStorage.setItem("validity", JSON.stringify(validity));

    } else {
        alert("Sorry! Something has gone wrong!");
        window.close();
    }


});



    cmd.get(javaPath + '/java -Xmx500M TestFileEncryption ' + cpath + '/content.eng ' + cpath + '/content.json decrypt', function (err, data, stderr) {
        var content = fs.readFileSync("./content/content.json", 'utf8');
        window.localStorage.setItem("content", content);

        cmd.get(javaPath + '/java del ' + cpath + '/content', function (err, data, stderr) { });
    });


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
        cmd.get(javaPath + '/java del ' + cpath + '/validity', function (err, data, stderr) {
            window.location.href = 'index.html';
        });


    } else {
        alert("Seems like you're running video recording software in the background. Please close the software and restart the application.");
        window.close();
    }
});


window.localStorage.setItem('tmp', tmp);


if (!fs.existsSync(tmp)) {
    try {
        fs.mkdirSync(tmp);
    } catch (err) {
        console.log(err)
    }
}