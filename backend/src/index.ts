const PORT = 5000;
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import connectDB from "./config/connectDB";
import authRoutes from "./routes/auth.route";
import categoryRoutes from "./routes/category.route";
import requestRoutes from "./routes/request.route";
import "./config/passport";

dotenv.config();

const app = express();
connectDB();
// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env");
}
console.log("mongoURI: ", process.env.MONGO_URI)

// Session middleware (needed if using Passport sessions)
app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      secure: false, // set true if using https
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/requests", requestRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
