"use client";

import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-bebas">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <br className="hidden md:block" />
        <span className="underline">Student Hub</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Student Hub is a place where{" "}
        <span className="animate-pulse">Smarter Learning </span> <br />
        Takes Center Stage
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/hubs">
            Enter Student Hub
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton
          mode="modal"
          afterSignInUrl={`${window.location.origin}/hubs`}
          afterSignUpUrl={`${window.location.origin}/hubs`}
        >
          <Button>
            Get Student Hub free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
