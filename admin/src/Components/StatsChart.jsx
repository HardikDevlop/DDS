import { useRef, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Skeleton } from "@mui/material";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const CHART_COLORS = {
  fill: [
    "rgba(99, 102, 241, 0.75)",
    "rgba(16, 185, 129, 0.75)",
    "rgba(245, 158, 11, 0.75)",
  ],
  border: ["rgb(99, 102, 241)", "rgb(16, 185, 129)", "rgb(245, 158, 11)"],
};

function useContainerSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () =>
      setSize({ width: el.offsetWidth, height: el.offsetHeight });

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}

function calculateStepSize(data) {
  if (!data) return 5;
  const maxValue = Math.max(
    data.products || 0,
    data.users || 0,
    data.orders || 0
  );
  if (maxValue <= 10) return 2;
  if (maxValue <= 50) return 5;
  if (maxValue <= 100) return 10;
  return Math.ceil(maxValue / 10);
}

export default function StatsChart({ data, loading }) {
  const containerRef = useRef(null);
  const { width, height } = useContainerSize(containerRef);
  const isSmall = width > 0 && width < 640;

  const chartData = {
    labels: ["Services", "Users", "Orders"],
    datasets: [
      {
        label: "Total Count",
        backgroundColor: CHART_COLORS.fill,
        borderColor: CHART_COLORS.border,
        borderWidth: 1,
        borderRadius: 8,
        data: [data?.products || 0, data?.users || 0, data?.orders || 0],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          padding: isSmall ? 12 : 20,
          font: { size: isSmall ? 11 : 12 },
          usePointStyle: true,
          color: "#475569",
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { size: isSmall ? 11 : 13 },
        bodyFont: { size: isSmall ? 11 : 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { drawBorder: false, color: "rgba(0, 0, 0, 0.05)" },
        ticks: {
          stepSize: calculateStepSize(data),
          padding: 8,
          font: { size: isSmall ? 10 : 11 },
          color: "#64748b",
        },
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          padding: 8,
          font: { size: isSmall ? 10 : 11 },
          color: "#64748b",
        },
      },
    },
    animation: { duration: 800, easing: "easeOutQuart" },
    layout: {
      padding: {
        left: isSmall ? 4 : 8,
        right: isSmall ? 4 : 8,
        top: isSmall ? 4 : 8,
        bottom: isSmall ? 4 : 8,
      },
    },
  };

  if (loading) {
    return (
      <div ref={containerRef} className="h-full w-full flex items-center justify-center min-h-[200px]">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            borderRadius: "12px",
            bgcolor: "rgba(0, 0, 0, 0.04)",
          }}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full min-h-[200px]">
      <Bar data={chartData} options={options} redraw={false} />
    </div>
  );
}
