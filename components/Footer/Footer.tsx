import React from "react";
import Image from "next/image";
import Link from "next/link";

const locations = [
  {
    country: "ARGENTINA",
    flag: "/assets/flags/argentina.svg",
    address: "Corrientes 2335 Of. 902,",
    city: "CABA, Buenos Aires.",
  },
  {
    country: "MÉXICO",
    flag: "/assets/flags/mexico.svg",
    address: "Calle Avellano 12 Santa María la Ribera,",
    city: "Cuauhtémoc, D.F.",
  },
  {
    country: "PARAGUAY",
    flag: "/assets/flags/paraguay.svg",
    address: "Av. Aviadores del Chaco 2050,",
    city: "Asunción.",
  },
  {
    country: "ESTADOS UNIDOS",
    flag: "/assets/flags/usa.svg",
    address: "201 Collins Av. Apt 1226, 33139",
    city: "Miami Beach,",
    phone: "Tel: +1305 775 1474",
  },
];

const Footer = () => {
  return (
    <footer className="bg-footer-gradient text-white pt-12 pb-4">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {locations.map((location) => (
            <div
              key={location.country}
              className="text-sm flex items-start gap-3"
            >
              <div className="relative w-[100px] h-[100px] mt-1 flex-shrink-0">
                <Image
                  src={location.flag}
                  alt={`${location.country} flag`}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div>
                <span className="font-bold">{location.country}</span>
                <p className="text-gray-300">
                  {location.address}
                  <br />
                  {location.city}
                  {location.phone && (
                    <>
                      <br />
                      {location.phone}
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                SÍGUENOS EN LINKEDIN
              </Link>
            </div>
            <div className="flex text-sm flex-col  text-gray-300  items-center gap-1">
              <span> 2025 MAYDAY GLOBAL</span>
              <span>Todos los derechos reservados.</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex flex-col items-center gap-1">
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Política de Privacidad
                </Link>
                <Link
                  href="/cookies"
                  className="hover:text-white transition-colors"
                >
                  Política de Uso de cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
