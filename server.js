const express = require("express");
const app = express();
const bodyParser = require("body-parser");

var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

//basic routing
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//api endpoint
app.get("/api/hello", (req, res) => {
  res.json({ greeting: "Hello API" });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// store response object
let responseObject = {};

app.get("/api/timestamp/:input", (req, res) => {
  let input = req.params.input;

  //check the input and convert it
  if (input.includes(" ") || input.includes("-")) {
    responseObject["unix"] = new Date(input).getTime();
    responseObject["utc"] = new Date(input).toUTCString();
  } else {
    input = parseInt(input);
    responseObject["unix"] = new Date(input).getTime();
    responseObject["utc"] = new Date(input).toUTCString();
  }

  // error message for invalid date
  if (!responseObject["utc"] || !responseObject["unix"]) {
    res.json({ error: "Invalid Date" });
  }

  res.json(responseObject);
});

app.get("/api/timestamp", (req, res) => {
  responseObject["unix"] = new Date().getTime();
  responseObject["utc"] = new Date().toUTCString();
  res.json(responseObject);
});

app.post(
  "/api/timestampform",
  bodyParser.urlencoded({ extended: false }),
  (request, response) => {
    let input = request.body.input;
    let getUrl = "/api/timestamp/" + input;

    response.redirect(getUrl);
  }
);
