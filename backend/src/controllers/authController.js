const pool = require("../config/db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



exports.registerUser = async (req, res) => {
    const {name, email, password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
         const userExists = await pool.query("SELECT * FROM users where email = $1", [email])
    if(userExists.rows.length>0){
        res.status(409).send("Duplicate Entry")
    }
    else{
        const createUser = await pool.query("INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *", [name, email, hashedPassword])
        res.status(201).json({
            message:"User created successfully",
            user:createUser.rows[0]
        })
    }
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

exports.loginUser = async (req, res) => {
    const {email, password} = req.body
    try{
        const getUser = await pool.query("SELECT * FROM users where email=$1", [email])
    if (getUser.rows.length===0){
        res.status(400).json({message:"User Not Found"})
    }
    const isValidPassword = await bcrypt.compare(password, getUser.rows[0].password)
    if (!isValidPassword){
        res.status(400).json({message:"Invalid Password"})
    }
    const payload = {id:getUser.rows[0].id}
    const jwtToken = jwt.sign(payload,process.env.JWT_SECRET_TOKEN, {expiresIn:"15m"})
    res.status(201).json({jwtToken})
    }
    catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}

