import User from "../models/userModel.js";
import Message from "../models/messageModel.js"
import mongoose from "mongoose";

export const getUsers = async (req, res) => {
    try {
        const id = req.user._id;
        const users = await User.find({ _id: { $ne: id } }).select("_id username profilePicture");
        if(!users) {
            return res.status(404).json({ message: 'No users found' });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getMessage = async (req, res) => {
    try {

        const {id: reciverParamId} = req.params;
        const SenderId = req.user._id;

        const reciverId = new mongoose.Types.ObjectId(reciverParamId);

        console.log(SenderId, reciverId);

        const message = await Message.find({
            $or: [
              { $and: [{ senderId: SenderId }, { reciverId: reciverId }] },
              { $and: [{ senderId: reciverId }, { reciverId: SenderId }] }
            ]
          }).sort({ createdAt: 1 });
          

       if(!message) {
            return res.status(404).json({ message: 'No messages found' });
        }
        
        return res.status(200).json(message);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const senderId = req.user._id;
        const { id: reciverIdParam } = req.params;

        const reciverId = new mongoose.Types.ObjectId(reciverIdParam);

        console.log(senderId, reciverId, message);

        if (!message && !req.file) {
            return res.status(400).json({ message: 'Message or image is required' });
        }

        let image;
        if (req.file) {
            image = req.file.path; // or req.file.secure_url if using Cloudinary
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            message,
            image
        });

        const savedMessage = await newMessage.save();

        if (!savedMessage) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        const populatedMessage = await savedMessage
       

        return res.status(200).json(populatedMessage);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
