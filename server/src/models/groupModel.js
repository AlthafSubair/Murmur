import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  count: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
