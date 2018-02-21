
var express = require('express');
var app = express();
// var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var wikipedia = require("wikipedia-js");
var wiki = require("node-wikipedia");

var constellations = [];


wiki.page.data("Lists_of_stars_by_constellation", { content: true }, function(response) {
	// console.log(response.text['*']);

  var allStars = [];

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
    if (ind == 4) {
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
          var name, visMag, absMag, distance, notes, rightAsc, declin;
          var cells = row.split('<td>');
          // console.log(cells);

          name = cells[1].slice(cells[1].indexOf('title'), cells[1].indexOf('>'));
          visMag = cells[10];
          absMag = cells[11];
          distance = cells[12];
          notes = cells[13];
          rightAsc = cells[8];
          declin = cells[9];

          star.name = name;
          star.absMag = absMag;
          star.distance = distance;
          star.notes = notes;
          star.rightAsc = rightAsc;
          star.declin = declin;

          console.log("STAR", star);

          allStars.push(star);
        });

      });
    }

  });
  console.log("all the stars:", allStars);

});


// var query = "Lists of stars by constellation";
// var options = {query: query, format: "html", summaryOnly: false};
// wikipedia.searchArticle(options, function(err, htmlWikiText) {
//   if(err){
//     console.log("An error occurred[query=%s, error=%s]", query, err);
//     return;
//   }
//   var list = htmlWikiText.slice(htmlWikiText.indexOf('<ul>'), htmlWikiText.indexOf('</ul>'));
//   // console.log(list);
//   var arr = list.split("<li>");
//   // console.log(arr);
//   arr.forEach(function(item) {
//     var conPrep = item.slice(1);
//     var constellation = item.slice(conPrep.indexOf('>') + 2, conPrep.indexOf('<') + 1);
//     // console.log(constellation);
//     constellations.push(constellation);
//
//   });
//
//   console.log(constellations);
//   constellations.forEach(function(con) {
//     // console.log(con);
//     var query2 = "List of stars in " + con;
//     // var query2 = "List of stars in Virgo";
//     var options2 = {query: query2, format: "html", summaryOnly: false};
//     wikipedia.searchArticle(options2, function (err, html2) {
//       if (err) {
//         console.log(err);
//        return;
//      } else {
//       console.log("Const data: ", html2);
//      }
//    });
//
//   });
// });


// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

// Start listening for requests on a specific port
app.listen(port, function() {
  console.log('thx for listening on channel ', port);
});
