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
    <div className="w-full absolute bottom-[50px] p-2 mt-10 bg-white">
      <div className="w-full flex gap-10 justify-center items-center">
        {imgs.map((img) => (
          <img
            style={{ width: "150px", height: "70px" }}
            key={img.id}
            src={img.url}
            alt={img.alt}
            className={img.className}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
