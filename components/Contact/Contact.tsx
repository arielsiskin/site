"use client";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../../emailjs';
import ReCAPTCHA from "react-google-recaptcha";
import dynamic from 'next/dynamic';

const COUNTRIES = [
  { flag: "🇦🇷", name: "Argentina",            code: "+54"  },
  { flag: "🇧🇴", name: "Bolivia",              code: "+591" },
  { flag: "🇧🇷", name: "Brasil",               code: "+55"  },
  { flag: "🇨🇱", name: "Chile",                code: "+56"  },
  { flag: "🇨🇴", name: "Colombia",             code: "+57"  },
  { flag: "🇨🇷", name: "Costa Rica",           code: "+506" },
  { flag: "🇨🇺", name: "Cuba",                 code: "+53"  },
  { flag: "🇩🇴", name: "República Dominicana", code: "+1"   },
  { flag: "🇪🇨", name: "Ecuador",              code: "+593" },
  { flag: "🇸🇻", name: "El Salvador",          code: "+503" },
  { flag: "🇪🇸", name: "España",               code: "+34"  },
  { flag: "🇬🇹", name: "Guatemala",            code: "+502" },
  { flag: "🇭🇳", name: "Honduras",             code: "+504" },
  { flag: "🇲🇽", name: "México",               code: "+52"  },
  { flag: "🇳🇮", name: "Nicaragua",            code: "+505" },
  { flag: "🇵🇦", name: "Panamá",               code: "+507" },
  { flag: "🇵🇾", name: "Paraguay",             code: "+595" },
  { flag: "🇵🇪", name: "Perú",                 code: "+51"  },
  { flag: "🇺🇸", name: "Estados Unidos",       code: "+1"   },
  { flag: "🇺🇾", name: "Uruguay",              code: "+598" },
  { flag: "🇻🇪", name: "Venezuela",            code: "+58"  },
];

const VERTICALS = [
  "Omnichannel",
  "VoiceBot",
  "IA Bot",
  "WFM",
  "Otros",
];

const contactSchema = z.object({
  name:        z.string().min(1, "El nombre es requerido"),
  email:       z.string().email("Email inválido"),
  countryCode: z.string().min(1, "Seleccioná un país"),
  phone:       z.string().min(1, "El teléfono es requerido"),
  position:    z.string().min(1, "El puesto es requerido"),
  vertical:    z.string().min(1, "Seleccioná un vertical"),
  message:     z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError,   setSubmitError]   = useState("");
  const [captchaValue,  setCaptchaValue]  = useState<string | null>(null);
  const [captchaError,  setCaptchaError]  = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { countryCode: "+54" },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (!captchaValue) {
      setCaptchaError("Por favor, complete el captcha");
      return;
    }
    setCaptchaError("");
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          to_email:  EMAILJS_CONFIG.TO_EMAIL,
          from_name: data.name,
          from_email: data.email,
          phone:     `${data.countryCode} ${data.phone}`,
          position:  data.position,
          vertical:  data.vertical,
          message:   data.message || "Sin comentarios",
          'g-recaptcha-response': captchaValue,
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      setSubmitSuccess(true);
      reset();
      recaptchaRef.current?.reset();
      setCaptchaValue(null);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitError("Hubo un error al enviar el formulario. Por favor intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2A449E] focus:border-transparent text-black bg-white";
  const selectClasses =
    "px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2A449E] focus:border-transparent text-black bg-white";
  const errorClasses = "text-red-400 text-sm mt-1";

  return (
    <section
      id="contacto"
      className="bg-[#1E1656] border-b-[4px] border-white text-white py-20 px-4 bg-[url('/assets/background-form.svg')] bg-no-repeat"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">¿TIENES UN PROYECTO?</h2>
            <h3 className="text-2xl mb-6">Estamos aquí para ayudarte</h3>
            <p className="text-gray-300 text-lg">
              Un asesor se pondrá en contacto para resolver sus consultas, o
              coordinar una demostración de nuestros servicios.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            ref={ref}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {submitSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                ¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.
              </div>
            )}
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {submitError}
              </div>
            )}

            {/* Nombre */}
            <div>
              <input
                type="text"
                placeholder="NOMBRE Y APELLIDO*"
                {...register("name")}
                className={inputClasses}
                disabled={isSubmitting}
              />
              {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="EMAIL EMPRESARIAL*"
                {...register("email")}
                className={inputClasses}
                disabled={isSubmitting}
              />
              {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
            </div>

            {/* Teléfono + código de área */}
            <div>
              <div className="flex gap-2">
                <select
                  {...register("countryCode")}
                  disabled={isSubmitting}
                  className={`${selectClasses} flex-shrink-0`}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code + c.name} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="TELÉFONO*"
                  {...register("phone")}
                  className={inputClasses}
                  disabled={isSubmitting}
                />
              </div>
              {(errors.countryCode || errors.phone) && (
                <p className={errorClasses}>
                  {errors.countryCode?.message || errors.phone?.message}
                </p>
              )}
            </div>

            {/* Puesto */}
            <div>
              <input
                type="text"
                placeholder="PUESTO PROFESIONAL*"
                {...register("position")}
                className={inputClasses}
                disabled={isSubmitting}
              />
              {errors.position && <p className={errorClasses}>{errors.position.message}</p>}
            </div>

            {/* Vertical de interés */}
            <div>
              <select
                {...register("vertical")}
                disabled={isSubmitting}
                className={`${selectClasses} w-full`}
                defaultValue=""
              >
                <option value="" disabled>VERTICAL DE INTERÉS*</option>
                {VERTICALS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              {errors.vertical && <p className={errorClasses}>{errors.vertical.message}</p>}
            </div>

            {/* Mensaje */}
            <div>
              <textarea
                placeholder="DEJA UN COMENTARIO (OPCIONAL)"
                {...register("message")}
                className={`${inputClasses} h-32 resize-none`}
                disabled={isSubmitting}
              />
            </div>

            {/* Términos */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("terms")}
                className="h-4 w-4 text-[#2A449E] rounded focus:ring-[#2A449E]"
                disabled={isSubmitting}
              />
              <label className="text-sm">He leído y acepto los términos y condiciones</label>
            </div>
            {errors.terms && <p className={errorClasses}>{errors.terms.message}</p>}

            {/* reCAPTCHA */}
            <div className="flex justify-center my-4">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={(v) => { setCaptchaValue(v); if (v) setCaptchaError(""); }}
              />
            </div>
            {captchaError && <p className={errorClasses}>{captchaError}</p>}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-3 rounded-md font-medium transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#04CCDB] text-white hover:bg-[#03b5c2]"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "ENVIANDO..." : "CONOCER MÁS"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default dynamic(() => Promise.resolve(Contact), { ssr: false });
