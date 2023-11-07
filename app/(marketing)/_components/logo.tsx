import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo/transparent-background/short-logo-dark.svg"
        height="60"
        width="60"
        alt="Logo"
        className="dark:hidden lg:hidden"
      />
      <Image
        src="/logo/transparent-background/short-logo.svg"
        height="60"
        width="60"
        alt="Logo"
        className="hidden dark:block lg:hidden lg:dark:hidden"
      />
      <Image
        src="/logo/transparent-background/long-logo-dark.svg"
        height="150"
        width="150"
        alt="Logo"
        className="hidden lg:dark:hidden lg:block"
      />
      <Image
        src="/logo/transparent-background/long-logo.svg"
        height="170"
        width="170"
        alt="Logo"
        className="hidden lg:dark:block lg:block"
      />
    </div>
  );
};
