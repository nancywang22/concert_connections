"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchArtists = searchArtists;
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BASE_URL = "https://api.setlist.fm/rest/1.0";
const API_KEY = process.env.SETLISTFM_API_KEY;
const headers = {
    Accept: "application/json",
    "x-api-key": API_KEY,
};
/**
 * Search artists by name using Setlist.fm API
 * @param name - artist name
 * @returns array of artist objects from Setlist.fm
 */
async function searchArtists(name) {
    const url = `${BASE_URL}/search/artists?artistName=${encodeURIComponent(name)}&p=1`;
    const res = await (0, node_fetch_1.default)(url, { headers });
    if (!res.ok) {
        throw new Error(`Setlist.fm API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    // Setlist.fm API returns an object with `artist` array
    return data.artist || [];
}
/*Fetches artist data

Throws error if API fails

Returns array of artist objects*/ 
