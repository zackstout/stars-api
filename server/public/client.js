
var orderedStars = [];

$(document).ready(function() {
  var allStars = new Array();

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
    console.log(reorder(data, 'dist'));

    // won't be able to access globally because of asynchronicity:
    // allStars = data;
  });

});

function reorder(arr, type) {
  var stars = arr;
  var mags = [];
  var orderedMags = [];
  var newStars = [];
  stars.forEach(function(star) {
    if (type == 'abs') {
      mags.push(star.absmag);
    } else if (type == 'rel') {
      mags.push(star.vismag);
    } else if (type == 'dist') {
      mags.push(star.distance);
    }
  });
  // console.log(mags);

  //this is weird but whatever:
  for (var i=0; i < mags.length + 10; i++) {
    var min = Math.min(mags);
    if (isNaN(min)) {
      var index = mags.findIndex(elem => isNaN(elem));
      if (index > 0) {
        // console.log(index);

        mags.splice(index, 1);
        stars.splice(index, 1);
      }
    }
  }

  // console.log(mags);
  // console.log(mags.includes(NaN));

  // how odd, Math.min can't handle an actual array without the "spread" operator:
  // console.log(Math.min(...mags));

  while (mags.length > 0) {
    var min2 = Math.min(...mags);
    // console.log(min);
    var index2 = mags.indexOf(min2);
    mags.splice(index2, 1);
    orderedMags.push(min2);
    newStars.push(stars[index2]);
    stars.splice(index2, 1);
  }

  console.log(orderedMags);
  console.log(newStars);

  return newStars;
}
