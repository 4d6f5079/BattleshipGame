var express = require('express');
var router = express.Router();

router.get('/place-ships', function(req, res) {
  res.sendFile('shipplacement.html', { root: './public' });
});

router.get('/waiting-page', function(req, res) {
  res.sendFile('waitingpage.html', { root: './public' });
});

/* Pressing the 'START GAME' button, returns game page */
router.get('/play', function(req, res) {
  res.sendFile('game.html', { root: './public' }); 
});

// TODO:Pressing 'START' in the game page must start the game and lets the user click on the cells of the grid

module.exports = router;
