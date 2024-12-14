"use client";

import { changeUserRoleAction } from "@/actions/changeUserRoleAction";
import { users } from "@/drizzle/schema";
import { useTransition } from "react";

type ChangeUserRoleInputProps = {
    email: (typeof users.$inferSelect)["email"];
    currentRole: (typeof users.$inferSelect)["role"];
    isAdmin: boolean;
};

export const ChangeUserRoleInput = ({ email, currentRole, isAdmin }: ChangeUserRoleInputProps) => {
    const [isPending, startTransition] = useTransition();

    const changeHandler = (email: string, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value as (typeof users.$inferSelect)["role"];

        if (newRole === currentRole) return;

        startTransition(() => {
            changeUserRoleAction(email, newRole);
        });
    };

    return (
        <select
            disabled={isAdmin || isPending}
            defaultValue={currentRole}
            onChange={(event) => changeHandler(email, event)} // Pass email and event properly
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
            <option value="user">User</option>
            <option value="admin">Admin</option>
        </select>
    );
};
