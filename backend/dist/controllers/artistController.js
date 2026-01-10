"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistSearchHandler = artistSearchHandler;
const client_1 = require("@prisma/client");
const setlistfmService_1 = require("../services/setlistfmService");
const prisma = new client_1.PrismaClient();
/**
 * GET /artists/search?q=artistName
 */
async function artistSearchHandler(req, res) {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Query parameter 'q' is required" });
        }
        // Call Setlist.fm API
        const setlistArtists = await (0, setlistfmService_1.searchArtists)(query);
        // Optional: Save artists in DB if not exist
        const savedArtists = await Promise.all(setlistArtists.map(async (a) => {
            const artist = await prisma.artist.upsert({
                where: { setlistFmId: a.mbid || a.id }, // mbid if available, fallback to id
                update: {},
                create: {
                    name: a.name,
                    setlistFmId: a.mbid || a.id,
                },
            });
            return artist;
        }));
        res.json(savedArtists);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
/*
Uses Prisma upsert → avoids duplicates

Returns saved artists from DB

Handles missing query params

Fully typed with Request and Response
*/ 
