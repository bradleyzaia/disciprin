import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const deleteTable = mutation({
    args: { tableName: v.string() },
    handler: async (ctx, args) => {
        // @ts-ignore
        const docs = await ctx.db.query(args.tableName).collect();

        if (docs.length === 0) {
            return `Table '${args.tableName}' is already empty or does not exist.`;
        }

        let count = 0;
        for (const doc of docs) {
            // @ts-ignore
            await ctx.db.delete(doc._id);
            count++;
        }

        return `Successfully deleted ${count} documents from table '${args.tableName}'.`;
    },
});
