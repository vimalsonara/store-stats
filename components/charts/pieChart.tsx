import { VendorSummary } from "@/types/types";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

interface PirChartProps {
  vendorSummaryData: VendorSummary[];
}

export default function PieChart({ vendorSummaryData }: PirChartProps) {
  const vendorArray = [];
  const amountArray = [];

  for (const obj of vendorSummaryData) {
    vendorArray.push(obj.vendorName);
    amountArray.push(obj.amount);
  }

  const data = {
    labels: vendorArray,
    datasets: [
      {
        label: "Total Purchase",
        data: amountArray,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      colors: {
        forceOverride: true,
      },
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Vendor purchase summary",
      },
    },
  };

  return <Pie data={data} options={options} width={200} height={200} />;
}
