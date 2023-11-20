import { VendorSummary } from "@/types/types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Vendor purchase summary",
      },
    },
  };

  return <Pie data={data} options={options} width={200} height={200} />;
}
