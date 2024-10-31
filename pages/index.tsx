import Banner from "@/components/Banner/Banner.component";
import { Vortex } from "@/components/UI/Vortex";
import localFont from "next/font/local";

const azoSans = localFont({
  src: [
    { path: "./fonts/AZOSANS-BLACK.woff", weight: "900", style: "normal" },
    {
      path: "./fonts/AZOSANS-BLACKITALIC.woff",
      weight: "900",
      style: "italic",
    },
    { path: "./fonts/AZOSANS-BOLD.woff", weight: "700", style: "normal" },
    { path: "./fonts/AZOSANS-BOLDITALIC.woff", weight: "700", style: "italic" },
    { path: "./fonts/AZOSANS-ITALIC.woff", weight: "400", style: "italic" },
    { path: "./fonts/AZOSANS-LIGHT.woff", weight: "300", style: "normal" },
    {
      path: "./fonts/AZOSANS-LIGHTITALIC.woff",
      weight: "300",
      style: "italic",
    },
    { path: "./fonts/AZOSANS-MEDIUM.woff", weight: "500", style: "normal" },
    {
      path: "./fonts/AZOSANS-MEDIUMITALIC.woff",
      weight: "500",
      style: "italic",
    },
    { path: "./fonts/AZOSANS-REGULAR.woff", weight: "400", style: "normal" },
    { path: "./fonts/AZOSANS-THIN.woff", weight: "200", style: "normal" },
    { path: "./fonts/AZOSANS-THINITALIC.woff", weight: "200", style: "italic" },
  ],
  variable: "--font-azo-sans",
});

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={200}
        className="flex flex-col items-center justify-center px-4 py-4 w-full h-full md:px-10"
      >
        <img
          src="assets/logo.svg"
          alt="logo mayday"
          className="w-32 h-auto md:w-40 lg:w-48"
        />
        <h1
          className={`${azoSans.className} title text-3xl font-bold mt-4 mb-2 md:text-5xl`}
        >
          Mayday Global
        </h1>
        <p
          className={`${azoSans.className} text-center text-white text-base md:text-lg`}
        >
          Hub de soluciones tecnológicas para empresas
        </p>
        <Banner />
      </Vortex>
    </div>
  );
}
