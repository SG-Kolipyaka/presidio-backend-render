const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { connection } = require("./db");
const { userRouter } = require("./routes/user.route");
const { auth } = require("./middlewares/user.middle");
const { propertyRouter } = require("./routes/peoperty.route");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);

app.use("/api/property", propertyRouter);

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("connected to DB");
    } catch (er) {
        console.log(er);
    }
    console.log(`server running at ${process.env.PORT}`);
});
