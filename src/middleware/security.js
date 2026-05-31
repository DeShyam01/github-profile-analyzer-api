const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const limiter = rateLimit({
    windowMs: 10*60*1000,
    max: 100,
    message: {error: "Too many requests from this Ip, please try again after 10 minutes late."}
});

const securityHeaders = helmet({
    crossOriginResourcePolicy: {policy: "cross-origin"}
});

module.exports = {limiter, securityHeaders};