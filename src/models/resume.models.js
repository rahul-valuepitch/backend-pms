import mongoose from "mongoose";
import User from "./user.models.js";
import Template from "./templates.models.js";

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Template,
      required: true,
    },
    jobTitle: { type: String },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    drivingLicense: { type: String },
    nationality: { type: String },
    placeOfBirth: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    maritalStatus: { type: String },
    summary: { type: String },
    photo: { type: String },
    professions: [
      {
        title: { type: String },
        employer: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        city: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        school: { type: String },
        degree: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        city: { type: String },
        description: { type: String },
      },
    ],
    links: [
      {
        label: { type: String },
        link: { type: String },
      },
    ],
    skills: [
      {
        skill: { type: String },
        level: { type: String },
      },
    ],
    languages: [
      {
        label: { type: String },
        level: { type: String },
      },
    ],
    courses: [
      {
        title: { type: String },
        institute: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        city: { type: String },
        description: { type: String },
      },
    ],
    internships: [
      {
        title: { type: String },
        employer: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        city: { type: String },
        description: { type: String },
      },
    ],
    hobbies: [
      {
        label: { type: String },
      },
    ],
    references: [
      {
        referenceFullname: { type: String },
        company: { type: String },
        phone: { type: String },
        email: { type: String },
      },
    ],
    extraCurricular: [
      {
        title: { type: String },
        employer: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        city: { type: String },
        description: { type: String },
      },
    ],
    customSections: [
      {
        title: { type: String },
        city: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", ResumeSchema);

export default Resume;
