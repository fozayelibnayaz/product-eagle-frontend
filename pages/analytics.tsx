import React from "react";
import useRequireAuth from "../pages/hooks/useRequireAuth";
import { useProductStatusQuery } from "../store/slices/authApi";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AnalyticsPage() {
  useRequireAuth();
  const { data, isLoading } = useProductStatusQuery();

  const counts = data?.counts || {};
  const labels = Object.keys(counts);
  const values = Object.values(counts);

  const chartData = {
    labels,
    datasets: [{ data: values, label: "Products" }]
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
        {isLoading ? <div>Loading...</div> : (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg mb-2">Products by status</h2>
            <div className="w-80">
              <Pie data={chartData as any} />
            </div>
            <div className="mt-6">
              <h3 className="font-medium">Raw counts</h3>
              <pre>{JSON.stringify(counts, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
