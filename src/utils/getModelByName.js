import Resume from "../models/resume.models.js";
import Template from "../models/templates.models.js";
import User from "../models/user.models.js";

// Get Model by name
const getModelByName = (modelName) => {
  switch (modelName) {
    case "Resume":
      return Resume;
    case "Template":
      return Template;
    case "User":
      return User;
    default:
      return null;
  }
};

export default getModelByName;
