const server = require("../server");

const router = require("express").Router();

const users = require("../utils/usersModel.js");
const restricted = require("../utils/restricted.js");

router.get("/", restricted, (req, res) => {
    users.find()
        .where({ department: req.jwt.department })
        .then(users => {
            if(users.length > 0) {
                res.json(users);
            } else {
                res.status(400).json({ message: "Missing or Invalid department for logged in user" });
            }
        })
        .catch(err => res.status(500).json({ message: "Error retrieving users"}));
});

module.exports = router;