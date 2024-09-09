import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ProductsSectionHeader({ title }: { title: string }) {
  return (
    <hgroup className="flex gap-4">
      <h2 className="text-3xl font-bold">{title}</h2>

      <Button variant={"outline"} href="/products" className="space-x-2">
        <span>View All</span>
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </hgroup>
  );
}
