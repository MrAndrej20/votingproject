import express = require('express');
import { verifyToken, adminLogin, login, register, vote, bodyHas, getPolls, addPoll } from '../actions/index';

const router = express.Router();

router.post('/admin/session',
    bodyHas('username', 'password'),
    adminLogin
);

router.post('/register',
    verifyToken,
    bodyHas('embg', 'password', 'username'),
    register
);

router.post('/login',
    verifyToken,
    bodyHas('embg', 'password'),
    login
);

router.get('/polls',
    verifyToken,
    getPolls
);

router.post('/poll',
    verifyToken,
    bodyHas('pollName', 'subjects'),
    addPoll
);

router.post('/vote',
    verifyToken,
    bodyHas('pollName', 'subjectName', 'embg'),
    vote
);


export = router;
