import { toast } from "react-toastify";

const addFinToast = (
  type: "success" | "error" | "warning",
  message: string
) => {
  toast[type](message, { role: type === "error" ? "alert" : "status" });
};

export default addFinToast;
