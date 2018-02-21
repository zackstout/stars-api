
$(document).ready(function() {




  $.ajax({
    type: 'GET',
    url: 'http://star-api.herokuapp.com/api/v1/stars'
    // url: 'https://api.giphy.com/v1/gifs/random?api_key=MgySsWcwlCGjN46KaT2DLAWOdyKQsfrk'
  }).done(function(response) {
    console.log(response);
  }).fail(function(err) {
    console.log(err);
  });
});
