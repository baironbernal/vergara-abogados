// src/hooks/useContactForm.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "../Components/Shared/Form/schema";
import axios from 'axios';

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
      email: "baironbernal22@gmail.com",
      phone: "3133131313",
      observations: "testtesttesttesttesttesttesttesttest",
      lawyer_id: "2",
      agree: true,
    },
    mode: "onBlur",
  });

  const onSubmit = async (values) => {
    try {
      // Save partial data to database
      const response = await axios.post('/contacto/save-partial', {
        name: values.name,
        email: values.email,
        phone: values.phone,
        lawyer_id: values.lawyer_id,
        observations: values.observations,
      });

      if (response.data.success) {
        console.log("Form data saved:", response.data);

        if (onSuccess) {
          onSuccess(values, response.data.citation_id);
        }
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      // You might want to show an error message to the user here
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isSubmitSuccessful,
  };
};
