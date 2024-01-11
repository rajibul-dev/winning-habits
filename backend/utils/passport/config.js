import googleOuth from "passport-google-oauth";
import User from "../../models/UserModel.js";
const GoogleStrategy = googleOuth.OAuth2Strategy;

export default function (passport) {
  passport.use(
    // credentials
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
      },

      // google's middleware function
      async function (accessToken, refreshToken, profile, done) {
        // can add picture too but won't in this app
        const { sub: id, name, email, email_verified } = profile._json;

        // make admin by default if first account
        const isFirstAccount = (await User.countDocuments({})) === 0;
        const role = isFirstAccount ? "admin" : "user";

        const newUser = {
          name,
          email,
          isVerified: email_verified,
          role,
          googleID: id,
          authMethod: "google",
        };

        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);

        try {
          // already exist?
          let user = await User.findOne({ googleID: id });

          // don't create copy, use existing one
          if (user) {
            done(null, user);
          } else {
            // create in the database
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.error(error);
        }
      },
    ),
  );

  passport.serializeUser(function (user, done) {
    process.nextTick(function () {
      return done(null, {
        id: user.id,
        username: user.username,
        picture: user.picture,
      });
    });
  });

  passport.deserializeUser(function (user, done) {
    process.nextTick(function () {
      return done(null, user);
    });
  });
}
