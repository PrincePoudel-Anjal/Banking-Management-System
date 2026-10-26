const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Invalid Email"],
        trim: true, 
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please provide a valid email address'],
        unique: true
    },
    name:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: [8, "Min 8 characters is necessary."],
        select: false
    }
},{
    timestamps: true
});

userSchema.pre("save", async function(next){
    if (!this.isModified("password")){
        return;
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return;
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

