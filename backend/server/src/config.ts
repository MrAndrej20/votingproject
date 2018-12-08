import { Entropy } from "entropy-string";
export = {
    maxVotes: 1,
    port: 3000,
    mongodbEndpoint: "mongodb://127.0.0.1:27017/votedb",
    JWTsecret: new Entropy().string(80)
}