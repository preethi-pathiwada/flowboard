const express = require("express");
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware");
const {createWorkspace, getUserWorkspaces, addMembers} = require("../controllers/workspaceControllers")

router.post("/", authMiddleware, createWorkspace)
router.get("/", authMiddleware, getUserWorkspaces)
router.post("/:workspaceId/addMember", authMiddleware, addMembers)

module.exports = router