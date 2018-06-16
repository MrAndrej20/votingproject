import express=require("express");
import action=require("../actions/index");
import path=require("path");
const router=express.Router();
router.get("/",action.verifyToken,(req,res)=>{
    res.sendFile(path.join(__dirname+"/../../userinterface/index.html"));
});
router.get("/vote",action.verifyToken,(req,res)=>{
    res.sendFile(path.join(__dirname+"/../../userinterface/vote.html"));
});
router.post("/register",action.verifyToken,action.register);
router.post("/login",action.verifyToken,action.login);
router.post("/vote",action.verifyToken,action.vote);
router.all("*",(req,res)=>{
    res.redirect("/");
})
export=router;
