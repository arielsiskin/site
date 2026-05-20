"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Button from "../Button/Button";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";

const cards = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: "Agentes de IA para Chat",
    description: "Automatiza conversaciones en WhatsApp, Instagram, Webchat y otros canales. Resuelve consultas frecuentes y califica leads 24/7.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    title: "Agentes de IA para E-mail",
    description: "Agentes de IA que leen, clasifican y responden correos electrónicos. Mantén conversaciones fluidas por email sin intervención humana.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    title: "Agentes de IA para Voz",
    description: "Automatiza llamadas por teléfono y WhatsApp Business entrantes y salientes para ventas, cobranzas o soporte con agentes de IA.",
  },
];

interface CardItemProps {
  card: typeof cards[0];
  index: number;
  inView: boolean;
}

const CardItem: React.FC<CardItemProps> = ({ card, index, inView }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative rounded-2xl"
      style={{
        boxShadow: isHovered
          ? "0 8px 32px rgba(99,102,241,0.22)"
          : "0 1px 4px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Gradient border — fades in on hover */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, #7C3AED 0%, #4F46E5 45%, #06B6D4 100%)",
          opacity: isHovered ? 1 : 0,
        }}
      />
      {/* Default border — fades out on hover */}
      <div
        className="absolute inset-0 rounded-2xl border border-gray-100 transition-opacity duration-300 pointer-events-none"
        style={{ opacity: isHovered ? 0 : 1 }}
      />

      {/* Card surface */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative m-[1px] rounded-2xl p-8 flex flex-col"
        style={{
          background: isHovered
            ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(238,242,255,0.9) 0%, white 60%)`
            : "white",
          transition: "background 0.08s ease",
        }}
      >
        <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#6366F1] mb-6">
          {card.icon}
        </div>
        <h3 className="text-xl font-bold text-maydayDarker mb-3">
          {card.title}
        </h3>
        <p className="text-gray-500 text-lg leading-relaxed">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
};

const AgentsCards: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="w-full bg-white px-4 py-16 md:py-24">
      <div className="max-w-[1196px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <CardItem key={index} card={card} index={index} inView={inView} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex justify-center mt-16"
        >
          <Link href={DEMO_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="!w-56">Solicitar demo</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AgentsCards;
