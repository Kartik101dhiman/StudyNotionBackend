const Category = require("../models/Category");

// create tags ka handler function

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All field is required",
      });
    }
    //create entry in DB

    const categoryDetail = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetail);
    return res.status(200).json({
      success: false,
      message: "Tags created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get All tags

exports.showAllCategory = async (req, res) => {
  try {
    const showAllCategory = await Tag.find({},{name:true,description:true});
    res.status(200).json({
        success:false,
        message:"All tegs returned successfully",
        showAllCategory 
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
