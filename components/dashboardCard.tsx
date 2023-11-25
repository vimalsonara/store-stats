import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DashboardCardProps {
  cardTitle: string;
  total: number;
  icon: ReactNode;
}

export default function DashboardCard({
  cardTitle,
  total,
  icon,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-3xl font-bold">{total}</div>
        {icon}
      </CardContent>
    </Card>
  );
}
