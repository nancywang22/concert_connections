"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artistController_1 = require("../controllers/artistController");
const router = (0, express_1.Router)();
// GET /artists/search?q=Coldplay
router.get("/search", artistController_1.artistSearchHandler);
exports.default = router;
