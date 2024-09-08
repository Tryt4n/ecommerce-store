import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

export default function DashboardCard({
  title,
  subtitle,
  body,
}: DashboardCardProps) {
  return (
    <li>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{body}</p>
        </CardContent>
      </Card>
    </li>
  );
}
