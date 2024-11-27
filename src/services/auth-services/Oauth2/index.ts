import passport from 'passport';
import { Strategy } from 'passport-google-oauth2'
import * as User from '../../users-services';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (user: any, done) => {
    const foundUser = await User.findUserByEmail(user.email);
    return foundUser ? done(null, foundUser) : done(null, null);
});

export default passport.use(
    new Strategy(
        {
            clientID: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
            callbackURL: process.env.REDIRECT_URL as string,
            scope: ['email', 'profile']
        }, async (_accessToken, _refreshToken, profile, done) => {
            try {
                const userExists = await User.findUserByEmail(profile.email);
                if (userExists) {
                    return done(null, userExists);
                }
                const newUser = await User.createGoogleUser({
                    email: profile.email,
                    fullName: profile.displayName,
                    profile_url: profile.picture
                });
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);