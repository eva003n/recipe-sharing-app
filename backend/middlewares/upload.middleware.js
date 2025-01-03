
    

export const imageUpload = async (req, res, next) => {


  if (!req.files && Object.keys(req.files).length === 0) {
    return res.status(400).json({
      message: "No files were choosen",
    });
  }
  const image = req.files.image;
  if (!validateMimeTypes(image)) {
    return res.status(422).json({
      message: "Image format not supported!",
    });
  }

  // const {uploadImage} = req.files.image
};
