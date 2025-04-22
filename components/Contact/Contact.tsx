"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const contactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  position: z.string().min(1, "El puesto es requerido"),
  message: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log(data);
    // Here you would typically send the data to your backend
  };

  const inputClasses =
    "w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2A449E] focus:border-transparent text-black";
  const errorClasses = "text-red-500 text-sm mt-1";

  return (
    <section id="contacto" className="bg-[#1E1656] border-b-[4px]  border-white text-white py-20 px-4 bg-[url('/assets/background-form.svg')] bg-no-repeat">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">¿TIENES UN PROYECTO?</h2>
            <h3 className="text-2xl mb-6">Estamos aquí para ayudarte</h3>
            <p className="text-gray-300">
              Un asesor se pondrá en contacto para resolver sus consultas, o
              coordinar una demostración de nuestros servicios.
            </p>
          </motion.div>

          <motion.form
            ref={ref}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                placeholder="NOMBRE Y APELLIDO*"
                {...register("name")}
                className={inputClasses}
              />
              {errors.name && (
                <p className={errorClasses}>{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="EMAIL EMPRESARIAL*"
                {...register("email")}
                className={inputClasses}
              />
              {errors.email && (
                <p className={errorClasses}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="TELÉFONO*"
                {...register("phone")}
                className={inputClasses}
              />
              {errors.phone && (
                <p className={errorClasses}>{errors.phone.message}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="PUESTO PROFESIONAL*"
                {...register("position")}
                className={inputClasses}
              />
              {errors.position && (
                <p className={errorClasses}>{errors.position.message}</p>
              )}
            </div>

            <div>
              <textarea
                placeholder="DEJA UN COMENTARIO (OPCIONAL)"
                {...register("message")}
                className={`${inputClasses} h-32 resize-none`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("terms")}
                className="h-4 w-4 text-[#2A449E] rounded focus:ring-[#2A449E]"
              />
              <label className="text-sm">
                He leído y acepto los términos y condiciones
              </label>
            </div>
            {errors.terms && (
              <p className={errorClasses}>{errors.terms.message}</p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#04CCDB] text-white py-3 rounded-md font-medium hover:bg-[#03b5c2] transition-colors"
            >
              CONOCER MÁS
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
