var mongoose = require('mongoose');
var connect = require("../dbConnect.js");
connect(require("../settings").DEV_DB_URI);
var User = require("../models/User.js");
var LocationBlog = require("../models/LocationBlog.js");
var Position = require("../models/Position.js");

async function addUser(first,last,user,pw,e)
{
var newuser = {firstName: first, lastName: last, userName: user, password: pw, email: e}

await User.insertOne(newuser);
}; 


async function getAllUsers(){

    var result = {}
    result.users = await User.find({});
    return result;
}

async function findByUserName(userName){
    var result = {}

    result.users = await User.findOne({userName});

    return result;

}
async function findById(id){
    var result = {}

    result.users = await User.findOne({_id: id});

    return result;
}

module.exports = {addUser,getAllUsers,findByUserName,findById}