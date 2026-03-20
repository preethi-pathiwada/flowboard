const pool = require("../config/db")

exports.createProject = async (req, res) => {
    const userId = req.user.id
    try{
        const {workspaceId} = req.params
        const {name, description} = req.body

        const isUserPartOfWorkspace = await pool.query(`
                SELECT * FROM workspace_members 
                WHERE user_id = $1 and workspace_id = $2
            `, [userId, workspaceId])
        const isProjectAlreadyExist = await pool.query(`
            SELECT * FROM projects WHERE LOWER(project_name) = LOWER($1) AND workspace_id = $2
            `, [name, workspaceId])
        
        if (isUserPartOfWorkspace.rows.length===0){
            return res.status(401).send("User is not a part of the current workspace")
        }
        // else{
        //     return res.send(isProjectAlreadyExist.rows.length>0)
        // }
        else if (isProjectAlreadyExist.rows.length>0){
            return res.status(401).json({message:"Project with the same name already exist"})
        }
        else{
            const createTheProject = await pool.query(`
                    INSERT INTO projects(workspace_id, project_name, description)
                    VALUES($1, $2, $3) RETURNING *
                `, [workspaceId, name, description])
            return res.send(createTheProject.rows[0])
        }
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error"})
    }

}

exports.getProjectsByWorkspace = async (req, res) => {
    try{
        const {workspaceId} = req.params
        console.log(workspaceId)
        const getQuery = await pool.query(`
                SELECT * FROM projects WHERE workspace_id = $1
            `, [workspaceId])
        return res.status(200).send(getQuery.rows)
    }
    catch(err){
        console.log(error)
        return res.send(500).send("Server Error")
    }
}