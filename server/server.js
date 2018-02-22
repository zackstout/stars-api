
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: true}));

// Dependencies:
var wikipedia = require("wikipedia-js");
var wiki = require("node-wikipedia");
// var router = express.Router();
var pg = require('pg');
var config = {
  database: 'stars', // the name of the database
  host: 'localhost', // where is your database?
  port: 5432, // the port number for you database, 5432 is the default
  max: 10, // how many connections at one time
  idleTimeoutMillis: 30000 // Close idle connections to db after
};

var pool = new pg.Pool(config);

// Global variables:
var constellations = [];
var allStars = [];
var uhOhs = [];
var goods = [];

function updateDB(star) {
  // console.log("UPDDATING: ", star);

  // YES, that was the key, to get rid of the app.get() rigamarole!!!

  // wait, why on earth is Postico showing us capping at 1000 stars??? wait, and why are so many of them from the same constellation????

  pool.connect(function (errorConnectingToDb, db, done) {
    if (errorConnectingToDb) {
      // There was an error and no connection was made
      console.log('Error connecting', errorConnectingToDb);
    } else {
      // We connected to the db!!!!! pool -1
      // console.log(star, "HI THERE");
      var queryText = 'INSERT INTO "stars2" ("name", "vismag", "absmag", "distance", "constellation") VALUES ($1, $2, $3, $4, $5);';
      db.query(queryText, [star.name, star.visMag, star.absMag, star.distance, star.const], function (errorMakingQuery, result) {
        // We have received an error or result at this point
        done(); // pool +1
        if (errorMakingQuery) {
          console.log('Error making query', errorMakingQuery);
        } else {
          // Send back success!
        }
      }); // END QUERY
    }
  }); // END POOL
}


function cleanDB() {

  // This will remove all dupes:
  // select *
  // from
  // (
  // select
  //     *,
  //     row_number() over (partition by name order by constellation) as RowNbr
  //
  // from stars2
  // ) source
  //
  // where RowNbr = 1;

  pool.connect(function (errorConnectingToDb, db, done) {
    if (errorConnectingToDb) {
      // There was an error and no connection was made
      console.log('Error connecting', errorConnectingToDb);
    } else {
      // We connected to the db!!!!! pool -1
      // console.log(star, "HI THERE");
      var queryText = 'select * from (select *, row_number() OVER (partition by name) as RowNbr from stars2) source where RowNbr = 1';
      db.query(queryText, [], function (errorMakingQuery, result) {
        // We have received an error or result at this point
        done(); // pool +1
        if (errorMakingQuery) {
          console.log('Error making query', errorMakingQuery);
        } else {
          // Send back success!
          console.log("RESULT: ", result);
        }
      }); // END QUERY
    }
  }); // END POOL
}


wiki.page.data("Lists_of_stars_by_constellation", { content: true }, function(response) {
  // console.log(response.text['*']);


  var txt = response.text['*'];

  var start = txt.indexOf('style="width:25%;text-align:left;vertical-align:top;');
  var end = txt.indexOf('<h2><span class="mw-headline" id="Criteria_of_inclusion">');
  var list = txt.slice(start, end);
  var arr = list.split('<li>');
  // console.log(arr);

  arr.forEach(function(item, index) {
    if (index > 0) {
      var starter = item.indexOf('List of stars in ');
      var ender = item.indexOf('">');
      var constellation = item.slice(starter, ender).slice(17);
      // console.log(constellation);
      constellations.push(constellation);

    }
  });

  constellations.forEach(function(con, ind) {
    if (true) {
      wiki.page.data("List_of_stars_in_" + con, {content: true}, function(resp) {
        var short = resp.text['*'].slice(0, 5500);
        // console.log("RESPONSE: ", short);
        var rows = short.split('<tr>');
        rows.shift();
        rows.shift();
        // console.log(rows);

        // var cells = [];

        rows.forEach(function(row) {
          var star = {};
          var name, realName, visMag, absMag, distance, notes, rightAsc, declin;
          var cells = row.split('<td>');
          // console.log(cells);

          name = cells[1].slice(cells[1].indexOf('title'), cells[1].indexOf('>'));

          realName = name.slice(7, name.length - 1);

          // Thanks wikipedia for having tables with different numbers of columns:
          if (cells.length == 14) {
            rightAsc = cells[7];
            declin = cells[8];
            visMag = cells[9];
            absMag = cells[10];
            realVisMag = cells[9].slice(0, cells[9].indexOf('<'));
            realAbsMag = cells[10].slice(0, cells[10].indexOf('<'));
            distance = cells[11];
            realDistance = cells[11].slice(0, cells[11].indexOf('<'));
            notes = cells[12];
          }
          if (cells.length == 13) {
            rightAsc = cells[6];
            declin = cells[7];
            visMag = cells[8];
            absMag = cells[9];
            realVisMag = cells[8].slice(0, cells[8].indexOf('<'));
            realAbsMag = cells[9].slice(0, cells[9].indexOf('<'));
            distance = cells[10];
            realDistance = cells[10].slice(0, cells[10].indexOf('<'));
            notes = cells[11];
          }
          if (cells.length == 12) {
            rightAsc = cells[5];
            declin = cells[6];
            visMag = cells[7];
            absMag = cells[8];
            realVisMag = cells[7].slice(0, cells[7].indexOf('<'));
            realAbsMag = cells[8].slice(0, cells[8].indexOf('<'));
            distance = cells[9];
            realDistance = cells[9].slice(0, cells[9].indexOf('<'));
            notes = cells[10];
          }

          star.const = con;
          star.name = realName;
          star.absMag = realAbsMag;
          star.visMag = realVisMag;
          star.distance = realDistance;
          star.notes = notes;
          star.rightAsc = rightAsc;
          star.declin = declin;
          star.length = cells.length;

          // console.log("STAR", star);

          allStars.push(star);
        }); // END LOOP THROUGH ROWS
        //finally got it, just have to catch it here:
        // console.log("ALL STARS:", allStars);

        // determine whether it's a good one or not:
        allStars.forEach(function(star) {
          if (star.visMag.indexOf('&') != -1) {
            uhOhs.push(star);
            // console.log("UH OH!");
          } else {
            goods.push(star);
          }
        });

        // OK, don't need to do this again:
        // goods.forEach(function(good) {
        //   updateDB(good);
        // });

      }); // END INNER WIKI CALL
    }
  }); // END LOOP THROUGH CONSTELLATIONS
}); // END OUTER WIKI CALL

cleanDB();
// console.log("goods are: ", goods);

// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

// Start listening for requests on a specific port
app.listen(port, function() {
  console.log('thx for listening on channel ', port);
});
