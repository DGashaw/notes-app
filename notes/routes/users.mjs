import path from 'node:path';
import * as util from 'util';
import { default as DEBUG } from 'debug';
import { default as express } from 'express';
import { default as passport } from 'passport';
import { default as passportLocal } from 'passport-local';
import  GoogleStrategy from "passport-google-oidc";

import * as usersModel from "../models/users-superagent.mjs";
import { sessionCookieName } from "../app.mjs";

const LocalStrategy = passportLocal.Strategy;
const router = express.Router(); 

import { create } from "../models/users-superagent.mjs";

const debug = DEBUG('notes:users-router');
const debugError = DEBUG('notes:error-users-route');

export let googleLogin;

export function initPassport(app){
    app.use(passport.initialize());
    app.use(passport.session());
}

export function ensureAuthenticated(request, response, next){
    try{
        if(request.user){ next(); }
        else { response.redirect(303, '/users/login'); }
    }
    catch(error){
        next(error);
    }
}

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try{
            const check = await usersModel.userPasswordCheck(username, password);
            debug(check);

            if(check["password-check"]){
                done(null, { id: check.username, username: check.username });
            }
            else{
                done(null, false, check.message);
            }
        }
        catch(error){
            done(error);
        }
    }
));
//Under development
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: 'http://localhost:3001/users/oauth2/redirect/google',
    scope: [ 'profile', 'email' ]
},
async function verify(issuer, profile, done){
    try{
        //Constucting a unique username if the profile is missing username property
        const username = profile.username ? profile.username : `${profile.displayName.replace(" ", "_")}_${profile.id}` ;
        
        const {password, givenName, middleName, familyName, email} = {username: "", 
            givenName: profile.name.givenName, middleName: "", 
            familyName: profile.name.familyName, email: profile.emails[0].value};

        
        let user = await usersModel.findOrCreateUser(username, password, givenName, middleName, familyName, email);
        if(user){
            done(null, user);
        }
    }
    catch(error){
        done(error);
    }
}
))

passport.serializeUser(function(user, done){
    try{
        done(null, user.username);
    }
    catch(error){
        done(error);
    }
});
passport.deserializeUser(async (username, done) => {
    try{
        const user = await usersModel.find(username);
        done(null, user);
    }
    catch(error){
        done(error);
    }
});


router.get("/login", function(request, response, next){
    try{
        response.render('login', {title: "Login to Notes", user: request.user,
        })
    }
    catch(error){
        next(error);
    }
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
    })
);

router.get('/logout', function(request, response, next){
    try{
        
        request.logout(function(error){
            if(error) { return next(error); }
            request.session.destroy(() => {
                response.clearCookie(sessionCookieName);
                return response.redirect("/");
            });
            
        });
        
    }
    catch(error){
        next(error);
    }
});

router.get('/signup', async (request, response, next) => {
    try{
        response.render("signup", {title: "User Registeration"});
    }
    catch(error){
        next(error);
    }
})

router.post('/signup', async (request, response, next) => {
    try{
        const { username, password, givenName, familyName, middleName, email } = request.body;
        await create(username, password, givenName, middleName, familyName, email);
        response.redirect(303, 'login');
    }
    catch(error){
        next(error);
    }
})

/* GET /login/federated/accounts.google.com
 *
 * This route redirects the user to Google, where they will authenticate.
 *
 * Signing in with Google is implemented using OAuth 2.0.  This route initiates
 * an OAuth 2.0 flow by redirecting the user to Google's identity server at
 * 'https://accounts.google.com'.  Once there, Google will authenticate the user
 * and obtain their consent to release identity information to this app.
 *
 * Once Google has completed their interaction with the user, the user will be
 * redirected back to the app at `GET /oauth2/redirect/accounts.google.com`.
 */
router.get('/login/federated/google', passport.authenticate('google'));

/*
    This route completes the authentication sequence when Google redirects the
    user back to the application.  When a new user signs in, a user account is
    automatically created and their Google account is linked.  When an existing
    user returns, they are signed in to their linked account.
*/
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/users/login'
}));

export { router };
