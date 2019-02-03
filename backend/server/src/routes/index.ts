import express = require('express');
import { verifyToken, login, register, vote, bodyHas, getPolls, addPoll } from '../actions/index';

const router = express.Router();

router.post('/register',
    bodyHas('embg', 'password', 'username'),
    register
);

router.post('/login',
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
    bodyHas('pollName', 'subjectName'),
    vote
);


export = router;
