const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
require("dotenv").config();

const { uploadImageToCloudnary } = require("../utils/imageUploader");

//create course handler function
exports.createCourse = async (req, res) => {
  try {
    //fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tags } =
      req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tags
    ) {
      return res.status(400).json({
        success: false,
        message: "All field is required",
      });
    }

    // check for the instructor

    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    // check tags

    const tagDetail = await Tag.findById(tags);
    if (!tagDetail) {
      return res.status(400).json({
        success: false,
        message: "Tag Details not found",
      });
    }

    // upload image to cloudinary

    const thumbnailImage = await uploadImageToCloudnary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    const newCourse = Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tags._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // add the new course to the user schema of instructor

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: false,
      message: "Course created successfully!",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
  }
};

// get all course handle function

exports.getAllCourse = async (req, res) => {
  try {
    const allCourse = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: false,
      message: "All course fetch successfully!",
      data: allCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Not fetch course data",
      error: error.message,
    });
  }
};
