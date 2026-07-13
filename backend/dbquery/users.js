const {connectDatabase}=require("../db/mysql")

const getUserByEmail=async (email)=>{
    try{
        const pool = await connectDatabase();
        const [rows]=await pool.query("SELECT id,first_name,last_name,email,password FROM users WHERE email = ?", [email])
        return rows[0]
    }catch(error){
        throw new Error(error.message)
    }
}

const getUserById=async (id)=>{
    try{
        const pool = await connectDatabase();
        const [rows]=await pool.query("SELECT id,first_name,last_name,email FROM users WHERE id = ?", [id])
        return rows[0]
    }catch(error){
        throw new Error(error.message)
    }
}

const createUserQuery=async (id,first_name,last_name,email,password)=>{
    try{
        const pool = await connectDatabase();
        await pool.query("INSERT INTO users (id,first_name,last_name,email,password) VALUES (?,?,?,?,?)", [id,first_name,last_name,email,password])
        return {
            success:true,
            id
        }
    }catch(error){
        return {
            success:false,
            error:error.message
        }
    }
}

const updatePasswordQuery=async (email,password)=>{
    try{
        const pool = await connectDatabase();
        await pool.query("UPDATE users SET password = ? WHERE email = ?", [password,email])
        return {
            success:true
        }
    }catch(error){
        return {
            success:false,
            error:error.message
        }
    }
}
module.exports={getUserByEmail,getUserById,createUserQuery,updatePasswordQuery}