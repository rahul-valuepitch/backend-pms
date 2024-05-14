import Template from "../models/templates.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { isValidObjectId, notEmptyValidation } from "../utils/validators.js";

// Create Template Controller
export const createTemplateController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from Frontend
   * TODO: Validate data
   * TODO: Save data
   * TODO: Sending Response
   * **/

  // * get data from Frontend
  const { type, name, description } = req.body;

  // * Validate data
  notEmptyValidation([type, name]);

  const existingTemplate = await Template.findOne({ type, name });
  if (existingTemplate) {
    throw new Error(
      `Template with the type '${type}' and name '${name}' already exists`
    );
  }

  // * Save data
  const newTemplate = new Template({ type, name, description });
  await newTemplate.save();

  // * Cehck if created
  const template = await Template.findById(newTemplate._id);
  if (!template) {
    throw new ApiError(400, "Error creating template");
  }

  // * Sending Response
  res
    .status(200)
    .json(new ApiResponse(200, template, "Template Created Successfully"));
});

// Get All Templates Controller
export const getAllTemplatesController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get all templates
   * TODO: Sending Response
   * **/

  // * Get all templates
  const templates = await Template.find();

  // * Sending Response
  res
    .status(200)
    .json(new ApiResponse(200, templates, "Templates Fetched Successfully"));
});

// Get Template Detail Controller
export const getTemplateDetailController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get id from request
   * TODO: Search for template
   * TODO: Sending Response
   * **/

  // * Get id from request
  const templateId = req.params._id;
  if (!isValidObjectId(templateId)) {
    throw new ApiError(400, "Invalid Template Id");
  }

  // * Search for template
  const template = await Template.findById(templateId);
  if (!template) {
    throw new ApiError(400, "Template not found");
  }

  //* Sending Response
  res
    .status(200)
    .json(new ApiResponse(200, template, "Template Fetched Successfully"));
});

// Update Template Controller
export const updateTemplateController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get id from request
   * TODO: Search template
   * TODO: Get data from frontend
   * TODO: Validate data
   * TODO: Update template
   * TODO: Sending Response
   * **/

  // * Get id from request
  const templateId = req.params._id;
  if (!isValidObjectId(templateId)) {
    throw new ApiError(400, "Invalid Template Id");
  }

  // * Search for template
  const currentTemplate = await Template.findById(templateId);
  if (!currentTemplate) {
    throw new ApiError(400, "Template not found");
  }

  // * Get data from frontend
  let { type, name, description } = req.body;

  // * Validate data
  if (!type) type = currentTemplate.type;
  if (!name) name = currentTemplate.name;
  if (!description) description = currentTemplate.description;

  console.log(type, name, description);

  const existingTemplate = await Template.findOne({
    type,
    name,
    _id: { $ne: templateId },
  });
  if (existingTemplate) {
    throw new Error(
      `Template with the type '${type}' and name '${name}' already exists`
    );
  }

  // * Update template
  currentTemplate.type = type;
  currentTemplate.name = name;
  currentTemplate.description = description;
  await currentTemplate.save();

  // * Sending Response
  res
    .status(200)
    .json(
      new ApiResponse(200, currentTemplate, "Template Updated Successfully")
    );
});

// Delete Template Controller
export const deleteTemplateController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get id from request
   * TODO: Search for template
   * TODO: Delete template
   * TODO: Send Response
   * **/

  // * Get id from request
  const templateId = req.params._id;
  if (!isValidObjectId(templateId)) {
    throw new ApiError(400, "Invalid Template Id");
  }

  // * Search for template
  const template = await Template.findById(templateId);
  if (!template) {
    throw new ApiError(400, "Template not found");
  }

  // * Delete template
  await Template.findByIdAndDelete(templateId);

  // * Sending Response
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Template Deleted Successfully"));
});
