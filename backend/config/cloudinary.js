import dotenv from "dotenv";
import sharp from "sharp";
import toStream from "buffer-to-stream";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

const options = {
  use_filename: true,
  overwrite: true,
};


cloudinary.config({
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudSecret: process.env.CLOUDINARY_SECRET,
    secure: true
});

export const upload = async (file, folder, options) => {

  const bufferredImage = await sharp(file)
  .resize(600)
  .webp({quality: 90})
  .toBuffer();

  return new Promise((resolve, reject) => {
   const upload = cloudinary.uploader.upload_stream((err, result) => {
      if(err) return reject(err);
      return resolve(result);
      
    })
 toStream(bufferredImage).pipe(upload), {resourceType: "auto", folder, options}

  })
};

