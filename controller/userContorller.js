import userAuth from "../model/userModel.js"

export const setUser = async (req,res,next)=> {
    const {email} = req.body;
    const userDetails = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        file: req.file.filename
    }
    const user = new userAuth(userDetails);
    try {
        const searchUser = await userAuth.findOne({email: email});
        if (searchUser) {
            res.status(200).json({"message": "User Exists"})
        }
        else {
            const addUser = user.save()
            res.status(200).json({"message": "Registration Successfully"});
        }
    } catch(err) {
        next(err);
    }
}

export const getUser = async (req,res,next) => {
    const {email, password} = req.body;
    try {
        const searchUser = await userAuth.findOne({email: email})
        if (searchUser) {
            if (searchUser.password === password) {
                res.status(200).json(searchUser);
            }
            else {
                res.status(200).json({"message": "Password is wrong"});
            }
        } else {
            res.status(200).json({"message": "User not found"})
        }

    }  catch(err) {
        next(err);
    }
}

export const findAllUser = async(req,res,next) => {
    const {name} = req.body;
    try {
        const findUser = await userAuth.find({name: name})
        res.status(200).json(findUser);
    } catch(err) {
        next(err);
    }
}

export const findAllUserById = async(req,res,next) => {
    const {id} = req.body;
    try {
        const findUser = await userAuth.find({_id: id})
        res.status(200).json(findUser);
    } catch(err) {
        next(err);
    }
}