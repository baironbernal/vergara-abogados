// src/hooks/useContactForm.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "../Components/Shared/Form/schema";

export const useContactForm = (onSuccess) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "Bairon",
      email: "bbernal@gmail.com",
      phone: "828282222",
      observations: "JAJAJJAJAJAJJAJAJAJAJA",
      lawyer_id: "",
      agree: true,
    },
    mode: "onBlur",
  });

  const onSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 600)); // fake API
    console.log("Form submitted:", values);

    if (onSuccess) {
      onSuccess(values); 
    }

    reset();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isSubmitSuccessful,
  };
};