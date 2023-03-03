const express = require('express')
const User = require('./User')
const Favorites = require('./Favorites');

Favorites.belongsTo(User);
User.hasMany(Favorites);

module.exports = { User, Favorites };