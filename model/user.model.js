const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phoneno: { type: Number, required: true },
    password: { type: String, required: true },
    user: { type: String, required: true},
}, {
    versionKey: false
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = {
    UserModel
};
