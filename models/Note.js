// Require mongoose with Schemas being created saving the Object ids of the --
// --NOTES and then referred into Article.
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: {
    type: String
  },
  body: {
    type: String
  }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;