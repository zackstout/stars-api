
var orderedStars = [];

$(document).ready(function() {
  var allStars = new Array();

  // $.ajax({
  //   type: 'GET',
  //   url: 'stars'
  //   // url: 'https://api.giphy.com/v1/gifs/random?api_key=MgySsWcwlCGjN46KaT2DLAWOdyKQsfrk'
  // }).done(function(response) {
  //   console.log(response);
  // }).fail(function(err) {
  //   console.log(err);
  // });

  d3.csv('allthestars.csv', function(data) {
    // console.log(data);
    // console.log('======', '−' === '-');
    data.forEach(function(star) {

      star.vismag = Number(star.vismag);

      if (star.distance.indexOf('<') > 0) {
        star.distance = Number(star.distance.slice(0, star.distance.indexOf('<')));
      } else {
        star.distance = Number(star.distance);
      }

      if (star.absmag.charCodeAt(0) === 8722 || star.absmag[0] === '-') {
        // console.log('huzzah');
        star.absmag = - parseFloat(star.absmag.slice(1));
      } else {
        star.absmag = parseFloat(star.absmag);
      }
      allStars.push(star);
      // console.log(allStars);
    });

    console.log(data);
    console.log(reorder(data));

    // won't be able to access globally because of asynchronicity:
    // allStars = data;
  });

});

function reorder(arr) {
  var stars = arr;
  var mags = [];
  var orderedMags = [];
  var newStars = [];
  arr.forEach(function(star) {
    mags.push(star.absmag);
  });
  console.log(mags);

  //this is weird but whatever:
  for (var i=0; i < mags.length; i++) {
    var min = Math.min(mags);
    if (isNaN(min)) {
      var index = mags.findIndex(elem => isNaN(elem));
      console.log(index);
      if (index > 0) {
        mags.splice(index, 1);
      }
    }
  }

  console.log(mags);

  // while (isNaN(Math.min(mags))) {
  //   var index = mags.findIndex(elem => isNaN(elem));
  //   mags.splice(index, 1);
  // }
  //
  // console.log(mags);
  //
  // while (mags.length > 0) {
  //   var min = Math.min(mags);
  //   var index;
  //   // Oh, the problem is that indexOf cannot detect presence of NaN -- always returns -1:
  //   if (isNaN(min)) {
  //     index = mags.findIndex(elem => isNaN(elem));
  //     console.log(index);
  //     mags.splice(index, 1);
  //   }
  //
  //   // orderedMags.push(min);
  // }

  console.log(orderedMags);


}
