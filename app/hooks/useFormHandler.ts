import { useState } from "react";

export default function useFormHandler<T extends { [field: string]: any }>(fields: T) {
  const newFields: T = JSON.parse(JSON.stringify(fields));
  const [formData, setFormData] = useState(newFields);

  const handleFormInputChange =
    (name: keyof typeof formData, mode?: "static") =>
      (event: any) => {
        let eventData;
        if (mode === "static") {
          eventData = event;
        } else {
          eventData = event.target.value
        }

        setFormData((prev) => ({
          ...prev,
          [name]: eventData,
        }));
      };

  return { formData, setFormData, handleFormInputChange };
}
