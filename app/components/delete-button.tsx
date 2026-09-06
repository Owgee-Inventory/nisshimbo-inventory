"use client";

import { useState } from "react";

type Props = {
    itemName: string;
};

export default function DeleteButton({ itemName }: Props) {
    const [confirming, setConfirming] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    if (status) {
        return <span className="text-xs font-medium text-[#71817b]">{status}</span>;
    }

    if (confirming) {
        return (
            <span className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#a94435]">Delete {itemName}?</span>
                <button
                    type="button"
                    onClick={() => setStatus("Delete UI ready")}
                    className="rounded-lg bg-[#a94435] px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#8e382d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
                >
                    Confirm
                </button>
                <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#71817b] transition hover:bg-[#f4f1ea] hover:text-[#23443c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
                >
                    Cancel
                </button>
            </span>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#a94435] transition hover:bg-[#fff3ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
        >
            Delete
        </button>
    );
}
