'use strict';
var router = require('express').Router();
var fs = require('fs');
var path = require('path');
var request = require('request');
var moment = require('moment');
var posts = require('../services/posts');
var projects = require('../services/projects')

function getGuilds() {
  return 72;
  // request('http://amas.us.to:8888/wintermute', (err, res, body) => {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   return JSON.parse(body).guilds;
  // })
}

var guilds = getGuilds();

var minutes = 30;
var interval = minutes * 60 * 1000;
setInterval(getGuilds, interval);

// var flatposts = posts.all.reverse().slice(0, 5); // display a maximum of 5 posts on homepage

router.get('/', (req, res, next) => {
  var len = posts.all.length;
  var latest = posts.all[len - 1];
  res.render(latest.view, {
    post: latest,
    cur: latest.number,
    prev: +latest.number - 1,
    next: +latest.number + 1,
    total: posts.all.length
  });
});

router.get('/wintermute', (req, res, next) => {
  res.render('projects/wintermute/view', {
    guilds: guilds
  });
})

router.get('/about', (req, res, next) => {
  res.render('about');
})

router.get('/posts', (req, res, next) => {
  res.render('archive', {
    posts: posts.all,
    title: "Archive"
  })
})

router.get('/projects', (req, res, next) => {
  res.render('posts', {
    posts: projects.all,
    title: "Projects"
  })
})

posts.all.forEach(post => {
  var route = '/posts/' + post.number;
  router.get(route, (req, res, next) => {
    res.render('posts/' + post.number, {
      post: post,
      cur: post.number,
      prev: +post.number - 1,
      next: +post.number + 1,
      total: posts.all.length
    })
  })
})

projects.all.forEach(post => {
  var route = 'projects/' + post.location;
  router.get('/' + route, (req, res, next) => {
    res.render(route + '/view', {
      guilds: guilds
    })
  })
})

module.exports = router;