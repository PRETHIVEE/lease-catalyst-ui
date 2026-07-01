/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "./NotificationCard.scss";
import { BookCheck, X } from "lucide-react";
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
        }
      );
    }
    onClose();
  };

  return (
    <div className="notification-card shadow-card" role="article">
      <div className="notification-left" onClick={handleNavigation}>
        <div className="notification-icon" aria-hidden>
          <BookCheck size={16} />
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
