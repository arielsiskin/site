import React from "react";

const imgs = [
  {
    id: "1",
    url: "assets/Neotel_Solucion_Tecnologica_Contact_Center.svg",
    className: "",
    alt: "Neotel logo",
  },
  {
    id: "2",
    url: "assets/full-version-blue.svg",
    className: "",
    alt: "botmaker logo",
  },
  {
    id: "3",
    url: "assets/WFMOp.svg",
    className: "",
    alt: "synergywfm logo",
  },
  {
    id: "4",
    url: "assets/logo-s1-ani-v3.svg",
    className: "",
    alt: "s1 logo",
  },
];

const Banner = () => {
  return (
    <div className="w-full fixed bottom-4 p-1 bg-white">
      <div className="w-full flex flex-wrap gap-4 justify-center items-center sm:gap-10">
        {imgs.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.alt}
            className={`${img.className} w-16 h-12 sm:w-36 sm:h-16 md:w-40 md:h-20`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
