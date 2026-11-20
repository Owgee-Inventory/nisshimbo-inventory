"use client";

import "./delete-button.css";

import { useState } from "react";

type Props = {
  itemName: string;
};

export default function DeleteButton({ itemName }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (status) {
    return <span className="deleteActionStatus">{status}</span>;
  }

  if (confirming) {
    return (
      <span className="deleteActionConfirmation">
        <span className="deleteActionQuestion">Delete {itemName}?</span>
        <button
          type="button"
          onClick={() => setStatus("Delete UI ready")}
          className="deleteActionButton deleteActionButton--confirm"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="deleteActionButton deleteActionButton--cancel"
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
      className="deleteActionButton"
    >
      Delete
    </button>
  );
}
