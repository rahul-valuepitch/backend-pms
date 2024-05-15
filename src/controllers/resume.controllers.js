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
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.professions,
        "Profession added successfully!"
      )
    );
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
    (item) => item._id.toString() === professionId
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
    (item) => item._id.toString() === professionId
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
    (item) => item._id.toString() === professionId
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
    (item) => item._id.toString() === educationId
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
    (item) => item._id.toString() === educationId
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
    (item) => item._id.toString() === educationId
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

// ! Links Controllers
// Get All Links Controller
export const getAllLinksController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all links
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all links
  const links = resume.links;

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, links, "Links fetched successfully!"));
});

// Add Links Controller
export const addLinksController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get data from frontend
   * TODO: Add link in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { label, link } = req.body;

  // * Add Link in Resume
  const newLink = { label, link };

  resume.links.push(newLink);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedResume }, "Education added successfully!")
    );
});

// Detail Links Controller
export const detailLinksController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the link by id
   * TODO: Sending Response
   * **/

  // * Find the link by id
  const resumeId = req.params._id;
  const linkId = req.query.lid;

  const resume = await Resume.findById(resumeId);

  const linkIndex = resume.links.findIndex(
    (item) => item._id.toString() === linkId
  );
  if (linkIndex === -1) {
    throw new ApiError(404, "Link not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.links[linkIndex],
        "Link fetched successfully!"
      )
    );
});

// Update Links Controller
export const updateLinksController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the link by id
   * TODO: Update link data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { label, link } = req.body;

  // * Find the link by id
  const resumeId = req.params._id;
  const linkId = req.query.lid;

  const resume = await Resume.findById(resumeId);

  const linkIndex = resume.links.findIndex(
    (item) => item._id.toString() === linkId
  );
  if (linkIndex === -1) {
    throw new ApiError(404, "Link not found");
  }

  // * Update link data
  const linkToUpdate = resume.links[linkIndex];

  linkToUpdate.label = label;
  linkToUpdate.link = link;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.links[linkIndex],
        "Link updated successfully!"
      )
    );
});

// Delete Links Controller
export const deleteLinksController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get link from request
   * TODO: Delete link
   * TODO: Sending Response
   * **/

  // * Get link from request
  const resumeId = req.params._id;
  const linkId = req.query.lid;

  const resume = await Resume.findById(resumeId);

  const linkIndex = resume.links.findIndex(
    (item) => item._id.toString() === linkId
  );
  if (linkIndex === -1) {
    throw new ApiError(404, "Link not found");
  }

  // * Delete link
  resume.links.splice(linkIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedResume.links, "Link deleted successfully!")
    );
});
// ! Links Controllers

// ! Skills Controllers
// Get All Skills Controller
export const getAllSkillsController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all skills
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all skills
  const skills = resume.skills;

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, skills, "Skills fetched successfully!"));
});

// Add Skills Controller
export const addSkillsController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get data from frontend
   * TODO: Add skill in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { skill, level } = req.body;

  // * Add skill in Resume
  const newSkill = { skill, level };

  resume.skills.push(newSkill);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedResume }, "Education added successfully!")
    );
});

// Detail Skills Controller
export const detailSkillsController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the skill by id
   * TODO: Sending Response
   * **/

  // * Find the skill by id
  const resumeId = req.params._id;
  const skillId = req.query.sid;

  const resume = await Resume.findById(resumeId);

  const skillIndex = resume.skills.findIndex(
    (item) => item._id.toString() === skillId
  );
  if (skillIndex === -1) {
    throw new ApiError(404, "Skill not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.skills[skillIndex],
        "Skill fetched successfully!"
      )
    );
});

// Update Skills Controller
export const updateSkillsController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the skill by id
   * TODO: Update skill data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { skill, level } = req.body;

  // * Find the skill by id
  const resumeId = req.params._id;
  const skillId = req.query.sid;

  const resume = await Resume.findById(resumeId);

  const skillIndex = resume.skills.findIndex(
    (item) => item._id.toString() === skillId
  );
  if (skillIndex === -1) {
    throw new ApiError(404, "Skill not found");
  }

  // * Update link data
  const skillToUpdate = resume.skills[skillIndex];

  skillToUpdate.skill = skill;
  skillToUpdate.level = level;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.skills[skillIndex],
        "Skill updated successfully!"
      )
    );
});

// Delete Skills Controller
export const deleteSkillsController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get skill from request
   * TODO: Delete skill
   * TODO: Sending Response
   * **/

  // * Get skill from request
  const resumeId = req.params._id;
  const skillId = req.query.sid;

  const resume = await Resume.findById(resumeId);

  const skillIndex = resume.skills.findIndex(
    (item) => item._id.toString() === skillId
  );
  if (skillIndex === -1) {
    throw new ApiError(404, "Skill not found");
  }

  // * Delete skill
  resume.skills.splice(skillIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedResume.skills, "Skill deleted successfully!")
    );
});
// ! Skills Controllers

// ! Languages Controllers
// Get All Languages Controller
export const getAllLanguagesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all languages
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all languages
  const languages = resume.languages;

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, languages, "Skills fetched successfully!"));
});

// Add Languages Controller
export const addLanguagesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get data from frontend
   * TODO: Add language in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { label, level } = req.body;

  // * Add language in Resume
  const newLanguage = { label, level };

  resume.languages.push(newLanguage);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedResume }, "Language added successfully!")
    );
});

// Detail Languages Controller
export const detailLanguagesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the language by id
   * TODO: Sending Response
   * **/

  // * Find the language by id
  const resumeId = req.params._id;
  const languageId = req.query.laid;

  const resume = await Resume.findById(resumeId);

  const languageIndex = resume.languages.findIndex(
    (item) => item._id.toString() === languageId
  );
  if (languageIndex === -1) {
    throw new ApiError(404, "Language not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.languages[languageIndex],
        "Skill fetched successfully!"
      )
    );
});

// Update Languages Controller
export const updateLanguagesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the language by id
   * TODO: Update language data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { label, level } = req.body;

  // * Find the language by id
  const resumeId = req.params._id;
  const languageId = req.query.laid;

  const resume = await Resume.findById(resumeId);

  const languageIndex = resume.languages.findIndex(
    (item) => item._id.toString() === languageId
  );
  if (languageIndex === -1) {
    throw new ApiError(404, "Language not found");
  }

  // * Update language data
  const languageToUpdate = resume.languages[languageIndex];

  languageToUpdate.label = label;
  languageToUpdate.level = level;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.languages[languageIndex],
        "Language updated successfully!"
      )
    );
});

// Delete Languages Controller
export const deleteLanguagesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get language from request
   * TODO: Delete language
   * TODO: Sending Response
   * **/

  // * Get language from request
  const resumeId = req.params._id;
  const languageId = req.query.laid;

  const resume = await Resume.findById(resumeId);

  const languageIndex = resume.languages.findIndex(
    (item) => item._id.toString() === languageId
  );
  if (languageIndex === -1) {
    throw new ApiError(404, "Language not found");
  }

  // * Delete language
  resume.languages.splice(languageIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.languages,
        "Language deleted successfully!"
      )
    );
});
// ! Languages Controllers

// ! Courses Controllers
// Get All Courses Controller
export const getAllCoursesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all courses
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all courses
  const courses = resume.courses;

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully!"));
});

// Add Courses Controller
export const addCoursesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get data from frontend
   * TODO: Add course in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { title, institute, startDate, endDate, city, description } = req.body;

  // * Add course in Resume
  const newCourse = {
    title,
    institute,
    startDate,
    endDate,
    city,
    description,
  };

  resume.courses.push(newCourse);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedResume }, "Course added successfully!")
    );
});

// Detail Courses Controller
export const detailCoursesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the course by id
   * TODO: Sending Response
   * **/

  // * Find the course by id
  const resumeId = req.params._id;
  const courseId = req.query.cid;

  const resume = await Resume.findById(resumeId);

  const courseIndex = resume.courses.findIndex(
    (item) => item._id.toString() === courseId
  );
  if (courseIndex === -1) {
    throw new ApiError(404, "Course not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.courses[courseIndex],
        "Course fetched successfully!"
      )
    );
});

// Update Courses Controller
export const updateCoursesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the course by id
   * TODO: Update course data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { title, institute, startDate, endDate, city, description } = req.body;

  // * Find the course by id
  const resumeId = req.params._id;
  const courseId = req.query.cid;

  const resume = await Resume.findById(resumeId);

  const courseIndex = resume.courses.findIndex(
    (item) => item._id.toString() === courseId
  );
  if (courseIndex === -1) {
    throw new ApiError(404, "Course not found");
  }

  // * Update course data
  const courseToUpdate = resume.courses[courseIndex];

  courseToUpdate.title = title;
  courseToUpdate.institute = institute;
  courseToUpdate.startDate = startDate;
  courseToUpdate.endDate = endDate;
  courseToUpdate.city = city;
  courseToUpdate.description = description;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.courses[courseIndex],
        "Course updated successfully!"
      )
    );
});

// Delete Courses Controller
export const deleteCoursesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get course from request
   * TODO: Delete course
   * TODO: Sending Response
   * **/

  // * Get course from request
  const resumeId = req.params._id;
  const courseId = req.query.cid;

  const resume = await Resume.findById(resumeId);

  const courseIndex = resume.courses.findIndex(
    (item) => item._id.toString() === courseId
  );
  if (courseIndex === -1) {
    throw new ApiError(404, "Course not found");
  }

  // * Delete course
  resume.courses.splice(courseIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.courses,
        "Course deleted successfully!"
      )
    );
});
// ! Courses Controllers

// ! Internship Controller
// Get All Internship Controller
export const getAllInternshipController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all internship
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all internship
  const internships = resume.internships;

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, internships, "Internships fetched successfully!")
    );
});

// Add Internship Controller
export const addInternshipController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Rresume from request
   * TODO: Get data from frontend
   * TODO: Add internship in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { title, employer, startDate, endDate, city, description } = req.body;

  // * Add Internship in Resume
  const newInternship = {
    title,
    employer,
    startDate,
    endDate,
    city,
    description,
  };

  resume.internships.push(newInternship);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.internships,
        "Internship added successfully!"
      )
    );
});

// Detail Internship Controller
export const detailInternshipController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the internship by id
   * TODO: Sending Response
   * **/

  // * Find the internship by id
  const resumeId = req.params._id;
  const internshipId = req.query.iid;

  const resume = await Resume.findById(resumeId);

  const internshipIndex = resume.internships.findIndex(
    (item) => item._id.toString() === internshipId
  );
  if (internshipIndex === -1) {
    throw new ApiError(404, "Internship not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.internships[internshipIndex],
        "Internship fetched successfully!"
      )
    );
});

// Update Internship Controller
export const updateInternshipController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the internship by id
   * TODO: Update internship data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { title, employer, startDate, endDate, city, description } = req.body;

  // * Find the internship by id
  const resumeId = req.params._id;
  const internshipId = req.query.iid;

  const resume = await Resume.findById(resumeId);

  const internshipIndex = resume.internships.findIndex(
    (item) => item._id.toString() === internshipId
  );
  if (internshipIndex === -1) {
    throw new ApiError(404, "Internship not found");
  }

  // * Update internship data
  const internshipToUpdate = resume.internships[internshipIndex];

  internshipToUpdate.title = title;
  internshipToUpdate.employer = employer;
  internshipToUpdate.startDate = startDate;
  internshipToUpdate.endDate = endDate;
  internshipToUpdate.city = city;
  internshipToUpdate.description = description;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.internships[internshipIndex],
        "Internship updated successfully!"
      )
    );
});

// Delete Internship Controller
export const deleteInternshipController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get internship from request
   * TODO: Delete internship
   * TODO: Sending Response
   * **/

  // * Get internship from request
  const resumeId = req.params._id;
  const internshipId = req.query.iid;

  const resume = await Resume.findById(resumeId);

  const internshipIndex = resume.internships.findIndex(
    (item) => item._id.toString() === internshipId
  );
  if (internshipIndex === -1) {
    throw new ApiError(404, "Internship not found");
  }

  // * Delete Internship
  resume.internships.splice(internshipIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.internships,
        "Internship deleted successfully!"
      )
    );
});
// ! Internship Controller

// ! Hobbies Controllers
// Get All Hobbies Controller
export const getAllHobbiesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all hobbies
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all hobbies
  const hobbies = resume.hobbies;

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, hobbies, "Hobbies fetched successfully!"));
});

// Add Hobbies Controller
export const addHobbiesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get data from frontend
   * TODO: Add hobbie in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { label } = req.body;

  // * Add Hobbie in Resume
  const newHobbie = { label };

  resume.hobbies.push(newHobbie);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.hobbies,
        "Internship added successfully!"
      )
    );
});

// Detail Hobbies Controller
export const detailHobbiesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the hobbie by id
   * TODO: Sending Response
   * **/

  // * Find the hobbie by id
  const resumeId = req.params._id;
  const hobbieId = req.query.hid;

  const resume = await Resume.findById(resumeId);

  const hobbieIndex = resume.hobbies.findIndex(
    (item) => item._id.toString() === hobbieId
  );
  if (hobbieIndex === -1) {
    throw new ApiError(404, "Hobbie not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.hobbies[hobbieIndex],
        "Hobbie fetched successfully!"
      )
    );
});

// Update Hobbies Controller
export const updateHobbiesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the hobbie by id
   * TODO: Update hobbie data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { label } = req.body;

  // * Find the hobbie by id
  const resumeId = req.params._id;
  const hobbieId = req.query.hid;

  const resume = await Resume.findById(resumeId);

  const hobbieIndex = resume.hobbies.findIndex(
    (item) => item._id.toString() === hobbieId
  );
  if (hobbieIndex === -1) {
    throw new ApiError(404, "Hobbie not found");
  }

  // * Update hobbie data
  const hobbieToUpdate = resume.hobbies[hobbieIndex];

  hobbieToUpdate.label = label;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.hobbies[hobbieIndex],
        "Hobbie updated successfully!"
      )
    );
});

// Delete Hobbies Controller
export const deleteHobbiesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get hobbie from request
   * TODO: Delete hobbie
   * TODO: Sending Response
   * **/

  // * Get hobbie from request
  const resumeId = req.params._id;
  const hobbieId = req.query.hid;

  const resume = await Resume.findById(resumeId);

  const hobbieIndex = resume.hobbies.findIndex(
    (item) => item._id.toString() === hobbieId
  );
  if (hobbieIndex === -1) {
    throw new ApiError(404, "Hobbie not found");
  }

  // * Delete Hobbie
  resume.hobbies.splice(hobbieIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.hobbies,
        "Hobbie deleted successfully!"
      )
    );
});
// ! Hobbies Controllers

// ! References Controllers
// Get All References Controller
export const getAllReferencesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all references
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all references
  const references = resume.references;

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, references, "References fetched successfully!"));
});

// Add References Controller
export const addReferencesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get data from frontend
   * TODO: Add references in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { referenceFullname, company, phone, email } = req.body;

  // * Add Reference in Resume
  const newreference = { referenceFullname, company, phone, email };

  resume.references.push(newreference);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.references,
        "Reference added successfully!"
      )
    );
});

// Detail References Controller
export const detailReferencesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the reference by id
   * TODO: Sending Response
   * **/

  // * Find the hobbie by id
  const resumeId = req.params._id;
  const referenceId = req.query.rid;

  const resume = await Resume.findById(resumeId);

  const referenceIndex = resume.references.findIndex(
    (item) => item._id.toString() === referenceId
  );
  if (referenceIndex === -1) {
    throw new ApiError(404, "Reference not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.references[referenceIndex],
        "Reference fetched successfully!"
      )
    );
});

// Update References Controller
export const updateReferencesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the reference by id
   * TODO: Update reference data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { referenceFullname, company, phone, email } = req.body;

  // * Find the hobbie by id
  const resumeId = req.params._id;
  const referenceId = req.query.rid;

  const resume = await Resume.findById(resumeId);

  const referenceIndex = resume.references.findIndex(
    (item) => item._id.toString() === referenceId
  );
  if (referenceIndex === -1) {
    throw new ApiError(404, "Reference not found");
  }

  // * Update hobbie data
  const referenceToUpdate = resume.references[referenceIndex];

  referenceToUpdate.referenceFullname = referenceFullname;
  referenceToUpdate.company = company;
  referenceToUpdate.phone = phone;
  referenceToUpdate.email = email;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.references[referenceIndex],
        "Reference updated successfully!"
      )
    );
});

// Delete References Controller
export const deleteReferencesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get reference from request
   * TODO: Delete reference
   * TODO: Sending Response
   * **/

  // * Get reference from request
  const resumeId = req.params._id;
  const referenceId = req.query.rid;

  const resume = await Resume.findById(resumeId);

  const referenceIndex = resume.references.findIndex(
    (item) => item._id.toString() === referenceId
  );
  if (referenceIndex === -1) {
    throw new ApiError(404, "Reference not found");
  }

  // * Delete Reference
  resume.references.splice(referenceIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.references,
        "Reference deleted successfully!"
      )
    );
});
// ! References Controllers

// ! Extra Curricular Controllers
// Get All Curricular Controller
export const getAllCurricularController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all curricular
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all curricular
  const curricular = resume.extraCurricular;

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, curricular, "Extra Curricular fetched successfully!")
    );
});

// Add Curricular Controller
export const addCurricularController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Rresume from request
   * TODO: Get data from frontend
   * TODO: Add curricular in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { title, employer, startDate, endDate, city, description } = req.body;

  // * Add Curricular in Resume
  const newCurricular = {
    title,
    employer,
    startDate,
    endDate,
    city,
    description,
  };

  resume.extraCurricular.push(newCurricular);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.extraCurricular,
        "Extra Curricular added successfully!"
      )
    );
});

// Detail Curricular Controller
export const detailCurricularController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the curricular by id
   * TODO: Sending Response
   * **/

  // * Find the curricular by id
  const resumeId = req.params._id;
  const curricularId = req.query.ecid;

  const resume = await Resume.findById(resumeId);

  const curricularIndex = resume.extraCurricular.findIndex(
    (item) => item._id.toString() === curricularId
  );
  if (curricularIndex === -1) {
    throw new ApiError(404, "Extra Curricular not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.extraCurricular[curricularIndex],
        "Extra Curricular fetched successfully!"
      )
    );
});

// Update Curricular Controller
export const updateCurricularController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the curricular by id
   * TODO: Update curricular data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { title, employer, startDate, endDate, city, description } = req.body;

  // * Find the internship by id
  const resumeId = req.params._id;
  const curricularId = req.query.ecid;

  const resume = await Resume.findById(resumeId);

  const curricularIndex = resume.extraCurricular.findIndex(
    (item) => item._id.toString() === curricularId
  );
  if (curricularIndex === -1) {
    throw new ApiError(404, "Extra Curricular not found");
  }

  // * Update curricular data
  const curricularToUpdate = resume.extraCurricular[curricularIndex];

  curricularToUpdate.title = title;
  curricularToUpdate.employer = employer;
  curricularToUpdate.startDate = startDate;
  curricularToUpdate.endDate = endDate;
  curricularToUpdate.city = city;
  curricularToUpdate.description = description;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.extraCurricular[curricularIndex],
        "Extra Curricular updated successfully!"
      )
    );
});

// Delete Curricular Controller
export const deleteCurricularController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get curricular from request
   * TODO: Delete curricular
   * TODO: Sending Response
   * **/

  // * Get curricular from request
  const resumeId = req.params._id;
  const curricularId = req.query.ecid;

  const resume = await Resume.findById(resumeId);

  const curricularIndex = resume.extraCurricular.findIndex(
    (item) => item._id.toString() === curricularId
  );
  if (curricularIndex === -1) {
    throw new ApiError(404, "Extra Curricular not found");
  }

  // * Delete curricular
  resume.extraCurricular.splice(curricularIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.extraCurricular,
        "Extra Curricular deleted successfully!"
      )
    );
});
// ! Extra Curricular Controllers

// ! Custom Section Controllers
// Get All Custom Section Controller
export const getAllCustomSectionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get all custom section
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get all custom section
  const customSection = resume.customSections;

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        customSection,
        "Custom Section fetched successfully!"
      )
    );
});

// Add Custom Section Controller
export const addCustomSectionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Resume from request
   * TODO: Get data from frontend
   * TODO: Add custom section in resume
   * TODO: Sending Response
   * **/

  // * Get Resume from request
  const resumeId = req.params._id;
  const resume = await Resume.findById(resumeId);

  // * Get data from frontend
  const { title, startDate, endDate, city, description } = req.body;

  // * Add Custom Section in Resume
  const newCustomSection = {
    title,
    startDate,
    endDate,
    city,
    description,
  };

  resume.customSections.push(newCustomSection);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.customSections,
        "Custom Section added successfully!"
      )
    );
});

// Detail Custom Section Controller
export const detailCustomSectionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Find the custom section by id
   * TODO: Sending Response
   * **/

  // * Find the custom section by id
  const resumeId = req.params._id;
  const customSectionId = req.query.csid;

  const resume = await Resume.findById(resumeId);

  const customSectionIndex = resume.customSections.findIndex(
    (item) => item._id.toString() === customSectionId
  );
  if (customSectionIndex === -1) {
    throw new ApiError(404, "Custom Section not found");
  }

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resume.customSections[customSectionIndex],
        "Custom Section fetched successfully!"
      )
    );
});

// Update Custom Section Controller
export const updateCustomSectionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Find the custom section by id
   * TODO: Update custom section data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { title, startDate, endDate, city, description } = req.body;

  // * Find the custom section by id
  const resumeId = req.params._id;
  const customSectionId = req.query.csid;

  const resume = await Resume.findById(resumeId);

  const customSectionIndex = resume.customSections.findIndex(
    (item) => item._id.toString() === customSectionId
  );
  if (customSectionIndex === -1) {
    throw new ApiError(404, "Custom Section not found");
  }

  // * Update custom section data
  const customSectionToUpdate = resume.customSections[customSectionIndex];

  customSectionToUpdate.title = title;
  customSectionToUpdate.startDate = startDate;
  customSectionToUpdate.endDate = endDate;
  customSectionToUpdate.city = city;
  customSectionToUpdate.description = description;

  const updatedResume = await resume.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.customSections[customSectionIndex],
        "Custom Section updated successfully!"
      )
    );
});

// Delete Custom Section Controller
export const deleteCustomSectionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get custom section from request
   * TODO: Delete custom section
   * TODO: Sending Response
   * **/

  // * Get custom section from request
  const resumeId = req.params._id;
  const cuistomSectionId = req.query.csid;

  const resume = await Resume.findById(resumeId);

  const customSectionIndex = resume.customSections.findIndex(
    (item) => item._id.toString() === cuistomSectionId
  );
  if (customSectionIndex === -1) {
    throw new ApiError(404, "Custom Section not found");
  }

  // * Delete custom section
  resume.customSections.splice(customSectionIndex, 1);
  const updatedResume = await resume.save();

  // * Sending Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedResume.customSections,
        "Custom Section deleted successfully!"
      )
    );
});
// ! Custom Section Controllers

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

    //  Get All Links
    case "get-all-links":
      getAllLinksController(req, res);
      break;

    //  Add Link
    case "add-link":
      addLinksController(req, res);
      break;

    //  Detail Link
    case "detail-link":
      detailLinksController(req, res);
      break;

    //  Update Link
    case "update-link":
      updateLinksController(req, res);
      break;

    //  Delete Link
    case "delete-link":
      deleteLinksController(req, res);
      break;

    //  Get All Skills
    case "get-all-skills":
      getAllSkillsController(req, res);
      break;

    //  Add skill
    case "add-skill":
      addSkillsController(req, res);
      break;

    //  Detail Skill
    case "detail-skill":
      detailSkillsController(req, res);
      break;

    //  Update Skill
    case "update-skill":
      updateSkillsController(req, res);
      break;

    //  Delete Skill
    case "delete-skill":
      deleteSkillsController(req, res);
      break;

    //  Get All Languages
    case "get-all-languages":
      getAllLanguagesController(req, res);
      break;

    //  Add language
    case "add-language":
      addLanguagesController(req, res);
      break;

    //  Detail language
    case "detail-language":
      detailLanguagesController(req, res);
      break;

    //  Update language
    case "update-language":
      updateLanguagesController(req, res);
      break;

    //  Delete language
    case "delete-language":
      deleteLanguagesController(req, res);
      break;

    //  Get All Courses
    case "get-all-courses":
      getAllCoursesController(req, res);
      break;

    //  Add course
    case "add-course":
      addCoursesController(req, res);
      break;

    //  Detail course
    case "detail-course":
      detailCoursesController(req, res);
      break;

    //  Update course
    case "update-course":
      updateCoursesController(req, res);
      break;

    //  Delete course
    case "delete-course":
      deleteCoursesController(req, res);
      break;

    //  Get All Internships
    case "get-all-internship":
      getAllInternshipController(req, res);
      break;

    //  Add internship
    case "add-internship":
      addInternshipController(req, res);
      break;

    //  Detail internship
    case "detail-internship":
      detailInternshipController(req, res);
      break;

    //  Update internship
    case "update-internship":
      updateInternshipController(req, res);
      break;

    //  Delete internship
    case "delete-internship":
      deleteInternshipController(req, res);
      break;

    //  Get All Hobbies
    case "get-all-hobbies":
      getAllHobbiesController(req, res);
      break;

    //  Add hobbie
    case "add-hobbie":
      addHobbiesController(req, res);
      break;

    //  Detail hobbie
    case "detail-hobbie":
      detailHobbiesController(req, res);
      break;

    //  Update hobbie
    case "update-hobbie":
      updateHobbiesController(req, res);
      break;

    //  Delete hobbie
    case "delete-hobbie":
      deleteHobbiesController(req, res);
      break;

    //  Get All references
    case "get-all-references":
      getAllReferencesController(req, res);
      break;

    //  Add reference
    case "add-reference":
      addReferencesController(req, res);
      break;

    //  Detail reference
    case "detail-reference":
      detailReferencesController(req, res);
      break;

    //  Update reference
    case "update-reference":
      updateReferencesController(req, res);
      break;

    //  Delete reference
    case "delete-reference":
      deleteReferencesController(req, res);
      break;

    //  Get All Curricular
    case "get-all-curricular":
      getAllCurricularController(req, res);
      break;

    //  Add curricular
    case "add-curricular":
      addCurricularController(req, res);
      break;

    //  Detail curricular
    case "detail-curricular":
      detailCurricularController(req, res);
      break;

    //  Update curricular
    case "update-curricular":
      updateCurricularController(req, res);
      break;

    //  Delete curricular
    case "delete-curricular":
      deleteCurricularController(req, res);
      break;

    //  Get All Custom Sections
    case "get-all-custom-sections":
      getAllCustomSectionController(req, res);
      break;

    //  Add custom section
    case "add-custom-section":
      addCustomSectionController(req, res);
      break;

    //  Detail custom section
    case "detail-custom-section":
      detailCustomSectionController(req, res);
      break;

    //  Update custom section
    case "update-custom-section":
      updateCustomSectionController(req, res);
      break;

    //  Delete custom section
    case "delete-custom-section":
      deleteCustomSectionController(req, res);
      break;

    default:
      res.status(400).json({ error: "Invalid action" });
  }
});
