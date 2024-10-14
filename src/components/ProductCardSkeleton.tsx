import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

export default function ProductCardSkeleton() {
  return (
    <li className="flex animate-pulse flex-col">
      <Card aria-label="Product is loading" className="overflow-hidden">
        <div className="aspect-square w-full bg-gray-300" />

        <CardHeader>
          <CardTitle>
            <div className="h-6 w-3/4 rounded-full bg-gray-300" />
          </CardTitle>
          <CardDescription>
            <div className="h-4 w-1/2 rounded-full bg-gray-300" />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="h-4 w-full rounded-full bg-gray-300" />
          <div className="h-4 w-full rounded-full bg-gray-300" />
          <div className="h-4 w-3/4 rounded-full bg-gray-300" />
        </CardContent>

        <CardFooter>
          <Button size={"lg"} className="w-full" disabled />
        </CardFooter>
      </Card>
    </li>
  );
}
