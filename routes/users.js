const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// User Model
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => res.render("login"));

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Chequear campos requeridos
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Todos los campos son obligatorios" });
    }

    // Chequear que la contraseña coincide
    if (password !== password2) {
        errors.push({ msg: "Las contraseñas no coinciden" });
    }

    // Chequear longitud de contraseña
    if (password.length < 6) {
        errors.push({ msg: "La contraseña debe ser de al menos 6 caracteres" });
    }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else {
        // Validación aprobada
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // Usuario existe
                    errors.push({ msg: "Email ya registrado" });
                    res.render("register", {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hashear contraseña
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Definir contraseña hasheada
                            newUser.password = hash;
                            // Guardar Usuario
                            newUser.save()
                                .then(user => {
                                    req.flash("success_msg", "Estas registrado y puedes Iniciar Sesión");
                                    res.redirect("/users/login");
                                })
                                .catch(error => console.log(error));
                        })
                    });
                }
            });
    }
});

// Login Handle
router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Sesión Cerrada');
    res.redirect('/users/login');
});

module.exports = router;