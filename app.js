require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
//to define 
//const port = process.env.PORT;
const https = require('https');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.listen(process.env.PORT, function() {
console.log("Server is up and running");
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

    // Mail Chimp List id
   

    // To post the data to exteral request
    const url="https://us1.api.mailchimp.com/3.0/lists/${process.env.mailChimpUID}";
    const options= {
      method:"post",
      auth:process.env.mailChimpAuthKey
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
