require("dotenv").config()
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes")
const workspaceRoutes = require("./src/routes/workspaceRoutes")
const projectRoutes = require("./src/routes/projectRoutes")

const app = express()

app.use(express.json())
app.use(cors())
app.use("/auth", authRoutes);
app.use("/workspaces", workspaceRoutes)
app.use("/:workspaceId", projectRoutes)


app.listen(process.env.PORT, () => {
    console.log("Server is running")
})