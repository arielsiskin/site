"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HeroHighlight } from "../UI/HeroHighlight";

export default function SimpleSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={{ ...className, before: { content: '""!important' } }}
        style={{
          ...style,
          backgroundImage: "url(/assets/arrow-left.png)",
          backgroundRepeat: "no-repeat",
          cursor: "pointer",
          display: "block",
          left: "10%",
          top: "65%",
          zIndex: 1,
          position: "absolute",
          width: "30px",
          height: "30px",
          "@media (max-width: 768px)": {
            display: "none",
          },
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={{ ...className, before: { content: '""!important' } }}
        style={{
          ...style,
          backgroundImage: "url(/assets/arrow-right.png)",
          backgroundRepeat: "no-repeat",
          cursor: "pointer",
          display: "block",
          top: "65%",
          left: "13%",
          position: "absolute",
          width: "30px",
          zIndex: 1,
          height: "30px",
          "@media (max-width: 768px)": {
            display: "none",
          },
        }}
        onClick={onClick}
      />
    );
  }
  return (
    <HeroHighlight
      subtleDots
      containerClassName="bg-[linear-gradient(0.72deg,rgba(42,68,158,0)_3.72%,#2A449E_42.95%,#000000_77.1%)]"
    >
      <div className="w-[100vw]">
        <Slider
          {...settings}
          nextArrow={<SampleNextArrow className="top-10" />}
          prevArrow={<SamplePrevArrow className="top-10" />}
        >
          <div className="relative w-full sm:h-[500px] md:h-[550px] lg:h-[65vh] 2xl:h-[75vh]">
            <img
              src="/assets/home-slide-1.png"
              alt="Mayday slide 1"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 1 }}
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-40"
              style={{ zIndex: 2 }}
            />
            <div
              className="absolute inset-0 flex flex-col justify-center items-start left-[10%] text-center px-4"
              style={{ zIndex: 3 }}
            >
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-white">
                Somos mucho más que una plataforma
              </h2>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
                SOMOS UN HUB DE SOLUCIONES IT PARA TU EMPRESA.
              </h1>
            </div>
          </div>
          <div className="relative w-full lg:h-[65vh] 2xl:h-[75vh] sm:h-[500px] md:h-[550px]">
            <img
              src="/assets/home-slide-2.png"
              alt="Mayday slide 2"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 1 }}
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-40"
              style={{ zIndex: 2 }}
            />
            <div
              className="absolute inset-0 flex flex-col justify-center items-start left-[10%] text-center px-4"
              style={{ zIndex: 3 }}
            >
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-white">
                Sea cual sea el desafío de tu negocio
              </h2>
              <h1 className="text-4xl font-bold text-white">
                TENEMOS UNA HERRAMIENTA PARA SUPERARLO.{" "}
              </h1>
            </div>
          </div>
          <div className="relative w-full lg:h-[65vh] 2xl:h-[75vh] sm:h-[500px] md:h-[550px]">
            <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2">
              <h2 className="text-lg font-bold"></h2>
              <h1 className="text-4xl font-bold">
                AGILIDAD A LA HORA DE IMPLEMENTAR, EXCELENCIA EN EL SERVICIO
                POST VENTA.{" "}
              </h1>
            </div>
            <img
              src="/assets/home-slide-3.png"
              alt="Mayday slide 3"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 1 }}
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-40"
              style={{ zIndex: 2 }}
            />
            <div
              className="absolute inset-0 flex flex-col justify-center items-start left-[10%] text-center px-4"
              style={{ zIndex: 3 }}
            >
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-white">
                Sea cual sea el desafío de tu negocio
              </h2>
              <h1 className="text-4xl font-bold text-white">
                TENEMOS UNA HERRAMIENTA PARA SUPERARLO.{" "}
              </h1>
            </div>
          </div>
        </Slider>
      </div>
    </HeroHighlight>
  );
}
