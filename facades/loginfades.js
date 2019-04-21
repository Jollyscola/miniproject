var connect = require("../dbConnect.js");
connect(require("../settings").DEV_DB_URI);
var mongoose = require('mongoose');
var User = require("../models/User");
var Position = require("../models/Position");
//var LocationBlog = require("../models/LocationBlog");

async function  login(username,password,longitude,latitude,distance) {
    const user = await User.findOne({userName: username, password: password});
    
    result={}
    if(user == null){
        console.log("no user")
        result.msg="wrong username or password";
        result.status=403;
    }
    else
    {
        console.log("user was found", user._id);

       await Position.findOneAndUpdate(
         {user: user._id},
         {loc:{ coordinates: [longitude, latitude] },user:user._id},{upsert: true,
            new:false, overwrite: true})

        result.friends = await Position.find(
            {
              loc:
                { 
                  $near:
                   {
                     $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
                     $minDistance: 0,                    
                     $maxDistance: distance
                   }
                }
            }
         )
    
    }
    console.log("result:", result);
    return result;
}

module.exports = {login}

