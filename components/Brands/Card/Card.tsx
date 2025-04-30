import Link from "next/link";
import React from "react";
import Button from "../../Button/Button";

interface Props {
  textPosition: string;
  mode: string;
  imageUrl: string;
  legend: string;
  title: string;
  ctaUrl: string;
  description: string;
  descriptionList?: string[];
  ctaText?: string;
  width?: number;
}

const Card = ({
  textPosition,
  mode,
  imageUrl,
  legend,
  title,
  description,
  descriptionList,
  ctaUrl,
  ctaText,
  width,
}: Props) => {
  console.log("width", width);
  return (
    <div
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={`relative container w-[100%] md:w-[80%] lg:w-[900px] 2xl:w-[1196px] h-[406px] md:h-[300px] lg:h-[420px] 2xl:h-[640px] mx-auto md:mt-10 md:rounded-sm overflow-hidden`}
    >
      {/* Overlay: dark on mobile, transparent on md+ */}
      <div className="absolute inset-0 bg-black/60 md:bg-transparent z-10 transition-colors duration-300" />
      {/* Responsive Content */}
      {/* Mobile: bottom overlay, centered */}
      <div className="absolute z-20 flex flex-col justify-center w-[70%] md:w-full h-full p-6 md:hidden bottom-0 left-0">
        <span className="text-xs font-medium uppercase text-white opacity-80 mb-4 md:mb-2 tracking-wide">
          {legend}
        </span>
        <h2 className="text-2xl font-extrabold text-white mb-4 leading-tight md:mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-white mb-4 md:mb-2">{description}</p>
        )}

        <Link href={ctaUrl} className="w-full flex">
          <Button>{ctaText || "Ver más"}</Button>
        </Link>
      </div>
      {/* md+ version: side-aligned, original logic */}
      <div
        className={`hidden md:flex flex-col gap-3 absolute z-20
          ${
            textPosition === "left"
              ? "top-1/2 -translate-y-1/2 left-[60px] lg:left-[125px]"
              : "top-1/2 -translate-y-1/2 right-[60px] lg:right-[125px]"
          }
          ${width ? `w-[${width}px]` : "w-[40%]"}`}
      >
        <h3
          className={`text-xs lg:text-lg font-normal uppercase ${
            mode === "dark" ? "text-[#2A449E]" : "text-white"
          }`}
        >
          {legend}
        </h3>
        <h2
          className={`text-lg lg:text-[3rem] leading-[1] font-black uppercase ${
            mode === "dark" ? "text-primary " : "text-white "
          }`}
        >
          {title}
        </h2>
        {descriptionList && descriptionList.length > 0 && (
          <div>
            {descriptionList.map((item) => (
              <p className="text-sm md:text-lg leading-[1] text-white">
                <span key={item}>{item}</span>
              </p>
            ))}
          </div>
        )}
        <p
          className={`text-xs lg:text-lg ${
            mode === "dark" ? "text-primary" : "text-white"
          }`}
          style={width ? { width: `${width}px` } : {}}
        >
          {description}
        </p>
        <Link href={ctaUrl} className="text-primary">
          <Button>{ctaText || "Ver más"}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
