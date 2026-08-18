import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config()

const app = express()
const PORT = process.env.PORT ||9000


//default Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(`/api/v1/auth`, authRoute)
app.use(`/api/v1/post`, postRoute)
app.use(`/api/v1/comment`, commentRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})