// File: pages/analytics.tsx

import React from "react";
// Assuming the correct path is one level up:
import useRequireAuth from "../pages/hooks/useRequireAuth";
import { useProductStatusQuery } from "../store/slices/authApi";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useRouter } from "next/router";
import "./analytics.css"; // IMPORTANT: Import the new CSS file

// Register the necessary Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Define color palettes for the chart segments (CRITICAL FOR RENDERING)
// Note: We use the theme's colors for better integration
const THEME_COLORS = [
  "rgba(69, 225, 250, 0.8)",  // Light Blue/Cyan from primary-btn end
  "rgba(62, 189, 155, 0.8)",  // Teal/Green from primary-btn start
  "rgba(145, 209, 251, 0.8)", // Light Blue from header text
  "rgba(255, 102, 102, 0.8)", // Soft Red (for errors/alerts)
  "rgba(153, 102, 255, 0.6)", // Purple (Fallback)
];
const BORDER_COLORS = [
  "rgba(69, 225, 250, 1)",
  "rgba(62, 189, 155, 1)",
  "rgba(145, 209, 251, 1)",
  "rgba(255, 102, 102, 1)",
  "rgba(153, 102, 255, 1)",
];

export default function AnalyticsPage() {
  useRequireAuth();
  const router = useRouter();
  const { data, isLoading, isError } = useProductStatusQuery();

  const counts = data?.counts || {};
  const labels = Object.keys(counts);
  const values = Object.values(counts);

  const chartData = {
    labels,
    datasets: [{
      data: values,
      label: "Products",
      // Use theme colors for integration
      backgroundColor: labels.map((_, i) => THEME_COLORS[i % THEME_COLORS.length]),
      borderColor: labels.map((_, i) => BORDER_COLORS[i % BORDER_COLORS.length]),
      borderWidth: 1,
    }]
  };

  const hasData = labels.length > 0;

  return (
    // Apply dark gradient background class
    <div className="products-bg">
      {/* Container to center content */}
      <div className="max-w-4xl mx-auto">

        {/* Apply glass box style */}
        <div className="products-glass-box analytics-glass-box">

          {/* Header and Menu Button */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-white">Product Analytics</h1>
            <button
              onClick={() => router.push("/products")}
              className="secondary-btn" // Reusing secondary button style
            >
              Go to Products
            </button>
          </div>

          {isLoading ? (
            <div className="loading-text">Loading Data...</div>
          ) : isError ? (
            <div className="error-box">
              Error fetching data. Check your console for API errors.
            </div>
          ) : (
            <>
              <div className="chart-box">
                <h2 className="text-xl mb-4 font-medium text-center">Products by Status</h2>
                <div className="chart-wrapper">
                  {hasData ? (
                    // FIX: Chart renders when data is present
                    <Pie data={chartData as any} />
                  ) : (
                    <div className="no-data-box">
                      No product data found. Please add products.
                    </div>
                  )}
                </div>
              </div>

              {/* Raw Counts Display - using pre tag with dark theme style */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(59, 70, 110, 0.5)' }}>
                <h3 className="text-lg font-medium mb-2" style={{color: '#91d1fb'}}>Raw Counts</h3>
                <pre className="raw-counts-pre">{JSON.stringify(counts, null, 2)}</pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
