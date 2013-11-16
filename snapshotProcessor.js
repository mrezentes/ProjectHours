/*
 * Miki Rezentes 
 * Rally Coding Exercise
 */
fs = require('fs');
fs.readFile('1000-snapshots-overlap-with-Feb-2012.json', 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }

    processSnapshots(JSON.parse(data));

});

var febStart = new Date();
febStart.setUTCFullYear(2012, 1, 1);// first day of February
febStart.setUTCHours(0, 0, 0, 0);

var febEnd = new Date();
// day before first day of March, keeps leap year from messing things up
febEnd.setUTCFullYear(2012, 2, 1);
febEnd.setUTCHours(0, 0, 0, 0);

// hold the time values in this object
var timeTotals = (function() {
    var scheduleStates = {};
    var stateList = [];
    var projectTimeTotals = {};
    var projectList = [];

    return {
        addProjectTime : function(objectID, febTimes) {
            console.log("Times passed to febtimeadd: " + febTimes.febTime + "  " + febTimes.febBusinessTime);
            if (projectTimeTotals.hasOwnProperty(objectID)) {
                projectTimeTotals[objectID].febTime += febTimes.febTime;
                console.log(projectTimeTotals[objectID].febTime);
                projectTimeTotals[objectID].febBusinessTime += febTimes.febBusinessTime;
                console.log(projectTimeTotals[objectID].febBusinessTime);
                console.log(objectID + " : " + projectTimeTotals[objectID].febTime / 1000 / 60 / 60 + "   "
                        + projectTimeTotals[objectID].febBusinessTime / 1000 / 60 / 60);
            } else {
                projectList[projectList.length] = objectID;
                // //console.log(projectList);
                projectTimeTotals[objectID] = febTimes;
                console.log(projectTimeTotals[objectID]);
                // console.log(projectTimeTotals);
                console.log("Added new objectID of " + objectID + " : " + projectTimeTotals[objectID].febTime / 1000
                        / 60 / 60 + "   " + projectTimeTotals[objectID].febBusinessTime / 1000 / 60 / 60);

            }
        },
        getProjectFebTime : function() {
            console.log("\nNumber of projects: " + projectList.length);
            var result = "\n";
            for (var i = 0; i < projectList.length; i = i + 1) {

                result = result + projectList[i] + ": \n Total business hours used in February : "
                        + projectTimeTotals[projectList[i]].febBusinessTime / 1000 / 60 / 60
                        + "\n Total hours used in February: " + projectTimeTotals[projectList[i]].febTime / 1000 / 60
                        / 60 + "\n";

            }
            return result;
        },
        addScheduleStateAndTime : function(stateName, time) {
            if (scheduleStates.hasOwnProperty(stateName)) {
                scheduleStates[stateName] = scheduleStates[stateName] + time;
                console.log(stateName + " : " + scheduleStates[stateName] / 1000 / 60 / 60);
            } else {
                stateList[stateList.length] = stateName;
                scheduleStates[stateName] = time;

                console.log("Added new scheduleState of " + stateName + " : " + scheduleStates[stateName] / 1000 / 60
                        / 60);

            }
        },
        getScheduledStates : function() {
            var result = "\n";
            for (var i = 0; i < stateList.length; i = i + 1) {

                result = result + stateList[i] + ": " + scheduleStates[stateList[i]] / 1000 / 60 / 60 + "\n";

            }
            return result;
        }
    };
}());

// Assuming that data from file is valid, minimal validation included.
/*
 * Basic Idea is that you have chunk of time with full business days in the middle, the first day and the last day could
 * be partial days. Find the middle days, find the first and last days, add them together get the total
 */
function processSnapshots(snapshots) {
    var startTime, endTime; // snapshot starts and ends

    for (var i = 0; i < snapshots.length; i = i + 1) {
        console.log("\n" + i);

        // set start and end times for each snapshot
        startTime = new Date(snapshots[i]._ValidFrom);
        if (snapshots[i]._ValidTo == '9999-01-01T00:00:00.000Z') {
            // deal with projects that are not yet completed.
            endTime = new Date();
        } else {
            endTime = new Date(snapshots[i]._ValidTo);
        }

        // calculate schedule states and times for each entry
        // add it to the schedule states
        timeTotals.addScheduleStateAndTime(snapshots[i].ScheduleState, getBusinessTime(startTime, endTime));

        // project must be in or overlapping February for feb total
        if (startTime.getTime() <= febEnd.getTime() && endTime.getTime() >= febStart.getTime()) {

            febTotals = processFebTime(startTime, endTime);
            console.log("Feb Business: " + febTotals.febBusinessTime);
            timeTotals.addProjectTime(snapshots[i].ObjectID, febTotals);
        } else {
            febTotals = {
                "febTime" : 0,
                "febBusinessTime" : 0
            };
            timeTotals.addProjectTime(snapshots[i].ObjectID, febTotals);
        }
    }
    showResult();
}

function processFebTime(sTime, eTime) {
    var startTime = new Date(sTime);
    var endTime = new Date(eTime);
    var result = {
        "febTime" : 0,
        "febBusinessTime" : 0
    };

    // restrict hours counted to those in february
    if (startTime < febStart) {
        startTime = new Date(febStart);

        console.log("New startTime of " + febStart.toUTCString());

    }
    if (endTime > febEnd) {
        endTime = new Date(febEnd);

        console.log("New endTime of " + febEnd.toUTCString());
    }

    result.febTime = getTimeElapsed(startTime, endTime);
    result.febBusinessTime = getBusinessTime(startTime, endTime);

    console.log("Feb Time in hours: " + result.febTime / 1000 / 60 / 60);

    return result;

}

function getTimeElapsed(sTime, eTime) {
    return eTime.getTime() - sTime.getTime();
}

function getBusinessTime(sTime, eTime) {
    var startTime = new Date(sTime);
    var endTime = new Date(eTime);
    console.log("StartTime: " + startTime.toUTCString());
    console.log("EndTime: " + endTime.toUTCString());
    // Business hours as given in spec
    var endOfBusinessDay = 17;
    var startOfBusinessDay = 9;
    var workDayInMilliseconds = (endOfBusinessDay - startOfBusinessDay) * 1000 * 60 * 60;

    var businessTime = 0;
    var startDay, endDay;
    // get the day of the week associated with the dates
    startDay = startTime.getUTCDay();
    endDay = endTime.getUTCDay();

    // Special case of project starting and ending on same day
    // 
    if (startTime.getDate() === endTime.getDate() && startTime.getYear() === endTime.getYear()) {
        if (endDay !== 0 && endDay !== 6) {
            businessTime += getDaySplit(startTime, startOfBusinessDay, endOfBusinessDay)
                    - getDaySplit(endTime, startOfBusinessDay, endOfBusinessDay);
            console.log("Special case: project finished in one day " + businessTime / 1000 / 60 / 60);

        } else {
            // no change to business hours, project was started and
            // finished on weekend day.
        }
    }

    // project spans more than one day
    else {

        // Don't count first day for business hours if it is on a
        // weekend.

        // Find split for first day
        if (startDay === 0 || startDay === 6) {
            // Do nothing, it's a weekend day
        }
        // it is a partial day, must compute
        else {
            businessTime += getDaySplit(startTime, startOfBusinessDay, endOfBusinessDay);
            /*
             * console.log("Partial first day: " + getDaySplit(startTime, startOfBusinessDay,
             * endOfBusinessDay)/1000/60/60 );
             */
        }

        // Don't count last day for business hours if it is on a
        // weekend.

        // find split for last day
        if (endDay === 0 || endDay === 6) {
            // do nothing, last day is a weekend day or has no business hours in
            // it
            console.log("Last Day was a weekend day");
        }
        // it is a partial day, compute hours
        else {

            businessTime += workDayInMilliseconds - getDaySplit(endTime, startOfBusinessDay, endOfBusinessDay);
            /*
             * console.log("Partial last day: " + ((8 * 60 * 60 * 1000) - getDaySplit(endTime, startOfBusinessDay,
             * endOfBusinessDay))/1000/60/60);
             */
        }

        // figure out how many full days are in between
        businessTime += getMiddleDays(startTime, endTime, endOfBusinessDay - startOfBusinessDay);

    }

    console.log("Business hours: " + businessTime / 1000 / 60 / 60);
    return businessTime;

}

// This function return the portion of the business day from split to end of day
function getDaySplit(splitTime, startOfBusinessDay, endOfBusinessDay) {
    var timeElapse;
    var endOfDay = new Date(splitTime);
    var startOfDay = new Date(splitTime);
    endOfDay.setUTCHours(endOfBusinessDay, 0, 0, 0);
    startOfDay.setUTCHours(startOfBusinessDay, 0, 0, 0);
    if (startOfDay > splitTime) {
        timeElapse = endOfDay.getTime() - startOfDay.getTime();
    } else {
        timeElapse = endOfDay.getTime() - splitTime.getTime();
    }
    if (timeElapse > 0) {
        return timeElapse;
    } else {
        return 0;
    }
}

function getMiddleDays(sTime, eTime, hoursInTheDay) {
    var startDay, endDay, timeElapsed;
    var startTime = sTime;
    // we have already counted the partial first day,move to start of Day2
    startTime.setUTCHours(24, 0, 0, 0);

    startDay = startTime.getUTCDay();
    var endTime = eTime;
    // We have already counted the partial of the last day, move to the very
    // beginning of the last day
    endTime.setUTCHours(0, 0, 0, 0);
    // Back up one day, last day has already been calculated.
    endDay = endTime.getUTCDay() - 1;
    if (endDay < 0) {// in case endDay is -1
        endDay = 6;
    }
    timeElapsed = endTime.getTime() - startTime.getTime();
    var days = timeElapsed / (1000 * 60 * 60 * 24);

    var fullWeeks = Math.floor(days / 7);
    var weekendDays = fullWeeks * 2;

    if (days % 7 === 0) {
        // no extra weekend days to remove
    } else if (startDay === 0) {// remove the extra Sunday
        weekendDays += 1;
    } else if (endDay === 6) {// remove the extra Saturday
        weekendDays += 1;
    } else if (endDay < startDay) {// remove the extra weekend
        weekendDays += 2;
    }
    return (days - weekendDays) * hoursInTheDay * 60 * 60 * 1000;

}

function showResult() {
    console.log("\nProject totals for February: \n " + timeTotals.getProjectFebTime());

    console.log("\nSchedule States in hours: \n" + timeTotals.getScheduledStates());

}
