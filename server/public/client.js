
$(document).ready(function() {

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
    console.log(data);
    console.log('======', '−' === '-');
    data.forEach(function(star) {

      star.vismag = Number(star.vismag);

      if (star.distance.indexOf('<') > 0) {
        star.distance = Number(star.distance.slice(0, star.distance.indexOf('<')));
      } else {
        star.distance = Number(star.distance);
      }

      // console.log('>' + star.absmag.charCodeAt(0) + '<');

      if (star.absmag.charCodeAt(0) === 8722 || star.absmag[0] === '-') {
        // console.log('huzzah');
        star.absmag = - parseFloat(star.absmag.slice(1));
      }
      star.absmag = parseFloat(star.absmag);

    });
    console.log(data);
  });

});
