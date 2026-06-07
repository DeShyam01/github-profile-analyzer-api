const express = require("express");

const router = express.Router();

const {getUser, getProfiles, getProfile} = require("../controller/githubController");

router.post("/analyze/:username", getUser);

router.get("/profiles/", getProfiles);

router.get("/profiles/:username", getProfile);

module.exports = router;