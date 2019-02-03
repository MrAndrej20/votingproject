import { Entropy } from 'entropy-string';
export = {
    maxVotes: 1,
    port: 3000,
    mongodbEndpoint: 'mongodb://127.0.0.1:27017/polldb',
    JWTsecret: new Entropy().string(80),
    mysql: {
        url: 'mysql://root:root12345@localhost:3306/VotingProjectDB',
        connections: { min: 1, max: 4 }
    }
};
