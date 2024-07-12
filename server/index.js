const express = require("express");
require("dotenv").config();
var cors = require("cors");

const db = require('./src/config/dbConfig');
const app = express();

const userRoute = require('./src/routes/userRoute');

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
