import { profileValidation } from "../middlewares/validator.js";
import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import { validateMimeTypes } from "../utils/imageUpload.js";
import { upload } from "../config/cloudinary.js";

export const getProfileDetails = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    console.log(currentUserId);

    //lean returns pojos and should only be use for get request
  const profileDetails = await User.findById(currentUserId).lean().populate("favouriteRecipes").exec();

  if(!profileDetails) {
    return res.status(404).json({
      message: "Profile not found!"
    });
  }

  return res.status(200).json(profileDetails);
  }catch(e) {
    console.log(e.message);
    return res.status(500).json({
      message: "An error occured!"
    })
  }

};

let imageUrl;
let imageId;
export const createUserProfile = async (req, res) => {
  const { username, bio, notifyLikes, notifyFollows, notifyComments } =
    req.body;

  try {
    const { error, value } = profileValidation.validate({
      username,
      bio,
      notifyComments,
      notifyFollows,
      notifyLikes,
    });
    if (error) {
      return res.status(400).json({
        message: `invalid input ${error.message}`,
      });
    }
  

    if (!req.files && Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "No files were choosen",
      });
    }
    const userProfilePhoto = req.files.userProfile;

    if (!validateMimeTypes(userProfilePhoto)) {
      return res.status(422).json({
        message: "Image format not supported!",
      });
    }
    let imageUrl;
    let imageId;
   
   const uploadedImage = await upload(userProfilePhoto.data, "user-profiles");


   if (uploadedImage) {
      imageUrl = uploadedImage.secure_url;
      imageId = uploadedImage.public_id;
    }
   

    const update = {
      userName: username,
      bio: bio,
      photo: imageUrl,
      "notificationPreferences.notifyLikes": notifyLikes,
      "notificationPreferences.notifyFollows": notifyFollows,
      "notificationPreferences.notifyComments": notifyComments,
    };

   
        const id = req.user._id;
      const createProfile = await User.findOneAndUpdate({_id: id}, update, {
        returnOriginal: false,
       
      }).lean();

      if (createProfile) {
        res.status(201).json(createProfile);
      }
   
  
  } catch (e) {
    console.log(e.message)
    res.status(500).json({
      message: `Error! couldn't create profile `,
    });
  }
};

export const updateProfile = async(req, res) => {
  
    console.log(imageId);
  

//   try {
//     const { error, value } = profileValidation.validate({
//       username,
//       bio,
//       notifyComments,
//       notifyFollows,
//       notifyLikes,
//     });
//     if (error) {
//       return res.status(400).json({
//         message: `invalid input ${error.message}`,
//       });
//     }
//     console.log("heelo 2");

//     if (!req.files && Object.keys(req.files).length === 0) {
//       return res.status(400).json({
//         message: "No files were choosen",
//       });
//     }
//     const userProfilePhoto = req.files.userProfile;

//     if (!validateMimeTypes(userProfilePhoto)) {
//       return res.status(422).json({
//         message: "Image format not supported!",
//       });
//     }

//     const uploadedImage = await upload(userProfilePhoto.data, "user-profiles");

//     if (uploadedImage) {
//       imageUrl = uploadedImage.secure_url;
//       imageId = uploadedImage.public_id;
//     }
//     console.log("heelo 3");

//     const update = {
//       userName: username,
//       bio: bio,
//       photo: imageUrl,
//       "notificationPreferences.notifyLikes": notifyLikes,
//       "notificationPreferences.notifyFollows": notifyFollows,
//       "notificationPreferences.notifyComments": notifyComments,
//     };

//     if (req.user && req.user.email) {
//         const id = req.user._id;
//       const createProfile = await User.findOneAndUpdate({_id: id}, update);
//       console.log("heelo 4");
//       if (createProfile) {
//         res.status(201).json(
          
//               {
//                   success: true,
//                   message: "Your profile is created successfully"
//               }
//         );
//       }
//     }
  
//   } catch (e) {
//     res.status(400).json({
//       message: `Error! couldn't create profile ${e.message}`,
//     });
//   }
    
}
export const followUser = async (req, res) => {
  const { user_id } = req.params;

  const createFollow = Follow.create({
    followerId: req.user._id,
    followeeId: user_id,
  });
  if (createFollow) {
    return res.status(201).json({
      message: "Successfully followed user",
    });
  }
};
