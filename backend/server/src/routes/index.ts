import express = require("express");
import { verifyToken, adminLogin, login, register, vote, bodyHas, polls } from "../actions/index";

const router = express.Router();

router.post("/admin/session",
    bodyHas("username", "password"),
    adminLogin
);

router.post("/login",
    // verifyToken,
    bodyHas("embg", "password"),
    login
);

router.get("/polls",
    // verifyToken,
    polls
);

router.post("/register",
    // verifyToken,
    bodyHas("embg", "password", "username"),// needs username aswell for frontend
    register
);

router.post("/vote",
    // verifyToken,
    bodyHas("pollName", "subjectName"),
    vote
);

export = router;
