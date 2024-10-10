import React, { type ComponentProps } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import AdminLinks from "../common/AdminLinks";
import { ChevronDown } from "lucide-react";
import type NavLink from "../common/NavLink";

export default function AdminAccordionLinks({
  isMobile,
  setIsSheetOpen,
}: {
  isMobile: boolean;
  setIsSheetOpen?: ComponentProps<typeof NavLink>["setIsSheetOpen"];
}) {
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger
          className="h-10 w-full justify-center rounded-lg text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 [&[data-state=open]>p]:opacity-50"
          chevronVisible={false}
        >
          <p className="flex w-full items-center justify-center gap-2 text-lg text-primary">
            Admin Pages
            <ChevronDown
              size={20}
              className="shrink-0 transition-transform duration-200"
            />
          </p>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-2 p-1 md:gap-4">
          <AdminLinks isMobile={isMobile} setIsSheetOpen={setIsSheetOpen} />

          <Separator />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
