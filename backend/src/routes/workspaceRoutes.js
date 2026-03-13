const express = require("express");
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware");
const {createWorkspace, getUserWorkspaces} = require("../controllers/workspaceControllers")

router.post("/", authMiddleware, createWorkspace)
router.get("/", authMiddleware, getUserWorkspaces)

module.exports = router