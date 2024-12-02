import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus, faEye, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const MySwal = withReactContent(Swal);

const handleIconClick = async (
  applicationId,
  action,
  resumeUrl = "",
  resumeFilename = "",
  interviewDateTime = ""
) => {
  if (action === "viewResume") {
    await MySwal.fire({
      title: "Resume",
      html: `
        <img src="${resumeUrl}" width="80%" height="400">
        <br>
        <a href="${resumeUrl}" download="${resumeFilename}" class="swal2-confirm swal2-styled">
          Download Resume
        </a>
      `,
      width: "80%",
      showCancelButton: true,
      cancelButtonText: "Close",
      showConfirmButton: false,
    });
  } else if (action === "updateStatus") {
    const { value: status } = await MySwal.fire({
      title: "Update Application Status",
      input: "select",
      inputOptions: {
        Received: "Received",
        Reviewing: "Reviewing",
        Accept: "Accept",
        Reject: "Reject",
        Hired: "Hired",
      },
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You need to select a status!";
        }
      },
    });

    if (status) {
      if (status === "Accept") {
        const { value: interviewDateTime } = await MySwal.fire({
          title: "Schedule Interview",
          html: '<input id="swal-input1" className="swal2-input" type="datetime-local">',
          showCancelButton: true,
          confirmButtonText: "Schedule",
          cancelButtonText: "Cancel",
          preConfirm: () => {
            return document.getElementById("swal-input1").value;
          },
        });

        if (interviewDateTime) {
          try {
            await axios.post(
              `http://localhost:5000/api/v1/application/${applicationId}/status`,
              {
                status,
                interviewDateTime,
              }
            );
            console.log("Interview scheduled for:", interviewDateTime);
          } catch (error) {
            console.error("Error scheduling interview:", error);
          }
        }
      } else {
        try {
          await axios.post(
            `http://localhost:5000/api/v1/application/${applicationId}/status`,
            {
              status,
            }
          );
          console.log("Status:", status);
        } catch (error) {
          console.error("Error updating status:", error);
        }
      }
    }
  } else if (action === "viewSchedule") {
    await MySwal.fire({
      title: "Interview Schedule",
      text: `Interview scheduled for: ${interviewDateTime}`,
      showCancelButton: true,
      cancelButtonText: "Close",
      showConfirmButton: false,
    });
  }
};

const Applicat = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: jobId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/application/applicants/${jobId}`,
          { withCredentials: true }
        );
        setApplications(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applicant data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Applicant List</h2>
      <div className="card-container">
        {applications.length > 0 ? (
          applications.map((applicant, index) => (
            <div className="carda" key={index}>
              <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="Denim Jeans"
                style={{ width: "100%" }}
              />
              <p>Name:{applicant.name}</p>
              <p className="price">Email:{applicant.email}</p>
              <p>Phone:{applicant.phone}</p>
              <button
                className={`status-button ${
                  applicant.status === "Accept"
                    ? "accept"
                    : applicant.status === "Reject"
                    ? "reject"
                    : applicant.status === "Reviewing"
                    ? "reviewing"
                    : ""
                }`}
              >
                Status: {applicant.status}
              </button>
              {applicant.status === "Accept" && (
                <p> </p>
              )}
              <button className="svg-button" fdprocessedid="m3qyd">
                <FontAwesomeIcon
                  icon={faEye}
                  onClick={() =>
                    handleIconClick(
                      applicant._id,
                      "viewResume",
                      applicant.resume.url
                    )
                  }
                />
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  onClick={() =>
                    handleIconClick(
                      applicant._id,
                      "viewSchedule",
                      "",
                      "",
                      applicant.interviewDateTime
                    )
                  }
                />
                <FontAwesomeIcon
                  icon={faSearchPlus}
                  onClick={() =>
                    handleIconClick(
                      applicant._id,
                      "updateStatus",
                      applicant.resume.url
                    )
                  }
                />
              </button>
            </div>
          ))
        ) : (
          <div>No applications found</div>
        )}
      </div>
    </>
  );
};

export default Applicat;
