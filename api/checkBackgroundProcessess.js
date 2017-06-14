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
        window.location.href = 'index.html';
    } else {
        alert("Seems like you're running video recording software in the background. Please close the software and restart the application.");
        window.close();
    }
});