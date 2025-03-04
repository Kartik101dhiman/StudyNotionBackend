const Section = require("../models/Section");
const Course = require("../models/Course");

exports.CreateSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;
    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All section field is required",
      });
    }
    //create section
    const newSection = Section.create({ sectionName });
    //update course with section ObjectID
    const updateCourseDetail = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
        success:true,
        message:"Section created successfully!",
        updateCourseDetail
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
        success:false,
        message:"Unable to create section please try again",
        error:error.message
    })
  }
};


exports.updateSection = async (req,res)=>{
    try{
        const {sectionName,sectionId}=req.res;
        if(!sectionName||!sectionId){
            res.status(400).json({
                success: false,
                message: "section name is required",
            })
        };

        const updatedSection= Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        return res.status(200).json({
            success:true,
            message:"Section data updated successfully!"
        })
    }   
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Unable to update section please try again",
            error:error.message
        })
    }    
};

exports.deleteSection = async (req,res)=>{
    try{
        //get id from parameter
        const {sectionId}=req.params;
        // use findidanddelete
        await Section.findByIdAndDelete(sectionId);
        return res.status(200).json({
            success:true,
            message:"section delete successfully!"
        })
        // return response
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Unable to delete section please try again",
            error:error.message
        })
    }
}