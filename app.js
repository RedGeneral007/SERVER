require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const db = require('./utils/db');
const users = require("./api/routes/users");
const posts = require("./api/routes/posts");
const auth = require("./api/routes/auth");
const cors = require('cors');

db.connect()
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Couldn't connect to MongoDB :(", err));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use('/uploads', express.static('uploads'));

app.use(cors());

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/posts", posts);


const PORT = 4000;
http.listen(PORT, () => console.log(`Listening on port ${PORT}...`));