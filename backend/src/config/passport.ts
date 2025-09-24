import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import User, { IUser } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: false,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        let user: IUser | null = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value || "",
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value || "",
          });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

// Serialize & deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id as string);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user: IUser | null = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;