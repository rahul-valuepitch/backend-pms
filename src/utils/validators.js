import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";

// Email Validation
export const emailValidation = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please enter a valid email!");
  }
  return email;
};

// Phone Validation
export const phoneValidation = (phone) => {
  const phoneRegex = /^[0-9]{10,}$/;
  if (!phoneRegex.test(phone)) {
    throw new ApiError(
      400,
      "Please enter a valid phone number with at least 10 digits!"
    );
  }
  return phone;
};

// Not Empty Validation
export const notEmptyValidation = (fields) => {
  if (fields.some((field) => field?.trim() === "")) {
    throw new ApiError(400, "fields with * are required");
  }
  return fields;
};

// Minimum Length Validation
export const minLengthValidation = (input, length, fieldName = "Input") => {
  if (input.length <= length) {
    throw new ApiError(
      400,
      `${fieldName} length must be minimum ${length} characters`
    );
  }
  return length;
};

// Compare Field Validation
export const compareFieldValidation = (
  input1,
  input2,
  errMsg = "Inputs does not match"
) => {
  if (input1 !== input2) {
    throw new ApiError(400, errMsg);
  }
  return true;
};

// Is Valid ObjectId
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
