//----------------//
var request = require("request");

var cheerio = require("cheerio");

var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//future models for note and story/article
//var Note = require("./models/Note.js");
//var Story = require("./models/Story.js");

mongoose.Promise = Promise;
var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scraper");
var db = mongoose.connection;

// errors to be shown
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

//Gets all the articles we scraped from mongoDB
app.get("/all", function(req, res) {
    // Finds every doc in the Articles array
    Article.find({}, function(error, doc) {
      
        if (error) {
            console.log(error);
        }
       
        else {
            res.json(doc);
        }
    });
});

//Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Making a request call for BBC
    request("http://www.bbc.com/news/world", function(error, response, html) {

        //Loaded the HTML into cheerio and saved it to a variable
        var $ = cheerio.load(html);
      
        $("a.title-link__title-text").each(function(i, element) {

            //Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).text();
            result.link = $(this).attr("href");

            // Using our Article model, create a new entry
            var entry = new Article(result);

            // Now, save that entry to the db
            entry.save(function(err, doc) {
            
                if (err) {
                    console.log(err);
                }
                
                else {
                    console.log(doc);
                }
            });



        });
    });
    //Sends message of complete
    res.send("Scrape Complete")
});

// Grab an article by it's ObjectId
app.get("/all/:id", function(req, res) {
    Article.findOne({
            "_id": req.params.id
        })
     
        .populate("note")
      
        .exec(function(error, doc) {
            
            if (error) {
                console.log(error);
            }
            
            else {
                res.json(doc);
            }
        });
});


// Create a new note or replace
app.post("/all/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    var newNote = new Note(req.body);

    // And save the new note
    newNote.save(function(error, doc) {
   
        if (error) {
            console.log(error);
        }
     
        else {
            // Use the article id to find and update it's note
            Article.findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    "note": doc._id
                })
                // Execute the above query
                .exec(function(err, doc) {
                   
                    if (err) {
                        console.log(err);
                    } else {
                       
                        res.send(doc);
                    }
                });
        }
    });
});

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});