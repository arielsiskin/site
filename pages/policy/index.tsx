import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Banner from "@/components/Banner/Banner.component";

const Policy = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-auto">
      <AnimatePresence>
        <motion.div
          className="flex items-center justify-center z-50 h-screen w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="p-8 pb-20 md:p-20">
            <PolicyText />
          </motion.div>

          <Banner />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const PolicyText = () => {
  return (
    <div>
      <h1>
        <b>Política de Calidad y Seguridad de Datos</b>
      </h1>
      <p>
        En <b>Mayday Global</b>, entendemos la importancia de proteger la
        información de nuestros clientes, colaboradores y socios estratégicos.
        Nos comprometemos a garantizar la calidad en nuestros servicios y el
        cumplimiento de los más altos estándares de seguridad de datos,
        alineándonos con el <b>Reglamento General de Protección de Datos (GDPR)</b> y otras
        normativas internacionales.
      </p>

      <h2>Compromisos de Calidad</h2>
      <ul>
        <li>
          <b>Excelencia en el servicio:</b> Desarrollamos soluciones digitales y
          tecnológicas seguras, eficientes y de alto rendimiento.
        </li>
        <li>
          <b>Mejora continua:</b> Evaluamos y optimizamos constantemente
          nuestros procesos para garantizar la máxima calidad.
        </li>
        <li>
          <b>Cumplimiento normativo:</b> Aplicamos las regulaciones locales e
          internacionales para garantizar la protección y seguridad de los
          datos.
        </li>
        <li>
          <b>Enfoque en el cliente:</b> Nos esforzamos en ofrecer soluciones
          personalizadas y alineadas con las necesidades de nuestros clientes.
        </li>
      </ul>

      <h2>Compromisos de Seguridad de Datos</h2>
      <ul>
        <li>
          <b>Protección de la información:</b> Implementamos medidas técnicas y
          organizativas para proteger los datos contra accesos no autorizados,
          pérdida o alteración.
        </li>
        <li>
          <b>Privacidad y confidencialidad:</b> Respetamos el derecho a la
          privacidad y aseguramos el tratamiento de los datos conforme a GDPR,
          garantizando transparencia y control a los titulares de la
          información.
        </li>
        <li>
          <b>Base legal para el procesamiento de datos:</b> Solo recopilamos y
          procesamos datos personales cuando contamos con una base legal válida,
          como el consentimiento informado, cumplimiento contractual o
          requerimientos legales.
        </li>
      </ul>

      <h3>Derechos del usuario:</h3>
      <ul>
        <li>
          <b>Acceso:</b> Consultar qué datos personales procesamos.
        </li>
        <li>
          <b>Rectificación:</b> Solicitar la corrección de datos incorrectos o
          incompletos.
        </li>
        <li>
          <b>Supresión (derecho al olvido):</b> Pedir la eliminación de datos
          cuando no sean necesarios.
        </li>
        <li>
          <b>Limitación y oposición:</b> Restringir o rechazar el procesamiento
          de datos en ciertos casos.
        </li>
        <li>
          <b>Portabilidad:</b> Obtener los datos en un formato estructurado y
          legible.
        </li>
      </ul>

      <ul>
        <li>
          <b>Gestión de riesgos y respuesta a incidentes:</b> Contamos con
          protocolos para la gestión de incidentes de seguridad y notificamos
          cualquier vulneración de datos conforme a las exigencias de GDPR.
        </li>
        <li>
          <b>Transferencia internacional de datos:</b> Garantizamos que
          cualquier transferencia de datos fuera del Espacio Económico Europeo
          (EEE) cumple con las cláusulas contractuales estándar y otros
          mecanismos de protección reconocidos por GDPR.
        </li>
        <li>
          <b>Capacitación y concienciación:</b> Formamos continuamente a nuestro
          equipo en buenas prácticas de protección de datos y ciberseguridad.
        </li>
      </ul>

      <p>
        En <b>Mayday Global</b>, nos comprometemos a garantizar la seguridad y
        el uso adecuado de la información, promoviendo una cultura de protección
        de datos en todos nuestros procesos.
      </p>
      <p>
        Si deseas más información sobre nuestra política o ejercer tus derechos,
        puedes contactarnos en <b>marketing@mayday.global</b>
      </p>
    </div>
  );
};

export default Policy;
