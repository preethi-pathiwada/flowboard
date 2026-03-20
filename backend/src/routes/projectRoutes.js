const express = require("express")
const router = express.Router({mergeParams:true})
const authMiddleware = require("../middleware/authMiddleware")
const {createProject, getProjectsByWorkspace} = require("../controllers/projectControllers")

router.post("/projects", authMiddleware, createProject)
router.get("/projects", authMiddleware, getProjectsByWorkspace)

module.exports = router
