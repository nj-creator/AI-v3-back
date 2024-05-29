const AWS = require("aws-sdk");
const {
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_LOCATION,
} = require("../config/env.config");

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_LOCATION,
});

const s3 = new AWS.S3();

const uploadBase64ImageToS3 = async (base64Image, name) => {
  const binaryData = Buffer.from(base64Image, "base64");

  const params = {
    Bucket: "immersfy-media",
    Key: name,
    Body: binaryData,
    ACL: "public-read",
    ContentType: "image/jpeg",
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

module.exports = { uploadBase64ImageToS3 };
