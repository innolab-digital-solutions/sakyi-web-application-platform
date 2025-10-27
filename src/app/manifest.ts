import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SaKyi Health & Wellness",
    short_name: "SaKyi",
    description:
      "Transform your life with personalized wellness programs designed by certified doctors. Your journey to holistic health starts here.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#35bec5",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["health", "wellness", "medical", "lifestyle"],
    lang: "en",
    orientation: "portrait",
  };
}
