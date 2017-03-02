// json articles
$.getJSON("/all", function(data) {
  for (var i = 0; i < data.length; i++) {
    //information to be displayed
    $("#articles").append("<p id='headline' data-id='" + data[i]._id + "'>" + data[i].title + "</p>" + "<p id='link'>"+"<a target='_blank' href='"+data[i].link +"'>Link to Article</a></p>");
  }
});

$(document).on("click", "p", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/all/" + thisId
  })

    .done(function(data) {
      console.log(data);
      // The title of article
      $("#notes").append("<h2>" + data.title + "</h2>");

      $("#notes").append("<input id='titleinput' name='title' >");

      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {

        $("#titleinput").val(data.note.title);

        $("#bodyinput").val(data.note.body);
      }
    });
});


$(document).on("click", "#savenote", function() {

  var thisId = $(this).attr("data-id");
  // Run a POST request
  $.ajax({
    method: "POST",
    url: "/all/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});