import { useMutation } from "@tanstack/react-query";
import api from "./axios";
import { showErrorToast, showSuccessToast } from "@/components/utils/toast-handler";

export function useExportDataBackup() {
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await api.get("/backup");

        if (!response || !response.data) {
          throw new Error("Invalid response received from server.");
        }

        const { data } = response.data;

        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(jsonBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `vault-export-${new Date().toISOString()}.json`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showSuccessToast("Export successful. File downloaded.");
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message || "Failed to export data."
        );
        throw error;
      }
    },
  });
}
