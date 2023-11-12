import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Student Hub",
    short_name: "SH",
    description:
      "Student Hub is an open-source software to make chatting to your PDF files easy.",
    start_url: `https://${process.env.VERCEL_URL}`,
    display: "standalone",
    background_color: "#000",
    theme_color: "#000",
    icons: [
      {
        src: "/logo/transparent-background/short-logo-dark.svg",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo/transparent-background/short-logo.svg",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
