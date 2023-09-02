"use strict"

var mountRedraw = require("../mount/mount")

module.exports = require("./route")(typeof window !== "undefined" ? window : null, mountRedraw)