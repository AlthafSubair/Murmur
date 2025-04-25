import Group from '../models/groupModel.js';
import User from '../models/userModel.js'
import Message from '../models/messageModel.js'
import mongoose from 'mongoose';
import { getReceviersSocketId, io } from '../config/socketio.js';

export const createGrp = async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = String(id);
    const { name, members } = req.body;

    let validMemberIds = [];

    if (typeof members === "string") {
      try {
        validMemberIds = JSON.parse(members);
      } catch (e) {
        return res.status(400).json({ message: "Invalid members format" });
      }
    } else if (Array.isArray(members)) {
      validMemberIds = members;
    }

    validMemberIds = validMemberIds.map(m => String(m));

    if (!validMemberIds.includes(creatorId)) {
      validMemberIds.push(creatorId);
    }

    if (validMemberIds.length > 12) {
      return res.status(400).json({ message: "Group cannot have more than 12 members" });
    }

    const picture = req.file?.path || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    const group = await Group.create({
      name,
      picture,
      createdBy: creatorId,
      members: validMemberIds,
      count: validMemberIds.length
    });

    return res.status(201).json(group);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const fetchGrp = async (req, res) => {
  try {

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const groups = await Group.find({ members: id });

   return res.status(200).json(groups);
    
  } catch (error) {
    console.log("Error fetching groups:", error);
    res.status(500).json({ message: "Error fetching groups" });
  }
};

export const fetchGrpById = async (req, res) => {
  try {

    const { id } = req.params;

    const group = await Group.findById(id).populate([
      { path: "members", select: "_id username profilePicture" },
      { path: "createdBy", select: "_id username profilePicture" }
    ]);
    

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json(group);
    
  } catch (error) {
    console.log("Error fetching groups:", error);
    res.status(500).json({ message: "Error fetching groups" });
  }
}


export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId, createdBy } = req.body;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = group.createdBy == createdBy;
    const isSelfRemoval = memberId == createdBy;
    const isMember = group.members.includes(memberId);


    if (!isAdmin && !isSelfRemoval) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!isMember) {
      return res.status(404).json({ message: "Member not found in group" });
    }

    const memberIndex = group.members.indexOf(memberId);
    group.members.splice(memberIndex, 1);
    group.count = Math.max(group.count - 1, 0);

    await group.save();

    const message = isAdmin
      ? "Member deleted successfully"
      : "Exited from group";



    return res.status(200).json({ message, data: group });
  } catch (error) {
    console.error("Error deleting member:", error);
    return res.status(500).json({ message: "Error deleting member" });
  }
};



export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId, createdBy } = req.body;

   

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if(group.createdBy != createdBy){
      return res.status(401).json({ message: "Unauthorized" });
    }
   
    if (group.members.includes(memberId)) {
      return res.status(400).json({ message: "Member already exists in group" });
    }

    group.members.push(memberId);
    group.count += 1;

    await group.save();

    return res.status(200).json({ message: "Member added successfully", data: group });
    
  } catch (error) {
    console.log("Error adding member:", error);
    return res.status(500).json({ message: "Error adding member" });
  }
}

export const getMsges = async (req, res) => {
  try {

    const { id } = req.params;

    const messages = await Message.find({
      groupId: id,
    }).populate("senderId", "_id username profilePicture");
    

    return res.status(200).json(messages);
    
  } catch (error) {
    console.log("Error fetching messages:", error);
    return res.status(500).json({ message: "Error fetching messages" });
  }
}


export const sendGrpMsg = async (req, res) => {
  
  try {
    let { message } = req.body;

    if (typeof message !== "string") {
      message = String(message);
    }

    const senderId = req.user._id;
    const { id: groupIdParam } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupIdParam)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const groupId = new mongoose.Types.ObjectId(groupIdParam);

    if (!message && !req.file) {
      return res.status(400).json({ message: 'Message or image is required' });
    }

    let image;
    if (req.file) {
      image = req.file.path;
    }

    const newMessage = new Message({
      senderId,
      groupId,
      message,
      image
    });

    const savedMessage = await newMessage.save();

    if (!savedMessage) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    const populatedMessage = await savedMessage
    .populate([
      { path: "groupId", select: "members" },
      { path: "senderId", select: "profilePicture" }
    ]);
  

    // Retrieve the group members
    const memberIds = populatedMessage.groupId.members;

    // Handle async behavior correctly using for...of loop
    for (const member of memberIds) {
      const receiverSocketIds = getReceviersSocketId(member?._id);

      if (receiverSocketIds ) {
        // Emit message to all socket IDs for the user
    
          io.to(receiverSocketIds).emit("grpMsg", populatedMessage);
        
      }
    }

    return res.status(200).json(populatedMessage);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


