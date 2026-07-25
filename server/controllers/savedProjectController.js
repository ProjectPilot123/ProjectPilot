const SavedProject = require("../models/SavedProject");

const saveProject = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      techStack,
      estimatedDays,
      roadmap,
      resumeValue,
      uniqueSellingPoint,
    } = req.body;

    // Basic validation
    if (
      !title ||
      !description ||
      !difficulty ||
      !techStack ||
      !estimatedDays ||
      !roadmap ||
      !resumeValue ||
      !uniqueSellingPoint
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required project fields",
      });
    }

    // Prevent duplicate saved projects for the same user
    const existingProject = await SavedProject.findOne({
      user: req.user.id,
      title: title.trim(),
    });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: "Project is already saved",
      });
    }

    // Save project
    const savedProject = await SavedProject.create({
      user: req.user.id,
      title,
      description,
      difficulty,
      techStack,
      estimatedDays,
      roadmap,
      resumeValue,
      uniqueSellingPoint,
    });

    return res.status(201).json({
      success: true,
      message: "Project saved successfully",
      project: savedProject,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    console.log("Save project error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

const getSavedProjects = async (req, res) => {
  try {
    const projects = await SavedProject.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.log("Get saved projects error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

const deleteSavedProject = async (req, res) => {
  try {
    const project = await SavedProject.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Saved project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log("Delete project error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

module.exports = {
  saveProject,
  getSavedProjects,
  deleteSavedProject,
};
