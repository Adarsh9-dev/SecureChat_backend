import conversation from "../model/conversation.js";

export const getConversation = async (req,res,next) => {
    const {senderId} = req.body;
    try {
        var uniqueUser = [];
        var uniqueUserData = [];
        const receverData = await conversation.find({$or: [{senderId: senderId},{receverId: senderId}]});
        receverData.map((index)=> {

            let uId ;
            if (index.receverId !==  senderId) {
                uId = index.receverId;
            }
            if (index.senderId !== senderId) {
                uId = index.senderId;
            }

            if(!uniqueUser.includes(uId)) {
                uniqueUser.unshift(uId)
                uniqueUserData.unshift(index);
            } else {
                const indexNo = uniqueUser.indexOf(uId)
                uniqueUser.splice(indexNo,1)
                uniqueUserData.splice(indexNo,1);
                uniqueUser.unshift(uId)
                uniqueUserData.unshift(index);
            }
        })
        res.status(200).json({"uData":uniqueUserData,"uInfo":uniqueUser});
       
    } catch(err) {
        next(err)
    }
}

export const setConversation = async (req,res,next) => {
    const allConv = new conversation(req.body)
    try {
        await allConv.save()
        res.status(200).json({"message": "Conversation Created"})
    } catch(err) {
        next(err);
    }
}

export const retriveConversation = async (req,res,next) => {
    const {uId,pId} = req.body;
    try {
        const receveConv = await conversation.find({
            $or: [
                {$and: [{senderId: uId},{receverId: pId}]},
                {$and: [{senderId: pId},{receverId: uId}]}
            ]
        })
        res.status(200).json(receveConv);
    } catch(err) {
        next(err);
    }
}