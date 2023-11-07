import { v } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const archive = mutation({
  args: { id: v.id("hubs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingHub = await ctx.db.get(args.id);

    if (!existingHub) {
      throw new Error("Not found");
    }

    if (existingHub.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (hubId: Id<"hubs">) => {
      const children = await ctx.db
        .query("hubs")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentHub", hubId),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id);
      }
    };

    const hub = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchive(args.id);

    return hub;
  },
});

export const getSidebar = query({
  args: {
    parentHub: v.optional(v.id("hubs")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const hubs = await ctx.db
      .query("hubs")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentHub", args.parentHub),
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return hubs;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentHub: v.optional(v.id("hubs")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const hub = await ctx.db.insert("hubs", {
      title: args.title,
      parentHub: args.parentHub,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return hub;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const hubs = await ctx.db
      .query("hubs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return hubs;
  },
});

export const restore = mutation({
  args: { id: v.id("hubs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingHub = await ctx.db.get(args.id);

    if (!existingHub) {
      throw new Error("Not found");
    }

    if (existingHub.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveRestore = async (hubId: Id<"hubs">) => {
      const children = await ctx.db
        .query("hubs")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentHub", hubId),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"hubs">> = {
      isArchived: false,
    };

    if (existingHub.parentHub) {
      const parent = await ctx.db.get(existingHub.parentHub);
      if (parent?.isArchived) {
        options.parentHub = undefined;
      }
    }

    const hub = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return hub;
  },
});

export const remove = mutation({
  args: { id: v.id("hubs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingHub = await ctx.db.get(args.id);

    if (!existingHub) {
      throw new Error("Not found");
    }

    if (existingHub.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const hub = await ctx.db.delete(args.id);

    return hub;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const hubs = await ctx.db
      .query("hubs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return hubs;
  },
});

export const getById = query({
  args: { hubId: v.id("hubs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const hub = await ctx.db.get(args.hubId);

    if (!hub) {
      throw new Error("Not found");
    }

    if (hub.isPublished && !hub.isArchived) {
      return hub;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (hub.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return hub;
  },
});

export const update = mutation({
  args: {
    id: v.id("hubs"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingHub = await ctx.db.get(args.id);

    if (!existingHub) {
      throw new Error("Not found");
    }

    if (existingHub.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const hub = await ctx.db.patch(args.id, {
      ...rest,
    });

    return hub;
  },
});

export const removeIcon = mutation({
  args: { id: v.id("hubs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingHub = await ctx.db.get(args.id);

    if (!existingHub) {
      throw new Error("Not found");
    }

    if (existingHub.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const hub = await ctx.db.patch(args.id, {
      icon: undefined,
    });

    return hub;
  },
});

export const removeCoverImage = mutation({
  args: { id: v.id("hubs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingHub = await ctx.db.get(args.id);

    if (!existingHub) {
      throw new Error("Not found");
    }

    if (existingHub.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const hub = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });

    return hub;
  },
});
