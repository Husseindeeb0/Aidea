const PORT = 5000;
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import connectDB from "./config/connectDB";
// import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import categoryRoutes from "./routes/category.route";
import "./config/passport";

dotenv.config();

const app = express();


// Session middleware (needed if using Passport sessions)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);


// Middlewares
app.use(cors(corsOptions));
// app.use(cookieParser());
app.use(express.json());

app.listen(PORT, "0.0.0.0", () => {
  connectDB(), console.log(`Server started on port ${PORT}`);
});
