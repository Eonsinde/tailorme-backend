const fs = require("fs");
const cloudinary = require("cloudinary").v2;


const uploadToCloudinary = async (locaFilePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  // locaFilePath :
  // path of image which was just uploaded to "uploads" folder
  var mainFolderName = "main";
  var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;

  // filePathOnCloudinary :
  // path of image we want when it is uploded to cloudinary
  return cloudinary.uploader
    .upload(locaFilePath, { public_id: filePathOnCloudinary })
    .then((result) => {
      // Image has been successfully uploaded on cloudinary
      // So we dont need local image file anymore
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);

      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((error) => {
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);
      return { message: "Fail" };
    });
};

module.exports = uploadToCloudinary;
