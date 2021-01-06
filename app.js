const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
// const expressLayouts = require('express-ejs-layouts');

const app = express();

// Configuracion Passport
require("./config/passport")(passport);

// Configuracion DB
const db = require("./config/keys").MongoURI;

// Conexion MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Conectado..."))
    .catch(error => console.log(error));

// Habilitando Pug
app.set('views', './views');
app.set('view engine', 'pug');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// Connect-Flash
app.use(flash());

// Variables Globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// app.use(expressLayouts);
// app.set('view engine', 'ejs');

// Definir la carpeta publica
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Servidor iniciado en el puerto ${PORT}`));