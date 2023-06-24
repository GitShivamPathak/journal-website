
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
var favicon = require('serve-favicon');
const mongoose = require('mongoose')
const app = express();

app.use(favicon(__dirname + '/favicon.ico'));

mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

const homeStartingContent = "Journaling is a written record of our thoughts & feelings. There are really not any rules although most journaling is a daily exercise. Journaling is a way to track everyday life. Figuring out what makes us tick and happy or upset. Creating a meaningful connection with ourselves is as important as creating meaningful connections with family or friends.";




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", function (req, res) {

  Post.find({}, function (err, post) {
    res.render("home", {
      homeContent: homeStartingContent,
      posts: post
    });
  });

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.get("/compose", function (req, res) {
  res.render("compose");
});


app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {

    res.render("post", {
      title: post.title,
      content: post.content
    });

  });

});

app.post("/compose", function (req, res) {

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });


});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
