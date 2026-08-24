const express = require('express');
const router = express.Router();
const peerSupportService = require('../services/peerSupportService');
const authenticateJWT = require('../utilities/authenticateJWT');
const asyncHandler = require('../utilities/asyncHandler');

router.get('/peer-support/users', authenticateJWT, asyncHandler(async (req, res) => {
  const matchedPeers = await peerSupportService.getPeerSupportUsers(req.user._id, req.query);
  res.status(200).json({ users: matchedPeers });
}));

module.exports = router;
