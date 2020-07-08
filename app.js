const express = require("express");
const bodyParser = require("body-parser");
const bent = require("bent");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data)

  const url = "https://us10.api.mailchimp.com/3.0/lists/ba66499342";
  const options = {
    method: "POST",
    auth: "sofiya1:c222403fc008a53b047de8d1634863a5-us10"
  }

const request =  https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })
request.write(jsonData)
request.end()

});

app.post("/failure", function (req, res) {
  res.redirect("/");
})

// list_id
// ba66499342

// my API key
// c222403fc008a53b047de8d1634863a5-us10


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
