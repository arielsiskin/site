import React from "react";
import { motion } from "framer-motion";
import { HeroHighlight } from "@/components/UI/HeroHighlight";

const Policy = () => {
  return (
    <div>
      <div className="relative">
        <HeroHighlight
          subtleDots
          containerClassName="bg-[linear-gradient(0.72deg,rgba(42,68,158,0)_3.72%,#2A449E_42.95%,#000000_77.1%)]"
        >
          <div className="flex flex-col items-center justify-center py-20 md:py-32 md:pb-10 text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Política de Privacidad
            </motion.h1>
            <motion.div
              className="text-lg md:text-xl text-gray-200 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p>
                Comprometidos con la protección y seguridad de tus datos
                personales
              </p>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto py-12 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 shadow-lg"
            >
              <PolicyText />
            </motion.div>
          </div>
        </HeroHighlight>
      </div>
    </div>
  );
};

export const PolicyText = () => {
  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Política de Calidad y Seguridad de Datos
      </h1>
      <p className="mb-6 leading-relaxed">
        En <span className="font-semibold text-blue-300">Mayday Global</span>,
        entendemos la importancia de proteger la información de nuestros
        clientes, colaboradores y socios estratégicos. Nos comprometemos a
        garantizar la calidad en nuestros servicios y el cumplimiento de los más
        altos estándares de seguridad de datos, alineándonos con el{" "}
        <span className="font-semibold text-blue-300">
          Reglamento General de Protección de Datos (GDPR)
        </span>{" "}
        y otras normativas internacionales.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4 text-white">
        Compromisos de Calidad
      </h2>
      <ul className="space-y-3 mb-6">
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Excelencia en el servicio:
            </span>{" "}
            Desarrollamos soluciones digitales y tecnológicas seguras,
            eficientes y de alto rendimiento.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Mejora continua:
            </span>{" "}
            Evaluamos y optimizamos constantemente nuestros procesos para
            garantizar la máxima calidad.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Cumplimiento normativo:
            </span>{" "}
            Aplicamos las regulaciones locales e internacionales para garantizar
            la protección y seguridad de los datos.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Enfoque en el cliente:
            </span>{" "}
            Nos esforzamos en ofrecer soluciones personalizadas y alineadas con
            las necesidades de nuestros clientes.
          </div>
        </li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-4 text-white">
        Compromisos de Seguridad de Datos
      </h2>
      <ul className="space-y-3 mb-6">
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Protección de la información:
            </span>{" "}
            Implementamos medidas técnicas y organizativas para proteger los
            datos contra accesos no autorizados, pérdida o alteración.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Privacidad y confidencialidad:
            </span>{" "}
            Respetamos el derecho a la privacidad y aseguramos el tratamiento de
            los datos conforme a GDPR, garantizando transparencia y control a
            los titulares de la información.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Base legal para el procesamiento de datos:
            </span>{" "}
            Solo recopilamos y procesamos datos personales cuando contamos con
            una base legal válida, como el consentimiento informado,
            cumplimiento contractual o requerimientos legales.
          </div>
        </li>
      </ul>

      <h3 className="text-lg font-bold mt-6 mb-3 text-white">
        Derechos del usuario:
      </h3>
      <ul className="space-y-2 mb-6 pl-4">
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">Acceso:</span>{" "}
            Consultar qué datos personales procesamos.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">Rectificación:</span>{" "}
            Solicitar la corrección de datos incorrectos o incompletos.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Supresión (derecho al olvido):
            </span>{" "}
            Pedir la eliminación de datos cuando no sean necesarios.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Limitación y oposición:
            </span>{" "}
            Restringir o rechazar el procesamiento de datos en ciertos casos.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">Portabilidad:</span>{" "}
            Obtener los datos en un formato estructurado y legible.
          </div>
        </li>
      </ul>

      <ul className="space-y-3 mb-6">
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Gestión de riesgos y respuesta a incidentes:
            </span>{" "}
            Contamos con protocolos para la gestión de incidentes de seguridad y
            notificamos cualquier vulneración de datos conforme a las exigencias
            de GDPR.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Transferencia internacional de datos:
            </span>{" "}
            Garantizamos que cualquier transferencia de datos fuera del Espacio
            Económico Europeo (EEE) cumple con las cláusulas contractuales
            estándar y otros mecanismos de protección reconocidos por GDPR.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <div>
            <span className="font-semibold text-blue-300">
              Capacitación y concienciación:
            </span>{" "}
            Formamos continuamente a nuestro equipo en buenas prácticas de
            protección de datos y ciberseguridad.
          </div>
        </li>
      </ul>

      <p className="mt-8 mb-4 leading-relaxed">
        En <span className="font-semibold text-blue-300">Mayday Global</span>,
        nos comprometemos a garantizar la seguridad y el uso adecuado de la
        información, promoviendo una cultura de protección de datos en todos
        nuestros procesos.
      </p>
      <p className="mb-4 leading-relaxed">
        Si deseas más información sobre nuestra política o ejercer tus derechos,
        puedes contactarnos en{" "}
        <span className="font-semibold text-blue-300">
          marketing@mayday.global
        </span>
      </p>
    </div>
  );
};

export default Policy;
