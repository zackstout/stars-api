
var express = require('express');
var app = express();
// var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var wikipedia = require("wikipedia-js");
var wiki = require("node-wikipedia");

var constellations = [];
var allStars = [];


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
        });
        //finally got it, just have to catch it here:
        console.log("ALL STARS:", allStars);


      });
    }

  });

});


// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

// Start listening for requests on a specific port
app.listen(port, function() {
  console.log('thx for listening on channel ', port);
});
