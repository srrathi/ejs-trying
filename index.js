const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { isLoggedIn } = require("./middleware/middleware");
const flash = require("connect-flash");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_DATABASE_USERNAME}:${process.env.MONGODB_DATABASE_ACCESS_KEY}@mern-learning.uou9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("MongoDb connected successfully"))
  .catch((err) => console.log(err.message));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
const authRoutes = require(path.join(__dirname, "routes/authRoutes.js"));

//Apis
const postsApiRoute = require("./routes/api/posts");

app.use(
  session({ secret: "weneedasecret", resave: false, saveUninitialized: true })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Using Routes
app.use(authRoutes);

// Using Apis
app.use(postsApiRoute);


app.get("/", isLoggedIn, (req, res) => {
  res.render("layouts/main-layout");
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
