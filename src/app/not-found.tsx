import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="my-8 text-center">
      <h2 className="my-4 text-3xl font-bold">There was a problem.</h2>

      <p>We could not find the page you were looking for.</p>
      <p>
        Go Back to &nbsp;
        <Link
          href="/"
          className="text-foreground underline underline-offset-2 transition-colors hover:text-muted-foreground"
        >
          main page
        </Link>
        .
      </p>
    </main>
  );
}
