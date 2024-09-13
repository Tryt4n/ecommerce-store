import React, { type ComponentProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardCardProps = {
  title: string;
  subtitle?: string;
  body?: string;
  className?: ComponentProps<typeof Card>["className"];
  children?: React.ReactElement;
};

export default function AdminDashboardCard({
  title,
  subtitle,
  body,
  className,
  children,
}: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>

      <CardContent>
        {!children && body && <p>{body}</p>}
        {children}
      </CardContent>
    </Card>
  );
}
