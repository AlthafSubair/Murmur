import Group from '../models/groupModel.js';
import User from '../models/userModel.js'

import mongoose from "mongoose";

export const createGrp = async (req, res) => {
  try {
    const { createdBy } = req.params;
    const { name, members } = req.body;

    const user = await User.findById(createdBy);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let validMemberIds = Array.isArray(members)
      ? members.filter(id => mongoose.Types.ObjectId.isValid(id))
      : [];

    // Include creator in the members array if not already included
    if (!validMemberIds.includes(createdBy)) {
      validMemberIds.push(createdBy);
    }

    if (validMemberIds.length > 12) {
      return res.status(400).json({ message: "Group cannot have more than 12 members" });
    }

    const picture = req.file?.path || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    const group = await Group.create({
      name,
      picture,
      createdBy,
      members: validMemberIds,
      count: validMemberIds.length
    });

    return res.status(201).json(group);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
