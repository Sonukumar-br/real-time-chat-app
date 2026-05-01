import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js"; // ✅ ADD THIS

export const getCurrentUser = async (req, res) => {
  try {
    let userId = req.userId;

    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: `getCurrentUser error: ${error.message}` });
  }
};

export const editProfile = async (req, res) => {
  try {
    let { name } = req.body;

    let updateData = { username: name };

    if (req.file) {
      const imageUrl = await uploadOnCloudinary(req.file.path);
      updateData.image = imageUrl; // ✅ correct
    }

    let user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user); // ✅ VERY IMPORTANT

  } catch (error) {
    console.log("EditProfile Error:", error); // 🔥 debug
    return res.status(500).json({ message: `editProfile error: ${error.message}` });
  }
};

export const getOtherUsers=async (req,res)=>{
    try {
        let users=await User.find({
            _id:{$ne:req.userId}
        }).select("-password")
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({message:`get other users
        error ${error}`})
    }
}

export const search =async (req,res)=>{
    try {
    let {query}=req.query
    if(!query){
        return res.status(400).json({message:"query is required"})
    }
    let users=await User.find({
        $or:[
            {name:{$regex:query,$options:"i"}},
            {username:{$regex:query,$options:"i"}},
        ]
    })
    return res.status(200).json(users)

    } catch (error) {
     return res.status(500).json({message:`search users
        error ${error}`})
    }
}