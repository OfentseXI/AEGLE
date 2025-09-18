import React from "react";

type StatusBadgeProps = {
  status: "pending" | "active" | "inactive";
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgClass = "";
  switch (status) {
    case "active":
      bgClass = "bg-green-100 text-green-800";
      break;
    case "inactive":
      bgClass = "bg-gray-100 text-gray-800";
      break;
    case "pending":
    default:
      bgClass = "bg-yellow-100 text-yellow-800";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgClass}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
