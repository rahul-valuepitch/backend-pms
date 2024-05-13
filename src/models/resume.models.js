import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    jobTitle: { type: String },
    firstname: { type: String },
    middlename: { type: String },
    lastname: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    drivingLicense: { type: String },
    Nationality: { type: String },
    placeOfBirth: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    maritalStatus: { type: String },
    summary: { type: String },
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
