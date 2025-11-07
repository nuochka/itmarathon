import { useRef } from "react";
import Toaster from "../toaster/Toaster";
import type { ToasterHandler, ShowToaster } from "../toaster/types";
import type { DeleteUserButtonProps } from "./types";
import deleteIcon from "@assets/images/icons/delete.svg";
import "./DeleteButton.scss";

const DeleteUserButton = ({
  userId,
  userCode,
  buttonColor = "green",
  successMessage = "User successfully removed!",
  errorMessage = "Failed to remove user. Try again.",
  onUserDeleted,
}: DeleteUserButtonProps & { userCode: string }) => {
  const toasterRef = useRef<ToasterHandler>(null);

  const showToaster: ShowToaster = (message, type) => {
    toasterRef.current?.show(message, type, "small");
  };

  const API_BASE = "https://secretbuochka-backend.onrender.com/api";

    const handleClick = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}?userCode=${userCode}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Delete request failed");

      showToaster(successMessage, "success", "small");
      onUserDeleted?.();
    } catch (error) {
      console.error(error);
      showToaster(errorMessage, "error", "small");
    }
  };


  return (
    <div className="delete-button" onClick={handleClick}>
      <img
        src={deleteIcon}
        alt="Delete"
        className="delete-button__icon"
        style={{ filter: "invert(29%) sepia(23%) saturate(1571%) hue-rotate(135deg) brightness(82%) contrast(92%)" }}
      />
      <Toaster className="delete-button__toaster" ref={toasterRef} />
    </div>
  );
};

export default DeleteUserButton;
