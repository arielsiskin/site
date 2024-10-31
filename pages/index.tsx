import Banner from "@/components/Banner/Banner.component";
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
    <div
      className={`h-screen w-full flex flex-col items-center justify-center`}
    >
      <img src="assets/logo.svg" alt="logo mayday" />{" "}
      <h1
        className={`${azoSans.className} text-5xl font-bold title mt-5 mb-2`}
      >
        Mayday Global
      </h1>
      <p className={`${azoSans.className}`}>
        Hub de soluciones tecnológicas para empresas
      </p>
      <Banner />
    </div>
  );
}
