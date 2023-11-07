export const siteConfig = {
  name: "Student Hub",
  url: new URL(`https://${process.env.VERCEL_URL}`),
  ogImage: ["/ogImage/logo-light.png", "/ogImage/logo-dark.png"],
  description:
    "Student Hub is an open-source software to make chatting to your PDF files easy.",
  image: "/long-logo.svg",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn-ui/ui",
    noIndex: false,
    metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
  },
};

export type SiteConfig = typeof siteConfig;
