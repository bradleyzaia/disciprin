/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as cleanup from "../cleanup.js";
import type * as completeOnboarding from "../completeOnboarding.js";
import type * as friends_backfillHandles from "../friends/backfillHandles.js";
import type * as friends_getCrewStats from "../friends/getCrewStats.js";
import type * as friends_getFriendFeed from "../friends/getFriendFeed.js";
import type * as friends_getFriendProfile from "../friends/getFriendProfile.js";
import type * as friends_getFriends from "../friends/getFriends.js";
import type * as friends_getFriendsTodayTasks from "../friends/getFriendsTodayTasks.js";
import type * as friends_getPendingRequests from "../friends/getPendingRequests.js";
import type * as friends_mutations from "../friends/mutations.js";
import type * as friends_searchUsers from "../friends/searchUsers.js";
import type * as getDashboardData from "../getDashboardData.js";
import type * as journal from "../journal.js";
import type * as pills_createPill from "../pills/createPill.js";
import type * as pills_getPillEntries from "../pills/getPillEntries.js";
import type * as pills_getPills from "../pills/getPills.js";
import type * as pills_item from "../pills/item.js";
import type * as pills_logPillEntry from "../pills/logPillEntry.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  cleanup: typeof cleanup;
  completeOnboarding: typeof completeOnboarding;
  "friends/backfillHandles": typeof friends_backfillHandles;
  "friends/getCrewStats": typeof friends_getCrewStats;
  "friends/getFriendFeed": typeof friends_getFriendFeed;
  "friends/getFriendProfile": typeof friends_getFriendProfile;
  "friends/getFriends": typeof friends_getFriends;
  "friends/getFriendsTodayTasks": typeof friends_getFriendsTodayTasks;
  "friends/getPendingRequests": typeof friends_getPendingRequests;
  "friends/mutations": typeof friends_mutations;
  "friends/searchUsers": typeof friends_searchUsers;
  getDashboardData: typeof getDashboardData;
  journal: typeof journal;
  "pills/createPill": typeof pills_createPill;
  "pills/getPillEntries": typeof pills_getPillEntries;
  "pills/getPills": typeof pills_getPills;
  "pills/item": typeof pills_item;
  "pills/logPillEntry": typeof pills_logPillEntry;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
