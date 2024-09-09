import React from "react";

export default function ErrorMessage({ error }: { error: string | string[] }) {
  return (
    <div>
      {Array.isArray(error) ? (
        <ul className="text-sm text-destructive">
          {error.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
