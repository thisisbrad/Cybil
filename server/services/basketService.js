// import { Promise } from 'mongoose';
const Promise = require('bluebird');

let client = null;

// add to basket
async function add(itemId, userId) {
  // debugger;
  return new Promise((resolve, reject) => {
    // Check to see if item is in user's basket already
    client.hget(`basket: ${userId}`, itemId, (err, item) => {
      if (err) return reject(err);
      // If there is no item add one to the basket
      if (!item) {
        return client.hset(`basket: ${userId}`, itemId, 1, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        });
      }
      return client.hincrby(`basket: ${userId}`, itemId, 1, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  });
}

// getAll items in basket
async function getAll(userId) {
  // Get all the items in a users basket
  return new Promise((resolve, reject) => {
    // Grab all items in the basket
    client.hgetall(`basket: ${userId}`, (err, basket) => {
      if (err) return reject(err);
      return resolve(basket);
    });
  });
}

// remove from basket
async function remove(itemId, userId) {
  return new Promise((resolve, reject) => {
    // Select item to remove form basket
    client.hdel(`basket: ${userId}`, itemId, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

module.exports = _client => {
  if (!_client) throw new Error('Chould not get Redis Client');
  client = _client;

  return {
    add,
    getAll,
    remove
  };
};
