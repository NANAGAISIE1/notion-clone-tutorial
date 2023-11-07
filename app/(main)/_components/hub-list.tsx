"use client";

import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import { Item } from "./item";

interface HubListProps {
  parentHubId?: Id<"hubs">;
  level?: number;
  data?: Doc<"hubs">[];
}

export const HubList = ({ parentHubId, level = 0 }: HubListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (hubId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [hubId]: !prevExpanded[hubId],
    }));
  };

  const hubs = useQuery(api.hubs.getSidebar, {
    parentHub: parentHubId,
  });

  const onRedirect = (hubId: string) => {
    router.push(`/hubs/${hubId}`);
  };

  if (hubs === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden",
        )}
      >
        No pages inside
      </p>
      {hubs.map((hub) => (
        <div key={hub._id}>
          <Item
            id={hub._id}
            onClick={() => onRedirect(hub._id)}
            label={hub.title}
            icon={FileIcon}
            hubIcon={hub.icon}
            active={params.hubId === hub._id}
            level={level}
            onExpand={() => onExpand(hub._id)}
            expanded={expanded[hub._id]}
          />
          {expanded[hub._id] && (
            <HubList parentHubId={hub._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
