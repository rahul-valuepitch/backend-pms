import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["resume", "cover letter"],
    },
    name: { type: String },
    description: { type: String },
    file: { type: String, unique: true },
  },
  { timestamps: true }
);

// * Generate File Name Method
TemplateSchema.methods.generateFileName = function () {
  const modifiedType = this.type.replace(/\s+/g, "-");
  const modifiedName = this.name.replace(/\s+/g, "-");

  return `${modifiedType}-${modifiedName}-template`;
};

// * Generate a file name using pre hook
TemplateSchema.pre("save", function (next) {
  this.file = this.generateFileName();
  next();
});

const Template = mongoose.model("Template", TemplateSchema);

export default Template;
