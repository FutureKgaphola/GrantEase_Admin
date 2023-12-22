import { Modal } from "antd";

export function success(message) {
    const modal = Modal.success({
      title: "Success notification",
      content: message,
    });
    setTimeout(() => modal.destroy(), 5000);
  }
export function failure(message) {
    const modal = Modal.error({
      title: "Failure notification",
      content: message,
    });
    setTimeout(() => modal.destroy(), 5000);
  }