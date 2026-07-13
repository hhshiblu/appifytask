const { loginService, createUserService,forgotPasswordService ,changePasswordService} = require("../services/users")

const { getUserById } = require("../dbquery/users")

const getUser=async (req,res,_next)=>{
    try{
        const user = await getUserById(req.user.id)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        console.log("user", user);
        res.status(200).json({
            success: true,
            data: user,
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to get user",
        });
    }
}

const loginUser=async (req,res,_next)=>{
    try{
        const {email,password,remember_me}=req.body
        const rememberMe = remember_me === true || remember_me === 'true'
        const result=await loginService(email,password,rememberMe)
        
        const maxAge = rememberMe
            ? 7 * 24 * 60 * 60 * 1000
            : 24 * 60 * 60 * 1000

        res.cookie("token", result.token, {
            httpOnly: process.env.NODE_ENV === "production" ? true : false,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge,
        });

        res.status(200).json({
            success: true,
            data: result,
        });

    }catch(error){
        res.status(401).json({
            success: false,
            message: error.message || "Failed to login user",
        });
    }
}

const createUser=async (req,res,_next)=>{
    try{
        const {first_name,last_name,email,password}=req.body
        const result=await createUserService(first_name,last_name,email,password)
        
        //cookie save
        res.cookie("token", result.token, {
            httpOnly: process.env.NODE_ENV === "production" ? true : false,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create user",
        });
    }
}

const forgotPassword=async(_req,res,_next)=>{
    try{
        const {email}=_req.body
        const result=await forgotPasswordService(email)
        res.status(200).json({
            success: true,
            data: result,
        });
    }catch(error){
        res.status(404).json({
            success: false,
            message: error.message || "Failed to forgot password",
        });
    }
}

const changePassword=async(_req,res,_next)=>{
    try{
        const {email,newPassword}=_req.body
        const result=await changePasswordService(email,newPassword)
        
        //cookie clear
        res.clearCookie("token")
        
        res.status(200).json({
            success: true,
            data: result,
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message || "Failed to change password",
        });
    }
}

const logoutUser=async(_req,res)=>{
    res.clearCookie("token", {
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });
    res.status(200).json({ success: true, message: "Logged out" });
}

module.exports={getUser,loginUser,createUser,forgotPassword,changePassword,logoutUser}