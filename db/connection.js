const mongoose = require("mongoose");

const mongodb_url = process.env.DATABASE;

mongoose
  .connect(mongodb_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));
