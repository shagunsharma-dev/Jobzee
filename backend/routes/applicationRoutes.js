import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
  getApplicationCountByJobId,
  getApplicantByJobId,updateApplicationStatus // Import the new controller
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, postApplication);
router.get("/employer/getall", isAuthenticated, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, jobseekerGetAllApplications);
router.delete("/delete/:id", isAuthenticated, jobseekerDeleteApplication);
router.get("/count/:jobId", isAuthenticated, getApplicationCountByJobId); // New route for counting applications by job ID
router.get("/applicants/:jobId", isAuthenticated, getApplicantByJobId); // New route for getting applicants by job ID
router.post("/:id/status", updateApplicationStatus);

export default router;
