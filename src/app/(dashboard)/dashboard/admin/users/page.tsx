"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { AdminUserRecord, SessionUser } from "@/types/salon";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user as SessionUser | undefined;

  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await apiRequest<
          { users?: AdminUserRecord[] } | AdminUserRecord[]
        >("/admin/users");
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load users.");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await apiRequest(`/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      toast.success(`Role updated to ${role}.`);
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === userId ? { ...u, role } : u))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role.");
    }
  };

  const handleToggleBlock = async (userItem: AdminUserRecord) => {
    const uid = userItem._id || userItem.id || "";
    try {
      await apiRequest(`/admin/users/${uid}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !userItem.isBlocked }),
      });
      toast.success(
        userItem.isBlocked ? `${userItem.name} unblocked.` : `${userItem.name} blocked.`
      );
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === uid ? { ...u, isBlocked: !userItem.isBlocked } : u
        )
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed.");
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-[#FAF8F5] text-xs uppercase tracking-wider text-neutral-500">
          <tr>
            <th className="px-5 py-3.5">User</th>
            <th className="px-5 py-3.5">Email</th>
            <th className="px-5 py-3.5">Role</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-neutral-400">
                Loading users...
              </td>
            </tr>
          ) : (
            users.map((u) => {
              const uid = u._id || u.id || "";
              const isSelf = uid === currentUser?.id;

              return (
                <tr key={uid} className="hover:bg-neutral-50/70">
                  <td className="px-5 py-4 font-medium text-[#1E1E1E]">
                    {u.name} {isSelf && <span className="text-xs text-[#C87D6B]">(You)</span>}
                  </td>
                  <td className="px-5 py-4 text-neutral-600">{u.email}</td>
                  <td className="px-5 py-4">
                    <select
                      disabled={isSelf}
                      value={u.role || "customer"}
                      onChange={(e) => handleRoleChange(uid, e.target.value)}
                      className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs capitalize disabled:opacity-50"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge value={u.isBlocked ? "blocked" : "active"} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => handleToggleBlock(u)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-40 cursor-pointer ${
                        u.isBlocked
                          ? "border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          : "border border-rose-200 text-rose-700 hover:bg-rose-50"
                      }`}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}