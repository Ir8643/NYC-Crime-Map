import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// @ts-ignore - react-chartjs-2 types may not be fully up to date
import { Bar, Line } from "react-chartjs-2";
import type { NormalizedIncident } from "../types";
import { CATEGORY_COLORS } from "../utils/categoryMapper";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  incidents: NormalizedIncident[];
}

export const Charts: React.FC<ChartsProps> = ({ incidents }) => {
  const categoryData = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return { labels: [], data: [], colors: [] };
    }

    const counts: Record<string, number> = {};
    incidents.forEach((inc) => {
      if (inc && inc.category) {
        counts[inc.category] = (counts[inc.category] || 0) + 1;
      }
    });

    const labels = Object.keys(counts);
    const data = labels.map((label) => counts[label]);
    const colors = labels.map(
      (label) => CATEGORY_COLORS[label] || CATEGORY_COLORS.OTHER
    );

    return { labels, data, colors };
  }, [incidents]);

  const hourData = useMemo(() => {
    const counts = Array(24).fill(0);
    if (incidents && incidents.length > 0) {
      incidents.forEach((inc) => {
        if (inc && inc.date) {
          try {
            const hour = new Date(inc.date).getHours();
            if (!isNaN(hour) && hour >= 0 && hour < 24) {
              counts[hour]++;
            }
          } catch (e) {
            console.warn("Invalid date in incident:", inc);
          }
        }
      });
    }
    return counts;
  }, [incidents]);

  const categoryChartData = {
    labels: categoryData.labels,
    datasets: [
      {
        label: "Incidents",
        data: categoryData.data,
        backgroundColor: categoryData.colors.map((c) => `${c}80`),
        borderColor: categoryData.colors,
        borderWidth: 1,
      },
    ],
  };

  const hourChartData = {
    labels: Array.from({ length: 24 }, (_, i) => i),
    datasets: [
      {
        label: "Incidents per Hour",
        data: hourData,
        borderColor: "rgba(234, 179, 8, 1)",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#9CA3AF" },
        grid: { color: "#374151" },
      },
      x: {
        ticks: { color: "#9CA3AF" },
        grid: { color: "#374151" },
      },
    },
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Incidents by Category</h2>
        <div className="h-[300px]">
          <Bar data={categoryChartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Incidents by Hour</h2>
        <div className="h-[300px]">
          <Line
            data={hourChartData}
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                x: {
                  ...chartOptions.scales.x,
                  title: {
                    display: true,
                    text: "Hour of Day",
                    color: "#9CA3AF",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};
