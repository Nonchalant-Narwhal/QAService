const express = require("express");
const app = express();
const port = 8888;

app.use(express.static("public"));
// app.get("/", (req, res) => res.send("Hello World! I'm running in docker"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
