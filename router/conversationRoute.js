import express from "express";
import {getConversation,setConversation,retriveConversation} from "../controller/conversationController.js";

const router = express.Router();
router.post('/all',getConversation)
router.post('/create',setConversation)
router.post('/personal',retriveConversation)

export default router;


