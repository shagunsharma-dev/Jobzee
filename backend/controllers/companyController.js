import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Company } from "../models/companySchema.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from "cloudinary";

// Function to get all non-expired jobs
export const getCompany = catchAsyncErrors(async (req, res, next) => {
  //const jobs = await Company.find().sort({ title: 1 });
  const userId = req.user._id; // Assuming req.user contains authenticated user details
  const jobs = await Company.find({ postedBy: userId }).sort({ title: 1 });

  res.status(200).json({
    success: true,
    jobs,
  });
});

// Function to post a new company
export const postCompany = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  const { title, description, url, country, city, location, email, tag } = req.body;

  const requiredFields = { title, description, url, country, city, location, email, tag };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return next(new ErrorHandler(`Please provide a ${key}.`, 400));
    }
  }

  const postedBy = req.user._id;
  const company = await Company.create({
    title,
    description,
    url,
    country,
    city,
    location,
    
    email,
    tag,
    postedBy,
  });

  res.status(200).json({
    success: true,
    message: "Company Created Successfully!",
    company,
  });
});

/* company edit */
export const getCompanyById = catchAsyncErrors(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
      return next(new ErrorHandler("Company not found", 404));
  }

  res.status(200).json({
      success: true,
      company,
  });
});
// Function to edit a company
export const updateCompanyById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const company = await Company.findById(id);

  if (!company) {
      return next(new ErrorHandler("Company not found", 404));
  }

  const updatedData = {
      title: req.body.title,
      description: req.body.description,
      url: req.body.url,
      country: req.body.country,
      city: req.body.city,
      location: req.body.location,
      email: req.body.email,
      tag: req.body.tag,
  };

  
  const updatedCompany = await Company.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
  });

  res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
  });
});

export const deleteCompany = catchAsyncErrors(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return next(new ErrorHandler("Company not found", 404));
  }

  await Company.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Company deleted successfully",
  });
});