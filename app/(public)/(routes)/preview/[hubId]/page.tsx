"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface HubIdPageProps {
  params: {
    hubId: Id<"hubs">;
  };
}

const HubIdPage = ({ params }: HubIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    [],
  );

  const hub = useQuery(api.hubs.getById, {
    hubId: params.hubId,
  });

  const update = useMutation(api.hubs.update);

  const onChange = (content: string) => {
    update({
      id: params.hubId,
      content,
    });
  };

  if (hub === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (hub === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover preview url={hub.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview initialData={hub} />
        <Editor
          editable={false}
          onChange={onChange}
          initialContent={hub.content}
        />
      </div>
    </div>
  );
};

export default HubIdPage;
