import express = require("express");
import { verifyToken, login, register, vote, bodyHas } from "../actions/index";
import path = require("path");
import _ = require("lodash");
import { format } from "util";

const router = express.Router();

router.post("/admin/session",
    bodyHas("username", "password"),
    verifyToken,
    login
);

router.post("/login",
    bodyHas("embg", "password"),
    verifyToken,
    login
);

router.get("/polls",
    verifyToken,
    //function to list all polls
    // json object with all polls in format
    //     { "poll1":[],
    //       "poll2":[]
    //      }
);

router.post("/register",
    bodyHas("embg", "password"),// needs username aswell for frontend
    verifyToken,
    register
);

router.post("/vote",
    bodyHas("brand"),
    verifyToken,
    vote
);

router.all("*", (req, res, next) => {
    console.log("************************************************************");
    console.log("Redirectng from", req.url, "to /");
    console.log("Client IP:", _.last(req.connection.remoteAddress.split(":")));
    return next()
}, verifyToken);

export = router;
