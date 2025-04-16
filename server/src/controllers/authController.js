import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import sendOTP from "../utils/sendOtp.js";
import jwt from "jsonwebtoken";
import { cloudinary } from "../config/cloudinary.js";



export const registerEmail = async (req, res) => {
try {

    const {username, email, password} = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser) {
        return res.status(400).json({message: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    const newUser = new User({username, email, password: hashedPassword, otp, otpExpiresAt});

    await newUser.save();


    await sendOTP(newUser.username, newUser.email, newUser.otp, path);

    res.status(201).json({message: "User registered successfully"});
    
} catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
}
}

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let { path } = req.query;
    
    // Trim any extra spaces that might cause issues
    path = path.trim();
    

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (path === 'verify-email') {
      if (user.otp !== otp || Date.now() > user.otpExpiresAt) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.isVerified = true;
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();

      return res.status(200).json({ message: "Email verified successfully" });

    } else if (path === 'reset-password') {
     
      if (user.resetPasswordToken !== otp || Date.now() > user.resetPasswordExpiresAt) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.resetPasswordToken = null;
      user.resetPasswordExpiresAt = null;
      await user.save();

      return res.status(200).json({ message: "OTP verified. You can now reset your password." });

    } else {
  
      return res.status(400).json({ message: "Invalid path" });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

  
  export const resendOtp = async (req, res) => {
    try {
      const { email } = req.body;
      const { path } = req.query;
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Generate OTP and set expiry time
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  
      // Handle OTP generation based on the path
      if (path === 'verify-email') {
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
  
        // Send OTP email
        await sendOTP(user.username, user.email, otp, path);
        return res.status(200).json({ message: "OTP sent successfully for email verification" });
      } else if (path === 'reset-password') {
        user.resetPasswordToken = otp;
        user.resetPasswordExpiresAt = otpExpiresAt;
        await user.save();
  
        // Send OTP email for password reset
        await sendOTP(user.username, user.email, otp, path);
        return res.status(200).json({ message: "OTP sent successfully for password reset" });
      } else {
        return res.status(400).json({ message: "Invalid path" });
      }
  
    } catch (error) {
      console.error("Error resending OTP:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  export const resetPassword = async (req, res) => {
    try {

      const {email, password, confirmPassword} = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password reset successfully" });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  

  export const logIn = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // If the user is not verified, send OTP and stop further execution
      if (!user.isVerified) {
        const resendOtpReq = {
          body: { email },  // Pass the email to resendOtp
          query: { path: 'verify-email' }  // Specify that it's for email verification
        };
        
        await resendOtp(resendOtpReq, res);  // Call resendOtp function here
        return res.status(400).json({ message: "Please verify your email before logging in. An OTP has been sent to your email." });
      }
  
      // If the user is verified, check the password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
  
      // If the password is correct, generate a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7h' });
  
      // Set the token in a cookie
      res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV === "production",  // Set secure flag in production
      });
  
      return res.status(200).json({ message: "Login successful", data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
    } });
    
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


  export const logOut = async (req, res) => {
    try {
      // Clear the JWT cookie
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV === "production",
      });
  
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const updateProfile = async (req, res) => {
    try {
      
      if(!req.file){
        return res.status(400).json({ message: "Please upload a profile picture" });
      }

      const id = req.user._id;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.profilePicture.startsWith("https://res.cloudinary.com/diuha1ygf/image/upload/")) {
        // Extract the public ID correctly by removing the base URL and file extension
        const publicId = user.profilePicture.split('/').slice(7, -1).join('/'); // Get the public ID part
        await cloudinary.uploader.destroy(publicId);
      }
      

      user.profilePicture = req.file.path;
      await user.save();

      return res.status(200).json({ message: "Profile picture updated successfully", data: user.profilePicture });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  export const checkAuth = async (req, res) => {
    try {
      console.log(req.user);
      res.status(200).json(req.user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  