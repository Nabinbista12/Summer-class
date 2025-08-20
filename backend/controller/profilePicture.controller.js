import User from "../model/user.model.js";

export async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) throw new Error("No file uploaded");

    const result = await uploadProfilePicture(req.file.buffer, {
      folder: "profilepic",
      public_id: `user_#{req.user.id}`,
      transformation: [
        { width: 1600, height: 1600, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePicture: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      },
      {
        new: true,
      }
    );
    res.json({ success: true, image: user.profilePicture });
  } catch (err) {
    res.status(404).json({ message: "Error caught while throwing error" });
  }
}


