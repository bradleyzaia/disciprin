import { internalMutation } from "../_generated/server";

const HANDLE_REGEX = /^[a-z0-9][a-z0-9_]{1,18}[a-z0-9]$/;

function generateHandle(name: string): string {
    let handle = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")
        .replace(/^_+|_+$/g, "")
        .slice(0, 20);

    // Ensure minimum length
    if (handle.length < 3) {
        handle = handle.padEnd(3, "0");
    }

    return handle;
}

export const backfillHandles = internalMutation({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        const usersWithoutHandle = users.filter((u) => !u.handle);

        // Collect all existing handles
        const existingHandles = new Set(
            users.filter((u) => u.handle).map((u) => u.handle!)
        );

        let updated = 0;

        for (const user of usersWithoutHandle) {
            let base = generateHandle(user.name);
            let candidate = base;
            let counter = 1;

            while (existingHandles.has(candidate) || !HANDLE_REGEX.test(candidate)) {
                candidate = `${base}${counter}`;
                counter++;
                if (counter > 999) {
                    candidate = `user_${Date.now().toString(36)}`;
                    break;
                }
            }

            if (HANDLE_REGEX.test(candidate)) {
                await ctx.db.patch(user._id, { handle: candidate });
                existingHandles.add(candidate);
                updated++;
            }
        }

        return { updated, total: usersWithoutHandle.length };
    },
});
