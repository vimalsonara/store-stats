interface DashboardCardProps {
  cardTitle: string;
  total: number;
}

export default function DashboardCard({
  cardTitle,
  total,
}: DashboardCardProps) {
  return (
    <div className="border p-2 text-center rounded-lg">
      <div className="border-b p-2">{cardTitle}</div>
      <div className="p-2">{total}</div>
    </div>
  );
}
