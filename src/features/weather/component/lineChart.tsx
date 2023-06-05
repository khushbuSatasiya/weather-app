import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  ChartData,
  CategoryScale,
} from "chart.js";
import React, { useEffect, useRef } from "react";
import { formattedTime } from "shared/util/utility";

interface IProps {
  chartData: any;
}

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);
const LineChart: React.FC<IProps> = (props) => {
  const { chartData } = props;
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      chartRef.current?.chartInstance.destroy();
    }
  }, []);

  const data = {
    labels: chartData.map((data: any) => formattedTime(data.time)),
    datasets: [
      {
        label: "Sales",
        data: chartData.map((data: any) => data.temp_c),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          color: "#ffffff",
          font: {
            family: "Sofia-pro",
            weight: "700",
            size: 15,
          },
        },
      },
      x: {
        ticks: {
          color: "#ffffff",
          font: {
            family: "Sofia-pro",
            weight: "700",
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div>
      <Line id={`${Math.random()}`} data={data} options={chartOptions} />
    </div>
  );
};

export default LineChart;
