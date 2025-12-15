import crypto from "crypto";
import { upsertShareSig, findShareByUserId, getFavoritesByUserId } from "../models/favoriteShareModel.js";

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:5173";
const SHARE_SECRET = process.env.FAVORITES_SHARE_SECRET;

function makeSig(userId) {
  return crypto
    .createHmac("sha256", SHARE_SECRET)
    .update(String(userId))
    .digest("hex");
}

const FavoriteShareController = {
  createShareLink: async (req, res) => {
    const userId = req.userId;
    const sig = makeSig(userId);

    await upsertShareSig(userId, sig);

    const url = `${FRONTEND_BASE_URL}/favorites/${userId}?sig=${sig}`;
    res.json({ share_url: url, user_id: userId });
  },

  getSharedFavorites: async (req, res) => {
    const userId = Number(req.params.userId);
    const sig = String(req.query.sig || "");

    if (!userId || !sig) return res.status(400).json({ msg: "Missing userId or sig" });

    const row = await findShareByUserId(userId);
    if (!row) return res.status(404).json({ msg: "Share not found" });

    if (row.share_sig !== sig) return res.status(403).json({ msg: "Invalid signature" });

    const favorites = await getFavoritesByUserId(userId);
    res.json(favorites);
  },
};

export default FavoriteShareController;
