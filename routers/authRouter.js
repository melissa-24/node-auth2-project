const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

const dbConfig = require("../database/db-config");
const Users = require("../utils/usersModel.js");
const usersModel = require("../utils/usersModel.js");

router.post("/register", (req, res) => {
    const user = req.body;

    if(!(user.username && user.password && user.department)) {
        res.status(400).json({ message: "Missing required data: username, password, department" });
    } else {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;

        Users.add(user)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => res.status(500).json({ message: "Error adding user to database" }));
    }
});

router.post("/login", (req, res) => {
    const {username, password} = req.body;

    if(!(username && password)) {
        res.status(400).json({ message: "Missing username and/or password" });
    } else {
        Users.findBy({ username })
            .then(user => {
                if(user && bcrypt.compareSync(password, user.password)) {
                    const token = generateToken(user);
                    res.status(200).json({loggedon: user.username, department: user.department, token});
                } else {
                    res.status(403).json({ message: "You shall not pass!" });
                }
            })
            .catch(err => res.status(500).json({ message: "Error getting login data" }));
    }
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department,
    };

    const options = {
        expiresIn: "1h",
    };

    return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;