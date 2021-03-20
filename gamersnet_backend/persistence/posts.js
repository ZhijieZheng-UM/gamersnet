'use strict';

const { ObjectID } = require('bson');
let MongoDB = require('./mongodb');
let ObjectId = require('mongodb').ObjectID;

async function getPost(_id) {
  // connect wait for server to connect to db
  let db = await MongoDB.open();

  // once it connected, get the "posts" collection (aka a table in SQL)
  let posts = db.collection('posts');

  // wait for the server to find the specified post
  let result = await posts.find({ _id : new ObjectID(_id)});
  return result.toArray();
}

async function getAllPosts() {
  // connect wait for server to connect to db
  let db = await MongoDB.open();

  // once it connected, get the "posts" collection (aka a table in SQL)
  let posts = db.collection('posts');

  // wait for the server to find all posts and return as an array
  let result = await posts.find({});
  return result.toArray();
}

//assuming posts expire if the gametime is older than current time
//so get posts for games scheduled today or in future
async function getValidPosts() {
    let db = await MongoDB.open();
    let posts = db.collection('posts');
    
    let result = await posts.find({ gameTimeUTC: {$gte: new Date()}});

    return result.toArray();
}


/**
 * Adds a post to the db
 * All parameters should be string type to be consistent and avoid confusion
 * @param {*} userId userId of the owner of this post
 * @param {*} description 
 * @param {*} gameName 
 * @param {*} numPlayers 
 * @param {*} gameTimeUTC when it will be played
 * @param {*} duration how long will it be played
 * @param {*} location location of game
 */
async function addPost(userID, description, gameName, numPlayers, gameTimeUTC, duration, location) {
  // wait for db connection and get users collection
  let db = await MongoDB.open();

  let posts = db.collection('posts');

  return await posts.insertOne({
    userID: userID,// intended to link to existing users in db
    description: description,
    gameName: gameName,
    numPlayers: numPlayers, //null in case of incorrect format
    gameTimeUTC: gameTimeUTC, 
    duration: duration,
    location: location
  })
}

/**
 * updates the specified post(by post id)
 * All parameters should be string type to be consistent and avoid confusion
 * @param {*} userID userId of the owner of this post
 * @param {*} description 
 * @param {*} gameName 
 * @param {*} numPlayers 
 * @param {*} gameTimeUTC when it will be played
 * @param {*} duration how long will it be played
 * @param {*} location location of game
 */
 async function updatePostDB(_id, description, gameName, numPlayers, gameTimeUTC, duration, location) {
  // wait for db connection and get users collection
  let db = await MongoDB.open();

  let posts = db.collection('posts');
 
  var updateValues = {
    $set: {
      description: description,
      gameName: gameName,
      numPlayers: numPlayers, //null in case of incorrect format
      gameTimeUTC: gameTimeUTC, 
      duration: duration,
      location: location
    }
  }
  console.log("updating db...")

  let updated = await posts.updateOne({ _id: new ObjectID(_id)}, updateValues)

  console.log("Update operation complete.")
  return updated
}
// make these two functions "public" to the rest of the project
module.exports = { getPost, getAllPosts, addPost, getValidPosts, updatePostDB};
