const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Cargar Modelo User
const User = require("../models/User");

module.exports = passport => {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            // Match Usuario
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: "Email no registrado" });
                    }

                    // Match Contraseña
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Contraseña Incorrecta" });
                        }
                    });
                })
                .catch(error => console.log(error))
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}