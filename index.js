require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3001;
const app = express();

require("./db/connection");

app.use(express.json());
app.use(cookieParser());
app.use(require("./router/auth"));

if (process.env.NODE_ENV == "production") {
  console.log(process.env.NODE_ENV);
  app.use(express.static(path.join(`${__dirname}/client/build`)));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(`${__dirname}/client/build/index.html`));
  });
}

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
