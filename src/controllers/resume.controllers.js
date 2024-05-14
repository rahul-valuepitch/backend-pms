import Resume from "../models/resume.models.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  emailValidation,
  notEmptyValidation,
  phoneValidation,
} from "../utils/validators.js";

// Adding Profile Detail Contoller
export const profileDetailController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Validate data
   * TODO: Save Data
   * TODO: Sending Response
   * **/

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
  notEmptyValidation([jobTitle, firstName, email, phone, summary]);
  emailValidation(email);
  phoneValidation(phone);

  // * Save Data
  const resume = new Resume({
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
    .status(201)
    .cookie("reseumId", resume._id)
    .json(new ApiResponse(201, resume, "Profile data saved!"));
});

// Add Profile Photo Controller
export const addProfilePhotoController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get file from frontend
   * TODO: Get current Resume from cookie
   * TODO: Upload File
   * TODO: Sending Response
   * **/

  // * Get file from frontend
  const photo = req.file?.path;
  if (!photo) {
    throw new ApiError(400, "Please upload an image");
  }

  // * Get Current Resume from cookie
  const resumeId = req.cookies.resumeId;
  if (!resumeId) {
    throw new ApiError(400, "Can't get current Resume");
  }

  // * Upload file
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new ApiError(400, "Resume not found");
  }
  resume.photo = photo;
  await resume.save();

  // * Sending Response
  return res
    .status(201)
    .json(new ApiResponse(201, resume, "Profile photo saved!"));
});

// Adding Profession Controller
export const addProfessionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Validate data
   * TODO: Save data
   * TODO: Send response
   * **/
});
