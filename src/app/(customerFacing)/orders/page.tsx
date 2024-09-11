"use client";

import React from "react";
import { useFormState } from "react-dom";
import { emailOrderHistory } from "@/app/_actions/order";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ErrorMessage";
import SubmitButton from "@/components/SubmitButton";

export default function MyOrdersPage() {
  const [data, action] = useFormState(emailOrderHistory, {});

  return (
    <form action={action} className="max-2-xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Enter your email and we will email you your order history and
            download links.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" id="email" required />

            {data.error && <ErrorMessage error={data.error} />}
          </div>
        </CardContent>

        <CardFooter>
          {data.message ? (
            <p className="text-green-500">{data.message}</p>
          ) : (
            <SubmitButton
              size="lg"
              className="w-full"
              initialText="Send"
              pendingText="Sending..."
            />
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
