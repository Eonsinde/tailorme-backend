const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add a username e.g @ddclothing"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please add a password"]
    },
    displayName: {
        type: String,
        required: [true, "Please add a display name e.g DD Clothing"],
        unique: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,  
    },
    phoneNumber: {
        type: String,  
    },
    address: {
        type: String,  
    },
}, {
    timestamps: true
})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) { 
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = {
    User: mongoose.model("User", userSchema)
}