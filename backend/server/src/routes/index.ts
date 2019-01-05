import express = require('express');
import { verifyToken, adminLogin, login, register, vote, bodyHas, polls, addPoll } from '../actions/index';

const router = express.Router();

router.post('/admin/session',
    bodyHas('username', 'password'),
    adminLogin
);

router.post('/login',
    verifyToken,
    bodyHas('embg', 'password'),
    login
);

router.get('/polls',
    verifyToken,
    polls
);

router.post('/register',
    verifyToken,
    bodyHas('embg', 'password', 'username'),
    register
);

router.post('/vote',
    verifyToken,
    bodyHas('pollName', 'subjectName', 'embg'),
    vote
);

router.post('/poll',
    verifyToken,
    bodyHas('pollName', 'subjects'),
    addPoll
);

export = router;
