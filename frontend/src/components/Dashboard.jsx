import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {

  const [metrics, setMetrics] = useState(null);

  useEffect(() => {

    axios
      .get("http://localhost:5000/metrics")
      .then((response) => {
        setMetrics(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  // Loading State
  if (!metrics) {
    return (
      <div className="text-white text-3xl p-10">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-950 text-white p-8">

      {/* Heading */}

      <h1 className="text-4xl font-bold mb-8">
        Developer Productivity Dashboard
      </h1>

      {/* Metric Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

        {/* Lead Time */}

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold">
            Lead Time
          </h2>

          <p className="text-4xl mt-3">
            {metrics.leadTime}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Average time from commit to deployment
          </p>

        </div>

        {/* Cycle Time */}

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold">
            Cycle Time
          </h2>

          <p className="text-4xl mt-3">
            {metrics.cycleTime}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Average time to complete a Jira issue
          </p>

        </div>

        {/* Bug Rate */}

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold">
            Bug Rate
          </h2>

          <p className="text-4xl mt-3">
            {metrics.bugRate}%
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Percentage of bugs escaped to production
          </p>

        </div>

        {/* Deployment Frequency */}

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold">
            Deployment Frequency
          </h2>

          <p className="text-4xl mt-3">
            {metrics.deploymentFrequency}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Total successful deployments
          </p>

        </div>

        {/* PR Throughput */}

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold">
            PR Throughput
          </h2>

          <p className="text-4xl mt-3">
            {metrics.prThroughput}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Number of merged pull requests
          </p>

        </div>

      </div>

      {/* Charts */}

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-10">

        <h2 className="text-2xl font-bold mb-6">
          Productivity Trends
        </h2>

        <ResponsiveContainer width="100%" height={350}>

          <BarChart data={metrics.chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />

            <Bar
              name="Completed Issues"
              dataKey="completedIssues"
              fill="#40a9ff"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              name="Bugs"
              dataKey="bugs"
              fill="#ff4d4f"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* AI Insights */}

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-10">

        <h2 className="text-2xl font-bold mb-6">
          AI Insights
        </h2>

        <div className="space-y-4">

          <div className="bg-gray-700 p-4 rounded-xl">

            {
              Number(metrics.bugRate) > 10
                ? "⚠️ High bug rate detected. Testing quality may need improvement."
                : "✅ Bug rate is stable and under control."
            }

          </div>

          <div className="bg-gray-700 p-4 rounded-xl">

            {
              Number(metrics.leadTime) > 5
                ? "⚠️ Lead time is higher than expected. PR review delays may exist."
                : "✅ Lead time looks healthy and delivery flow is efficient."
            }

          </div>

          <div className="bg-gray-700 p-4 rounded-xl">

            {
              Number(metrics.prThroughput) > 40
                ? "✅ Strong PR throughput indicates active development velocity."
                : "⚠️ PR throughput is moderate and can be optimized further."
            }

          </div>

          <div className="bg-gray-700 p-4 rounded-xl">

            {
              Number(metrics.deploymentFrequency) < 10
                ? "⚠️ Deployment frequency is low. CI/CD automation can be improved."
                : "✅ Deployment activity looks healthy and consistent."
            }

          </div>

        </div>

      </div>

      {/* Recommendations */}

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-10">

        <h2 className="text-2xl font-bold mb-6">
          Recommendations
        </h2>

        <div className="space-y-4">

          <div className="bg-gray-700 p-4 rounded-xl">

            {
              Number(metrics.bugRate) > 10
                ? "🛠️ Increase automated testing and QA reviews to reduce escaped bugs."
                : "✅ Current bug management practices are effective."
            }

          </div>

          <div className="bg-gray-700 p-4 rounded-xl">

            {
              Number(metrics.leadTime) > 5
                ? "⏳ Optimize PR review workflow to reduce delivery delays."
                : "✅ Development workflow efficiency looks healthy."
            }

          </div>

          <div className="bg-gray-700 p-4 rounded-xl">

            {
              Number(metrics.deploymentFrequency) < 10
                ? "🚀 Improve CI/CD automation for more frequent deployments."
                : "✅ Deployment pipeline activity is stable."
            }

          </div>

          <div className="bg-gray-700 p-4 rounded-xl">

            {
              Number(metrics.prThroughput) > 40
                ? "📈 Team collaboration and code throughput are performing strongly."
                : "📊 Consider improving task distribution and review speed."
            }

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="text-center text-gray-400 mt-10 pb-4">
        Built using React, Node.js, Express, and Recharts
      </div>

    </div>

  );
}

export default Dashboard;