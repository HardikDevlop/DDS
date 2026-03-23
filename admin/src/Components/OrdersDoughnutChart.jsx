import { useRef, useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Skeleton } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

// Only Pending, Cancelled, Completed (same colors as Manage Orders badges)
const STATUS_CONFIG = [
  { status: "Pending", fill: "rgba(245, 158, 11, 0.85)", border: "rgb(245, 158, 11)" },
  { status: "Cancelled", fill: "rgba(239, 68, 68, 0.85)", border: "rgb(239, 68, 68)" },
  { status: "Completed", fill: "rgba(16, 185, 129, 0.85)", border: "rgb(16, 185, 129)" },
];

function useContainerSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export default function OrdersDoughnutChart({ orderStatusCounts = {}, loading }) {
  const containerRef = useRef(null);
  const { width } = useContainerSize(containerRef);
  const isSmall = width > 0 && width < 400;

  const labels = STATUS_CONFIG.map((c) => c.status);
  const data = STATUS_CONFIG.map((c) => orderStatusCounts[c.status] ?? 0);
  const total = data.reduce((s, n) => s + n, 0);

  const chartData = {
    labels: total > 0 ? labels : ["No orders yet"],
    datasets: [
      {
        data: total > 0 ? data : [1],
        backgroundColor: total > 0
          ? STATUS_CONFIG.map((c) => c.fill)
          : ["rgba(148, 163, 184, 0.4)"],
        borderColor: total > 0
          ? STATUS_CONFIG.map((c) => c.border)
          : ["rgb(148, 163, 184)"],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%",
    plugins: {
      legend: {
        position: isSmall ? "bottom" : "right",
        labels: {
          boxWidth: 12,
          padding: 10,
          font: { size: isSmall ? 10 : 11 },
          usePointStyle: true,
          color: "#475569",
          generateLabels: (chart) => {
            const chartData = chart.data;
            const dataset = chartData.datasets?.[0];
            if (!dataset?.data?.length) return [{ text: "No orders yet", fillStyle: "#94a3b8" }];
            if (total === 0)
              return [{ text: "No orders yet", fillStyle: dataset.backgroundColor[0], strokeStyle: dataset.borderColor?.[0], lineWidth: 1, hidden: false, index: 0 }];
            return chartData.labels.map((label, i) => ({
              text: `${label} (${dataset.data[i] ?? 0})`,
              fillStyle: dataset.backgroundColor[i],
              strokeStyle: dataset.borderColor?.[i],
              lineWidth: 1,
              hidden: false,
              index: i,
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            if (total === 0) return "No orders yet";
            const value = ctx.raw || 0;
            const pct = ((value / total) * 100).toFixed(1);
            return `${ctx.label}: ${value} (${pct}%)`;
          },
        },
      },
      centerCount: { total },
    },
    animation: { duration: 600, easing: "easeOutQuart" },
  };

  const centerCountPlugin = {
    id: "centerCount",
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      if (!chartArea || chart.config.options.plugins?.centerCount == null) return;
      const total = chart.config.options.plugins.centerCount.total;
      ctx.save();
      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2 - 8;
      ctx.fillText(total.toString(), x, y);
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText("Total orders", x, y + 22);
      ctx.restore();
    },
  };

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="h-full w-full flex items-center justify-center min-h-[200px]"
      >
        <Skeleton
          variant="circular"
          width={160}
          height={160}
          animation="wave"
          sx={{ bgcolor: "rgba(0, 0, 0, 0.04)" }}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full min-h-[200px] flex items-center justify-center">
      <div className="w-full max-w-[300px] aspect-square">
        <Doughnut data={chartData} options={options} plugins={[centerCountPlugin]} />
      </div>
    </div>
  );
}
