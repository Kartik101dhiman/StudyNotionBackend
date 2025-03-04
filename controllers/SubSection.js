const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudnary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.videoFile;
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const uploadVideo = await uploadImageToCloudnary(
      video,
      process.env.FOLDER_NAME
    );
    const subSectionDetail = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadVideo.secure_url,
    });

    //update section with this sub section objectId
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetail._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Sub section created successfully!",
      updatedSection,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to create sub section please try again",
      error: error.message,
    });
  }
};


// update subSection


exports.updateSubSection = async (req,res)=>{
    try{
        const { title, timeDuration, description,SubSectionId}=req.res;
        if(!title||!timeDuration|| !description|| !SubSectionId){
            res.status(400).json({
                success: false,
                message: "subsection details is required",
            })
        };

        const updatedSection= SubSection.findByIdAndUpdate(SubSectionId,{title, timeDuration, description},{new:true});
        return res.status(200).json({
            success:true,
            message:"Sub section data updated successfully!"
        })
    }   
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Unable to update sub section please try again",
            error:error.message
        })
    }    
};


exports.deleteSubSection = async (req,res)=>{
    try{
        //get id from parameter
        const {SubSectionId}=req.params;
        // use findidanddelete
        await SubSection.findByIdAndDelete(SubSectionId);
        return res.status(200).json({
            success:true,
            message:"sub section delete successfully!"
        })
        // return response
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Unable to delete sub section please try again",
            error:error.message
        })
    }
}