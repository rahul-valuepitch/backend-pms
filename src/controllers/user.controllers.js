import User from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import {
  notEmptyValidation,
  emailValidation,
  minLengthValidation,
  compareFieldValidation,
} from "../utils/validators.js";
import { generateAccessRefreshToken, options } from "../utils/generateToken.js";

// Create User Profile
export const createUserProfileController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Validate data
   * TODO: Check if the user exists
   * TODO: Create a new User
   * TODO: Check if the user is created
   * TODO: Generate Access & Refresh Token
   * TODO: Send Response to user
   * **/

  // * Get data from frontend
  const { name, email, password, password2 } = req.body;

  // * Validate data
  notEmptyValidation([name, email, password, password2]);
  emailValidation(email);
  minLengthValidation(password, 6, "Password");
  compareFieldValidation(password, password2, "Password does not match");

  // * Check if the user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exsists");
  }

  // * Create a new user
  const createdUser = await User.create({
    fullName: name,
    email,
    password,
  });

  // * Check if the user is created
  const user = await User.findById(createdUser._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(400, "Error creating user");

  // * Generate Access & Refresh Token
  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  // * Sending Response
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201, user, "User created successfully!"));
});
