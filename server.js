const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connect(mongoURI);

app.use(express.static("public"));
app.use(express.urlencoded());
app.set("view engine", "pug");

const URLSchema = new Schema({
  URL: { type: String },
  counter: { type: Number }
});

let URL = mongoose.model("URL", URLSchema);
let counter = 0;

app.use(express.static("public"));
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/new", (req, res) => {
  let OriginalURL = req.body.Original_Input;
  if (OriginalURL == "") {
    res.render("shortenURL.pug", {
      error: "Please enter something!"
    });
  }
  let URLO = new URL({ URL: OriginalURL, counter: counter });
  findURL(URLO, req, res).then(counterx => {
    counter = counterx;
  });
});

let findURL = async (URLO, req, res) => {
  let findQuery = { URL: URLO.URL };
  let doc = await URL.findOne(findQuery);

  if (doc) {
    let counterx = URLO.counter;
    let countery = doc.counter;
    app.get("/new/" + countery, (req, res) => {
      let CounterO = new URL({ counter: countery });
      findCounter(CounterO, req, res);
    });

    res.render("shortenURL.pug", {
      exist: "This is an existing shorten URL",
      copyNpaste:
        "Copy and paste the shorten link on your broswer to to visit your original link!",
      shortenURL:
        "Your shorten URL is https://link-shorten-alex.glitch.me/new/" +
        doc.counter
    });

    return await counterx;
  } else {
    URLO.counter = URLO.counter + 1;
    await URLO.save();
    let counterx = URLO.counter;

    app.get("/new/" + counterx, (req, res) => {
      let CounterO = new URL({ counter: counterx });
      findCounter(CounterO, req, res);
    });
    res.render("shortenURL.pug", {
      copyNpaste:
        "Copy and paste the shorten link on your broswer to visit your original link!",
      shortenURL:
        "Your shorten URL is https://link-shorten-alex.glitch.me/new/" +
        counterx
    });
    return await counterx;
  }
};

let findCounter = async (CounterO, req, res) => {
  let findQuery = { counter: CounterO.counter };
  let doc = await URL.findOne(findQuery);
  if (doc) {
    let temp = [];
    temp = doc.URL.split("");
    console.log(temp);

    let i = 0;
    console.log(temp[i]);
    if (temp[i] == "h") {
      console.log(temp[i]);
      i = i + 1;
      if (temp[i] == "t") {
        console.log(temp[i]);
        i = i + 1;
        if (temp[i] == "t") {
          console.log(temp[i]);
          i = i + 1;
          if (temp[i] == "p") {
            console.log(temp[i]);
            i = i + 1;
            if (temp[i] == "s") {
              console.log(temp[i]);
              res.redirect(doc.URL);
            }
          }
        }
      }
    } else res.redirect("https://" + doc.URL);
  }
};

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
