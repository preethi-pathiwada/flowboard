const pool = require("../config/db")

exports.createWorkspace = async (req, res) => {
    const {name} = req.body
    const userId = req.user.id 

    try{
        const isAvailable = await pool.query(
            `SELECT * FROM workspaces where workspaces.name = $1 and workspaces.owner_id = $2`,
            [name, userId]   
        )
        if (isAvailable.rows.length === 0){
            const workspace = await pool.query(
            `INSERT INTO workspaces(name, owner_id) VALUES($1, $2) RETURNING *`, [name, userId]
        )
        await pool.query(
            `INSERT INTO workspace_members(workspace_id, user_id, role) VALUES($1, $2, $3) RETURNING *`,
            [workspace.rows[0].id, userId, "owner"]
        )
        res.status(200).send(workspace.rows[0])
        }
        else{
            res.json({message:"Workspace with the same owner already exists"})   
        }
        
    }
    catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}

exports.getUserWorkspaces = async (req, res) => {
    const userId = req.user.id
   try{
     const userWorkspaces = await pool.query(
        `SELECT * from workspaces`
    )
    res.send(userWorkspaces.rows)
   }
   catch(err){
    res.send("Server Error")
   }
}

exports.addMembers = async (req, res) => {
    const {workspaceId} = req.params
    const {email} = req.body

    try{
        const getUserId = await pool.query(`
            SELECT id from users WHERE users.email = $1`, [email]
        )
        if (getUserId.rows.length===0){
            return res.status(404).json({message:"User Not Found"})
        }
        else{
            const isMemberExist = await pool.query(`
                    SELECT * FROM workspace_members WHERE user_id = $1 and workspace_id = $2
                `, [getUserId.rows[0].id, workspaceId])

            if (isMemberExist.rows.length===0){
                await pool.query(`
                        INSERT INTO workspace_members(workspace_id, user_id, role) 
                        VALUES($1, $2, $3) RETURNING *
                    `,[workspaceId,getUserId.rows[0].id, "member" ])
                return res.status(201).json({message:"Member added"})
            }
            else{
                return res.status(400).json({message:"Member already exists"})
            }
        }
        
    }
    catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}

