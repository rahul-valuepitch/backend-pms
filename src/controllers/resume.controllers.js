import Resume from "../models/resume.models.js";
import Template from "../models/templates.models.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { emailValidation, phoneValidation } from "../utils/validators.js";
import uploadMiddleware from "../middlewares/multer.middleware.js";

// Create Resume Controller
export const createResumeController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Template from frontend
   * TODO: Get User from Frontend
   * TODO: Create Resume
   * TODO: Sending Response
   * **/

  // * Get Template from frontend
  const { templateId } = req.query;
  const template = await Template.findById(templateId);
  if (!template) throw new ApiError(404, "Template not found");

  // * Get User from Frontend
  const user = req.user;

  // * Create Resume
  const resume = await Resume.create({
    user,
    template,
  });

  // * Add Resume in User Model
  user.resumes.push(resume._id);
  await user.save();

  // * Check if resume is created
  if (!resume) throw new ApiError(400, "Resume not created");

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume created successfully!"));
});

// Get User Resumes Controller
export const getUserResumesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get User from request
   * TODO: Get All Resumes created by User
   * TODO: Sending Response
   * **/

  // * Get User from Request
  const user = req.user;

  // * Get All Resumes created by User
  const resumes = await Resume.find({ user: user._id });

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, resumes, "Resumes fetched successfully!"));
});

// Get Resume Detail Controller
export const getResumeDetailController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get id from request
   * TODO: Search for resume based on id
   * TODO: Sending Response
   * **/

  // * Get id from request
  const _id = req.params._id;

  // * Search for resume based on id
  const resume = await Resume.findById(_id);

  if (!resume) throw new ApiError(404, "Resume not found");

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume fetched successfully!"));
});

// Delete Resume Controller
export const deleteResumeController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get resume from Request
   * TODO: Delete Resume
   * TODO: Send Response
   * **/

  // * get resume from Request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);
  if (!resume) throw new ApiError(404, "Resume not found");

  // * Delete Resume
  await Resume.findByIdAndDelete(resumeId);

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Resume deleted successfully!"));
});

// Updating Resume Profile Controller
export const updateResumeProfileController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get data from frontend
   * TODO: Validate data
   * TODO: Save data
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const {
    jobTitle,
    firstName,
    middleName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    zip,
    drivingLicense,
    nationality,
    placeOfBirth,
    dateOfBirth,
    gender,
    maritalStatus,
    summary,
  } = req.body;

  // * Validate data
  if (email) {
    emailValidation(email);
  }
  if (phone) {
    phoneValidation(phone);
  }

  // * Save data
  Object.assign(resume, {
    jobTitle,
    firstName,
    middleName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    zip,
    drivingLicense,
    nationality,
    placeOfBirth,
    dateOfBirth,
    gender,
    maritalStatus,
    summary,
  });

  await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume profile updated successfully!"));
});

// Update Resume Profile Photo Controller
export const updateResumeProfilePhotoController = asyncHandler(
  async (req, res) => {
    /**
     * TODO: Get Resume from request
     * TODO: Get file from frontend
     * TODO: Update Resume Profile Photo
     * TODO: Sending Response
     * **/

    // * Get Resume from request
    const resumeId = req.params._id;
    const resume = await Resume.findById(resumeId);

    // * Get file from frontend
    const photo = req.file?.path;
    if (!photo) throw new ApiError(400, "Please upload an image");

    // * update Resume Profile Photo
    resume.photo = photo;
    await resume.save();

    // * Sending Response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          resume,
          "Resume profile photo updated successfully!"
        )
      );
  }
);

// Delete Resume Profile Photo Controller
export const deleteResumeProfilePhotoController = asyncHandler(
  async (req, res) => {
    /**
     * TODO: Get Resume from request
     * TODO: Remove photo
     * TODO: Sending Response
     * **/

    // * Get Resume from request
    const resumeId = req.params._id;
    const resume = await Resume.findById(resumeId);

    // * Get id from request and Delete Resume Profile Photo
    const updatedResume = await Resume.findByIdAndUpdate(
      resume._id,
      { $unset: { photo: "" } },
      { new: true }
    );

    // * Sending Response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedResume,
          "Profile photo deleted successfully!"
        )
      );
  }
);

// ! Profession Controllers
// Get All Profession Controller
export const getAllProfessionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all professions
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all professions
  const professions = resume.professions;

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, professions, "Professions fetched successfully!")
    );
});

// Add Profession Controller
export const addProfessionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Rresume from request
   * TODO: Get data from frontend
   * TODO: Add profession in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { title, employer, startDate, endDate, city, description } = req.body;

  // * Add Profession in Resume
  const newProfession = {
    title,
    employer,
    startDate,
    endDate,
    city,
    description,
  };

  resume.professions.push(newProfession);
  await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Profession added successfully!"));
});

// Detail Profession Controller
export const detailProfessionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the profession by id
   * TODO: Sending Response
   * **/

  // * Find the profession by id
  const resumeId = req.params._id;
  const professionId = req.query.pid;

  const resume = await Resume.findById(resumeId);

  const professionIndex = resume.professions.findIndex(
    (prof) => prof._id.toString() === professionId
  );
  if (professionIndex === -1) {
    throw new ApiError(404, "Profession not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.professions[professionIndex],
        "Profession fetched successfully!"
      )
    );
});

// Update Profession Controller
export const updateProfessionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the profession by id
   * TODO: Update profession data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { title, employer, startDate, endDate, city, description } = req.body;

  // * Find the profession by id
  const resumeId = req.params._id;
  const professionId = req.query.pid;

  const resume = await Resume.findById(resumeId);

  const professionIndex = resume.professions.findIndex(
    (prof) => prof._id.toString() === professionId
  );
  if (professionIndex === -1) {
    throw new ApiError(404, "Profession not found");
  }

  // * Update profession data
  const professionToUpdate = resume.professions[professionIndex];

  professionToUpdate.title = title;
  professionToUpdate.employer = employer;
  professionToUpdate.startDate = startDate;
  professionToUpdate.endDate = endDate;
  professionToUpdate.city = city;
  professionToUpdate.description = description;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.professions[professionIndex],
        "Profession updated successfully!"
      )
    );
});

// Delete Profession Controller
export const deleteProfessionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get profession from request
   * TODO: Delete Profession
   * TODO: Sending Response
   * **/

  // * Get profession from request
  const resumeId = req.params._id;
  const professionId = req.query.pid;

  const resume = await Resume.findById(resumeId);

  const professionIndex = resume.professions.findIndex(
    (prof) => prof._id.toString() === professionId
  );
  if (professionIndex === -1) {
    throw new ApiError(404, "Profession not found");
  }

  // * Delete Profession
  resume.professions.splice(professionIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.professions,
        "Profession deleted successfully!"
      )
    );
});
// ! Profession Controllers

// ! Education Controllers
// Get All Education Controller
export const getAllEducationController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all educations
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all education
  const education = resume.education;

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, education, "Education fetched successfully!"));
});

// Add Education Controller
export const addEducationController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get data from frontend
   * TODO: Add education in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { school, degree, startDate, endDate, city, description } = req.body;

  // * Add Education in Resume
  const newEducation = {
    school,
    degree,
    startDate,
    endDate,
    city,
    description,
  };

  resume.education.push(newEducation);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedResume }, "Education added successfully!")
    );
});

// Detail Education Controller
export const detailEducationController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the education by id
   * TODO: Sending Response
   * **/

  // * Find the education by id
  const resumeId = req.params._id;
  const educationId = req.query.eid;

  const resume = await Resume.findById(resumeId);

  const educationIndex = resume.education.findIndex(
    (prof) => prof._id.toString() === educationId
  );
  if (educationIndex === -1) {
    throw new ApiError(404, "Education not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.education[educationIndex],
        "Education fetched successfully!"
      )
    );
});

// Update Education Controller
export const updateEducationController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the education by id
   * TODO: Update education data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { school, degree, startDate, endDate, city, description } = req.body;

  // * Find the education by id
  const resumeId = req.params._id;
  const educationId = req.query.eid;

  const resume = await Resume.findById(resumeId);

  const educationIndex = resume.education.findIndex(
    (prof) => prof._id.toString() === educationId
  );
  if (educationIndex === -1) {
    throw new ApiError(404, "Education not found");
  }

  // * Update education data
  const educationToUpdate = resume.education[educationIndex];

  educationToUpdate.school = school;
  educationToUpdate.degree = degree;
  educationToUpdate.startDate = startDate;
  educationToUpdate.endDate = endDate;
  educationToUpdate.city = city;
  educationToUpdate.description = description;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.education[educationIndex],
        "Education updated successfully!"
      )
    );
});

// Delete Education Controller
export const deleteEducationController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get education from request
   * TODO: Delete education
   * TODO: Sending Response
   * **/

  // * Get education from request
  const resumeId = req.params._id;
  const educationId = req.query.eid;

  const resume = await Resume.findById(resumeId);

  const educationIndex = resume.education.findIndex(
    (prof) => prof._id.toString() === educationId
  );
  if (educationIndex === -1) {
    throw new ApiError(404, "Education not found");
  }

  // * Delete education
  resume.education.splice(educationIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.education,
        "Education deleted successfully!"
      )
    );
});
// ! Education Controllers

// Update Resume Controller
export const updateResumeController = asyncHandler(async (req, res) => {
  const { action } = req.query;
  const { pid } = req.query;

  switch (action) {
    //  Updating Profile Details
    case "update-resume-profile":
      updateResumeProfileController(req, res);
      break;

    //  Updating Profile Photo
    case "update-resume-profile-photo":
      const photoUploadMiddleware = uploadMiddleware("photo");
      photoUploadMiddleware(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: "Image upload failed" });
        }
        updateResumeProfilePhotoController(req, res);
      });
      break;

    //  Deleting Profile Photo
    case "delete-resume-profile-photo":
      deleteResumeProfilePhotoController(req, res);
      break;

    //  Get All Profession
    case "get-all-profession":
      getAllProfessionController(req, res);
      break;

    //  Add Profession
    case "add-profession":
      addProfessionController(req, res);
      break;

    //  Detail Profession
    case "detail-profession":
      detailProfessionController(req, res);
      break;

    //  Update Profession
    case "update-profession":
      updateProfessionController(req, res);
      break;

    //  Delete Profession
    case "delete-profession":
      deleteProfessionController(req, res);
      break;

    //  Get All Education
    case "get-all-education":
      getAllEducationController(req, res);
      break;

    //  Add Education
    case "add-education":
      addEducationController(req, res);
      break;

    //  Detail Education
    case "detail-education":
      detailEducationController(req, res);
      break;

    //  Update Education
    case "update-education":
      updateEducationController(req, res);
      break;

    //  Delete Education
    case "delete-education":
      deleteEducationController(req, res);
      break;

    default:
      res.status(400).json({ error: "Invalid action" });
  }
});
