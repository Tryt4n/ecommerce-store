import React, { type ComponentProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartDataDropdownMenu from "./ChartDataDropdownMenu";

type DashboardCardProps = {
  title: string;
  subtitle?: string;
  queryKey?: string;
  body?: string;
  className?: ComponentProps<typeof Card>["className"];
  children?: React.ReactElement;
};

export default function AdminDashboardCard({
  title,
  subtitle,
  queryKey,
  body,
  className,
  children,
}: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="relative">
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}

        {queryKey && (
          <ChartDataDropdownMenu
            className="absolute right-4 top-2.5"
            queryKey={queryKey}
          />
        )}
      </CardHeader>

      <CardContent>
        {!children && body && <p>{body}</p>}
        {children}
      </CardContent>
    </Card>
  );
}
