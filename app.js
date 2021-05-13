const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const port = 80;
const https = require('https');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.listen(port, function() {
console.log("Server is up and running on port 3000");
});

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.eMail;
  const data = {
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  }
    const jsonData = JSON.stringify(data);
    // mailchimp API key
    // 8477f7fa70a72529f9f322edbb32cffd-us1

    // Mail Chimp List id
    // 57dff4548d

    // To post the data to exteral request
    const url="https://us1.api.mailchimp.com/3.0/lists/57dff4548d";
    const options= {
      method:"post",
      auth:"yuvaraj:8477f7fa70a72529f9f322edbb32cffd-us1"
    }
    const request=https.request(url, options, function(response){
      response.on("data", function(data){

        if (response.statusCode === 200){
          res.sendFile(__dirname+"/success.html");
        }
        else{
          res.sendFile(__dirname+"/failure.html");
        }
        //console.log(JSON.parse(data));// jQuery pluginName Plugin
      });
    })
      request.write(jsonData);
      request.end();
      //to redirect user to singnup page on failure
      app.post("/failure",function(req,res){
        res.redirect("/");
      })


});
