"use client";

import { useQuery, useMutation } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const hubs = useQuery(api.hubs.getTrash);
  const restore = useMutation(api.hubs.restore);
  const remove = useMutation(api.hubs.remove);

  const [search, setSearch] = useState("");

  const filteredHubs = hubs?.filter((hub) => {
    return hub.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (hubId: string) => {
    router.push(`/hubs/${hubId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    hubId: Id<"hubs">,
  ) => {
    event.stopPropagation();
    const promise = restore({ id: hubId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: " Failed to restore note.",
    });
  };

  const onRemove = (hubId: Id<"hubs">) => {
    const promise = remove({ id: hubId });

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: " Failed to delete note.",
    });

    if (params.hubId === hubId) {
      router.push("/hubs");
    }
  };

  if (hubs === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No hubs found.
        </p>
        {filteredHubs?.map((hub) => (
          <div
            key={hub._id}
            role="button"
            onClick={() => onClick(hub._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{hub.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, hub._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(hub._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
