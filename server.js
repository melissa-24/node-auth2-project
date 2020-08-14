const express = require("express");
const helmet = require("helmet");
const cors = require("cors");


const usersRouter = require("../routers/usersRouter.js");
const authRouter = require("../routers/authRouter");

const server = express();
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.use('/', (req, res) => {
    res.send(`
        <h2>Hey your API is up</h2>
    `);
  });

module.exports = server;
