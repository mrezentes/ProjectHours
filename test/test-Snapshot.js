var snapshotProcessor = require('../ProcessSnapshots');


exports['getTimeElapsed'] = function (test){
    test.equal(snapshotProcessor.getTimeElapsed( new Date(Date.UTC(2012,9, 13, 11,17,0,0)), new Date(Date.UTC(2012,9, 14, 11,17,0,0))), 86400000 );
    test.equal(snapshotProcessor.getTimeElapsed( new Date(Date.UTC(2012,9, 13, 11,17,0,0)), new Date(Date.UTC(2012,9, 13, 11,17,0, 01))), 1 );
    test.equal(snapshotProcessor.getTimeElapsed( new Date(Date.UTC(2012,9, 13, 11,17,0,0)), new Date(Date.UTC(2012,9, 13, 11,17,0,0))), 0 );
    test.done();
};

exports['getMiddleDays'] = function (test){
    test.equal(snapshotProcessor.getMiddleDays( new Date(Date.UTC(2012,0, 12, 11,15,0,0)), new Date(Date.UTC(2012,0, 12, 11,45,0,0)), 8), 0 ); //Th to Th
    test.equal(snapshotProcessor.getMiddleDays( new Date(Date.UTC(2012,0, 12, 11,15,0,0)), new Date(Date.UTC(2012,0, 13, 11,45,0,0)), 8), 0 ); //same day -Th to Fri
    test.equal(snapshotProcessor.getMiddleDays( new Date(Date.UTC(2012,0, 12, 11,15,0,0)), new Date(Date.UTC(2012,0, 14, 11,45,0,0)), 8), 28800000 ); //Th to Sat
    test.equal(snapshotProcessor.getMiddleDays( new Date(Date.UTC(2012,0, 12, 11,15,0,0)), new Date(Date.UTC(2012,0, 15, 11,45,0,0)), 8), 28800000 ); //Th to Sat
    test.equal(snapshotProcessor.getMiddleDays( new Date(Date.UTC(2012,0, 27, 11,15,0,0)), new Date(Date.UTC(2012,1, 3, 11,15,0,0)),8), 115200000 );// Fri to Fri
    test.equal(snapshotProcessor.getMiddleDays( new Date(Date.UTC(2012,0, 27, 11,15,0,0)), new Date(Date.UTC(2012,1, 16, 11,15,0,0)),8),374400000  );//Fri to Thur
    test.equal(snapshotProcessor.getMiddleDays( new Date(Date.UTC(2012,0, 7, 11,15,0,0)), new Date(Date.UTC(2012,0, 9, 11,45,0,0)), 8), 0 );//Sat to Mon
    test.equal(snapshotProcessor.getMiddleDays( new Date(Date.UTC(2012,0, 8, 11,15,0,0)), new Date(Date.UTC(2012,0, 10, 11,45,0,0)), 8), 28800000 );//Sun to Tue
    test.equal(snapshotProcessor.getMiddleDays( new Date(Date.UTC(2012,0, 8, 11,15,0,0)), new Date(Date.UTC(2012,0, 14, 11,15,0,0)),8), 144000000 );//Sun to Sat
    test.equal(snapshotProcessor.getMiddleDays( new Date(Date.UTC(2012,0, 2, 11,15,0,0)), new Date(Date.UTC(2012,0, 14, 11,15,0,0)),8),259200000  );//Mon to Sat
    test.done();
};

exports['getBusinessTime'] = function (test){
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 8, 11,15,0,0)), new Date(Date.UTC(2012,0, 8, 11,15,0,54))), 0 ); //same day - sunday
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 7, 11,15,0,0)), new Date(Date.UTC(2012,0, 7, 11,15,0,54))), 0 ); //same day - saturday
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 12, 11,15,0,0)), new Date(Date.UTC(2012,0, 12, 11,45,0,0))), 1800000 ); //same day -Th to Th
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 8, 11,15,0,0)), new Date(Date.UTC(2012,0, 10, 11,45,0,0))), 38700000 );//Sun to Tue
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 7, 11,15,0,0)), new Date(Date.UTC(2012,0, 10, 11,45,0,0))), 38700000 );//Sat to Tue
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 8, 11,15,0,0)), new Date(Date.UTC(2012,0, 14, 11,15,0,0))), 144000000 );//Sun to Sat
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 2, 11,15,0,0)), new Date(Date.UTC(2012,0, 14, 11,45,0,0))),279900000  );//Mon to Sat
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 12, 11,15,0,0)), new Date(Date.UTC(2012,0, 14, 11,45,0,0))), 49500000 ); //Th to Sat
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 12, 11,15,0,0)), new Date(Date.UTC(2012,0, 15, 11,45,0,0))), 49500000 ); //Th to Sun
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 12, 11,15,0,0)), new Date(Date.UTC(2012,0, 16, 21,45,0,0))), 78300000 ); //Th to Monday
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 27, 11,15,0,0)), new Date(Date.UTC(2012,1, 3, 11,15,0,0))), 144000000 );// Fri to Fri
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 9, 11,15,0,0)), new Date(Date.UTC(2012,1, 3, 11,15,0,0))), 547200000 );// Tues to Fri
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 20, 11,15,0,0)), new Date(Date.UTC(2012,1, 2, 21,15,0,0))),279900000  );//Fri to Thur
    test.equal(snapshotProcessor.getBusinessTime( new Date(Date.UTC(2012,0, 7, 11,15,0,0)), new Date(Date.UTC(2012,0, 9, 11,45,0,0))), 9900000 );//Sat to Mon
    
    test.done();
};

exports['getDaySplit'] = function (test){
    test.equal(snapshotProcessor.getDaySplit( new Date(Date.UTC(2012,0, 14, 11,45,0,0)), 9, 17), 18900000 );//partial day
    test.equal(snapshotProcessor.getDaySplit( new Date(Date.UTC(2012,0, 12, 11,15,0,0)), 9, 17), 20700000 );//partial day
    test.equal(snapshotProcessor.getDaySplit( new Date(Date.UTC(2012,0, 27, 03,13,0,0)), 9, 17), 28800000);//starts before business hours
    test.equal(snapshotProcessor.getDaySplit( new Date(Date.UTC(2012,0, 27, 21,13,0,0)), 9, 17),0 );//starts after business hours
    test.done();
};

exports['getFebBusinessHours'] = function (test){
    //start in January, end in March
    test.equal(snapshotProcessor.getFebBusinessHours( new Date(Date.UTC(2012,0, 12, 11,15,0,0)),  new Date(Date.UTC(2012,2, 12, 11,15,0,0))), 604800000 );
    //start in January, end in February
    test.equal(snapshotProcessor.getFebBusinessHours(  new Date(Date.UTC(2012,0, 12, 11,15,0,0)),  new Date(Date.UTC(2012,1, 10, 11,15,0,0))), 209700000 );
    //start in January, end in January
    test.equal(snapshotProcessor.getFebBusinessHours( new Date(Date.UTC(2012,0, 12, 11,15,0,0)),  new Date(Date.UTC(2012,0, 10, 11,15,0,0))), 0 );
    //start in February, end in February
    test.equal(snapshotProcessor.getFebBusinessHours(  new Date(Date.UTC(2012,1, 1, 11,15,0,0)),  new Date(Date.UTC(2012,1, 10, 13,30,0,0))), 209700000 );
    test.done();
};