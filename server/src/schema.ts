import mongoose=require("mongoose");
import uniqueValidator=require("mongoose-unique-validator");
import bcrypt=require("bcrypt");

const maxVotes=1;

const UserSchema=new mongoose.Schema({
    embg:{
        type:String,
        unique:true,
        required:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    voteCount:{
        type:Number,
        required:true
    }
});
const VoteSchema=new mongoose.Schema({
    subjectName:{
        type:String,
        unique:true,
        required:true
    },
    subjectCount:{
        type:Number,
        required:true
    }
});
UserSchema.plugin(uniqueValidator);
VoteSchema.plugin(uniqueValidator);

UserSchema.methods.validVote=function(voteCount){
    return voteCount<maxVotes;
};
UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.passwordHash);
};
UserSchema.virtual("password").set(function(value){
    this.passwordHash = bcrypt.hashSync(value,12);
});

const User=mongoose.model("users",UserSchema),
    Vote=mongoose.model("votes",VoteSchema);
export={
    User,
    Vote
}
