import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { LastSevenDaysPurchase } from "@/types/types";

interface BarChartProps {
  purchaseData: LastSevenDaysPurchase[];
}

export default function BarChart({ purchaseData }: BarChartProps) {
  const dateArray = [];
  const amountArray = [];

  for (const obj of purchaseData) {
    dateArray.push(obj.date);
    amountArray.push(obj.amount);
  }

  const options = {
    responsive: true,
  };

  const labels = dateArray;

  const data = {
    labels,
    datasets: [
      {
        label: "Last 7 days",
        data: amountArray,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
