import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import {
  notEmptyValidation,
  emailValidation,
  minLengthValidation,
  compareFieldValidation,
  phoneValidation,
} from "../utils/validators.js";
import {
  generate20CharToken,
  generateAccessRefreshToken,
  generatePasswordResetToken,
  options,
} from "../utils/generateToken.js";
import { sendPasswordResetEmail } from "../configs/email.config.js";

// Register Controller
export const registerController = asyncHandler(async (req, res) => {
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

// Login Controller
export const loginController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from user
   * TODO: Validate data
   * TODO: Check if user exists
   * TODO: Check Password
   * TODO: Generate Token
   * TODO: Sending Response
   * **/

  // * Get data from user
  const { email, password } = req.body;

  // * Validate data
  notEmptyValidation([email, password]);
  emailValidation(email);
  minLengthValidation(password, 6, "Password");

  // * Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  // * Check Password
  const passwordCheck = await user.isPasswordCorrect(password);
  if (!passwordCheck) {
    throw new ApiError(401, "Invalid password");
  }

  // * Generate Token
  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // * Sending Response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully!"
      )
    );
});

// Logout Controller
export const logoutController = asyncHandler(async (req, res) => {
  /**
   * TODO: Update token in backend
   * TODO: Delete cookie from frontend
   * TODO: Sending Response
   * **/

  // * Update token in backend
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  // * Sending Response & Delete cookie from frontend
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out!"));
});

// Refresh Access Token Controller
export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Refresh token from cookie
   * TODO: Decode Refresh Token
   * TODO: Check if user exists
   * TODO: Compare cookie refresh token with refresh token stored in database
   * TODO: Generate new access token
   * TODO: Sending Response
   * **/

  // * Get Refresh token from cookie
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Unauthorized Request");
  }

  try {
    // * Decode refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // * Check if user exists
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(400, "Invalid refresh token");
    }

    // * Compare cookie refresh token with refresh token stored in database
    if (incomingRefreshToken !== user?.refreshToken) {
      res.status(401).json({ message: "Refres token is expired!" });
    }

    // * Generate new access token
    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      user._id
    );

    // * Sending Response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refreshed!"
        )
      );
  } catch (error) {
    throw new ApiError(400, error.message || "Invalid refresh token");
  }
});

// Forgot Password Controller
export const forgotPasswordController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get email from frontend
   * TODO: Validate data
   * TODO: Check if user exists
   * TODO: Sending Email with password reset token
   * TODO: Sending Response
   * **/

  // * Get email from frontend
  const { email } = req.body;

  // * Validate data
  notEmptyValidation([email]);
  emailValidation(email);

  // * Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  // * Sending Email with password reset token
  const token = generate20CharToken();
  generatePasswordResetToken(user._id, token);
  sendPasswordResetEmail(user.email, user.fullName, token);

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset link sent to your email"));
});

// Forgot Password Request Controller
export const forgotPasswordRequestController = asyncHandler(
  async (req, res) => {
    /**
     * TODO: Get token from URL
     * TODO: Check if token is valid
     * TODO: Get data from Frontend
     * TODO: Validate data
     * TODO: Update new password
     * TODO: Sending Response
     * **/

    // * Get token from URL
    const { token } = req.query;

    // * Check if token is valid
    const user = await User.findOne({ passwordResetToken: token });
    if (!user) {
      throw new ApiError(400, "Invalid token");
    }

    const currentDate = new Date();
    if (currentDate > user.passwordResetTokenExpiry) {
      throw new ApiError(400, "Password reset token has expired");
    }

    // * Get data from Frontend
    const { password, password2 } = req.body;

    // * Validate data
    notEmptyValidation([password, password2]);
    minLengthValidation(password, 6, "Password");
    compareFieldValidation(password, password2, "Password does not match");

    // * Update new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();

    // * Sending Response
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password updated successfully!"));
  }
);

// Reset Password Controller
export const resetPasswordController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Validate data
   * TODO: check if old password is correct
   * TODO: Update password to new password
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const { oldPassword, password, password2 } = req.body;

  // * Validate data
  notEmptyValidation([oldPassword, password, password2]);
  minLengthValidation(password, 6, "Password");
  if (oldPassword === password) {
    throw new ApiError(400, "Old password cannot be same as new password");
  }
  compareFieldValidation(password, password2, "Password does not match");

  // * Check if old password is correct
  const user = await User.findById(req.user._id);
  const passwordCheck = await user.isPasswordCorrect(oldPassword);
  if (!passwordCheck) {
    throw new ApiError(400, "Old password is incorrect");
  }

  // * Update password to new password
  user.password = password;
  await user.save();

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully!"));
});

// Update User Profile Controller
export const updateProfileController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Validate data
   * TODO: Update user profile
   * TODO: Send Response with user profile
   * **/

  // * Get data from frontend
  const { phone, gender, birthDate, pronounce } = req.body;

  // * Validate data
  notEmptyValidation([phone, gender, birthDate]);
  phoneValidation(phone);

  // * Check if phone already exists
  const existingUser = await User.findOne({ phone });
  if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Phone number already exists"));
  }

  // * Update user profile
  const user = req.user;

  user.phone = phone;
  user.gender = gender;
  user.birthDate = birthDate;
  user.pronounce = pronounce;
  await user.save();

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully!"));
});

// Update User Avatar Controller
export const updateAvatarController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get File from frontend
   * TODO: Upload File
   * TODO: Sending Response
   * **/

  // * Get File from frontend
  const avatar = req.file?.path;
  if (!avatar) {
    throw new ApiError(400, "Please upload an image");
  }

  // * Upload file
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar } },
    { new: true }
  ).select("-password -refreshToken");

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image uploaded successfully!"));
});

// Remove User Avatar Controller
export const removeAvatarController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get User from request and remove avatar
   * TODO: Sending Response
   * **/

  // * Get User from request and remove avatar
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $unset: { avatar: "" } },
    { new: true }
  );

  // * Sending Response
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar removed successfully!"));
});
