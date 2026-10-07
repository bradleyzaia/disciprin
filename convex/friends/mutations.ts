import { mutation } from "../_generated/server";
import { v } from "convex/values";

/** Send a friend request */
export const sendFriendRequest = mutation({
    args: {
        friendClerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const userId = identity.subject;

        if (userId === args.friendClerkId) throw new Error("Cannot friend yourself");

        // Check if already exists (either direction)
        const existing1 = await ctx.db
            .query("friends")
            .withIndex("by_pair", (q) => q.eq("user_id", userId).eq("friend_id", args.friendClerkId))
            .first();

        const existing2 = await ctx.db
            .query("friends")
            .withIndex("by_pair", (q) => q.eq("user_id", args.friendClerkId).eq("friend_id", userId))
            .first();

        if (existing1 || existing2) throw new Error("Friend request already exists");

        await ctx.db.insert("friends", {
            user_id: userId,
            friend_id: args.friendClerkId,
            status: "pending",
            created_at: Date.now(),
        });

        return { success: true };
    },
});

/** Accept a friend request (only the recipient can accept) */
export const acceptFriendRequest = mutation({
    args: {
        friendClerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const userId = identity.subject;

        const request = await ctx.db
            .query("friends")
            .withIndex("by_pair", (q) => q.eq("user_id", args.friendClerkId).eq("friend_id", userId))
            .first();

        if (!request || request.status !== "pending") {
            throw new Error("No pending request found");
        }

        await ctx.db.patch(request._id, {
            status: "accepted",
            accepted_at: Date.now(),
        });

        return { success: true };
    },
});

/** Reject a friend request */
export const rejectFriendRequest = mutation({
    args: {
        friendClerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const userId = identity.subject;

        const request = await ctx.db
            .query("friends")
            .withIndex("by_pair", (q) => q.eq("user_id", args.friendClerkId).eq("friend_id", userId))
            .first();

        if (!request || request.status !== "pending") {
            throw new Error("No pending request found");
        }

        await ctx.db.delete(request._id);
        return { success: true };
    },
});

/** Remove a friend (either party can remove) */
export const removeFriend = mutation({
    args: {
        friendClerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const userId = identity.subject;

        const sent = await ctx.db
            .query("friends")
            .withIndex("by_pair", (q) => q.eq("user_id", userId).eq("friend_id", args.friendClerkId))
            .first();

        const received = await ctx.db
            .query("friends")
            .withIndex("by_pair", (q) => q.eq("user_id", args.friendClerkId).eq("friend_id", userId))
            .first();

        const friendship = sent || received;
        if (!friendship) throw new Error("Friendship not found");

        await ctx.db.delete(friendship._id);
        return { success: true };
    },
});
