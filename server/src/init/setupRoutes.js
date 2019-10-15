const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require("cheerio");

module.exports = (app, staticPath, log) => {
  log.debug(`Serving static files from ${staticPath}`);
  app.use(express.static(staticPath, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
  }));

  app.use('/*', (req, res) => {
    const html = fs.readFileSync(path.resolve(staticPath, './index.html'));
    const $ = cheerio.load(html);
    const initState = JSON.stringify({
      user: req.user ? {
        name: req.user.name,
        username: req.user.username
      } : undefined
    });
    const script = `<script id="initState" type="text/plain">${initState}</script>`;
    $("head").append(script);
    res.send($.html());
  });
};
