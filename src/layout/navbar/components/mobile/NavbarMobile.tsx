"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavbarLinks from "../common/NavbarLinks";
import ShoppingCart from "@/components/ShoppingCart";
import { Menu } from "lucide-react";
import type { NavbarProps } from "../../Navbar";

export default function NavbarMobile({ authentication }: NavbarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="flex justify-between bg-primary p-4">
        <Image src="/logo-white.svg" alt="Logo" width={40} height={40} />

        <div className="flex flex-row items-center gap-4">
          <ShoppingCart iconProps={{ color: "#FFF" }} />

          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSheetOpen(true)}
            >
              <Menu />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </SheetTrigger>
        </div>
      </div>

      <SheetContent className="rounded-s-lg [&>button>svg]:h-6 [&>button>svg]:w-6 [&>button]:z-10">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Select page</SheetDescription>

        <ScrollArea className="h-full">
          <NavbarLinks
            authentication={authentication}
            containerStyles="flex h-full flex-col justify-between"
            listStyles="my-6 flex flex-col gap-2 p-1"
            isMobile={true}
            setIsSheetOpen={setIsSheetOpen}
            loginLogoutProps={{
              containerStyles: "flex justify-end self-end p-1",
              buttonStyles: "px-6 py-2.5 text-primary",
              buttonVariant: "outline",
            }}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
