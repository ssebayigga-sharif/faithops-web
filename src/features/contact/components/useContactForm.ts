import { useCallback, useState } from "react";
import {
  ContactFormData,
  ContactFormErrors,
  hasErrors,
  INITIAL_CONTACT_FORM_DATA,
  validateContactForm,
} from "./validateContactForm";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface UseContactFormResult {
  formData: ContactFormData;
  errors: ContactFormErrors;
  status: SubmitStatus;
  errorMessage: string | null;
  handleChange: (field: keyof ContactFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  dismissNotification: () => void;
}

/**
 * Owns contact-form state, validation, and submission so the page component
 * stays presentational. Point `endpoint` at your real API route.
 */
export function useContactForm(
  endpoint = "/api/contact",
): UseContactFormResult {
  const [formData, setFormData] = useState<ContactFormData>(
    INITIAL_CONTACT_FORM_DATA,
  );
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const dismissNotification = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validateContactForm(formData);
      setErrors(validationErrors);

      if (hasErrors(validationErrors)) {
        setStatus("idle");
        return;
      }

      setStatus("submitting");
      setErrorMessage(null);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        setStatus("success");
        setFormData(INITIAL_CONTACT_FORM_DATA);
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      }
    },
    [formData, endpoint],
  );

  return {
    formData,
    errors,
    status,
    errorMessage,
    handleChange,
    handleSubmit,
    dismissNotification,
  };
}
