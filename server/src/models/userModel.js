import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    provider: {
        type: String,
        required: true,
        enum: ['local', 'google'],
        default: 'local'
    },
    otp: {
        type: String,
        required: false,
    },
    otpExpiresAt: {
        type: Date,
        required: false,
    },
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordExpiresAt: {
        type: Date,
    }
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);

export default User;