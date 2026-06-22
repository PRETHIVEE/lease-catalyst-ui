/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "./NotificationCard.scss";
import { X } from "lucide-react";
import { formatDateTime } from "@/utils/utils";
import { useNavigate } from "react-router-dom";

type Props = {
  title?: string;
  timeAgo?: string;
  onClose: () => void;
  handleReadNotifications: (id: number) => void;
  data: any;
};

const NotificationCard: React.FC<Props> = ({
  onClose,
  data,
  handleReadNotifications,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (data?.workflow_name === "DQC") {
      navigate(`/dashboard/document-qc?jobId=${data.job_id}`);
    } else {
      navigate(
        `/projects/project-details/property-details?projectId=${data?.project_id}&propertyId=${data?.property_id}`,
        {
          state: { tab: "lease-abstraction" },
        },
      );
    }
    onClose();
  };

  return (
    <div className="notification-card shadow-card" role="article">
      <div className="notification-left" onClick={handleNavigation}>
        <div className="notification-icon" aria-hidden>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              fill="#64748B"
            />
          </svg>
        </div>
      </div>

      <div className="notification-body" onClick={handleNavigation}>
        <div className="notification-title">
          <strong>{data?.workflow_name}</strong> has been{" "}
          <strong>
            {data?.workflow_status === "Error" ? "Error" : "Completed"}
          </strong>{" "}
          for the property <strong>{data?.property_name}</strong>
        </div>

        <div className="notification-time">
          {formatDateTime(data?.workflow_status_updated_at)}
        </div>
      </div>

      <div style={{ paddingInline: "0.5rem", cursor: "pointer" }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleReadNotifications(data?.id);
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
