const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");

const app = express();

app.use(cors());

// Read Excel Workbook
const workbook = XLSX.readFile(
  "./data/intern_assignment_support_pack_dev_only_v3.xlsx"
);

// Read Sheets
const jiraSheet = workbook.Sheets["Fact_Jira_Issues"];
const prSheet = workbook.Sheets["Fact_Pull_Requests"];
const deploymentSheet = workbook.Sheets["Fact_CI_Deployments"];
const bugSheet = workbook.Sheets["Fact_Bug_Reports"];

// Convert Sheets to JSON
const jiraData = XLSX.utils.sheet_to_json(jiraSheet);
const prData = XLSX.utils.sheet_to_json(prSheet);
const deploymentData = XLSX.utils.sheet_to_json(deploymentSheet);
const bugData = XLSX.utils.sheet_to_json(bugSheet);

// API Route
app.get("/metrics", (req, res) => {

  // =========================
  // Lead Time
  // =========================
  const avgLeadTime =
    deploymentData.reduce(
      (sum, item) => sum + item.lead_time_days,
      0
    ) / deploymentData.length;

  // =========================
  // Cycle Time
  // =========================
  const avgCycleTime =
    jiraData.reduce(
      (sum, item) => sum + item.cycle_time_days,
      0
    ) / jiraData.length;

  // =========================
  // Bug Rate
  // =========================
  const escapedBugs = bugData.filter(
    (bug) => bug.escaped_to_prod === "Yes"
  ).length;

  const completedIssues = jiraData.filter(
    (issue) => issue.status === "Done"
  ).length;

  const bugRate =
    (escapedBugs / completedIssues) * 100;

  // =========================
  // Deployment Frequency
  // =========================
  const deploymentFrequency = deploymentData.length;

  // =========================
  // PR Throughput
  // =========================
  const prThroughput = prData.filter(
    (pr) => pr.status === "merged"
  ).length;

  // =========================
  // Monthly Chart Data
  // =========================
  const monthlyData = {};

  // Jira Completed Issues
  jiraData.forEach((issue) => {

    const month = issue.month_done;

    if (!month) return;

    if (!monthlyData[month]) {
      monthlyData[month] = {
        month,
        completedIssues: 0,
        bugs: 0,
      };
    }

    if (issue.status === "Done") {
      monthlyData[month].completedIssues++;
    }
  });

  // Bug Data
  bugData.forEach((bug) => {

    const month =
      bug.month_found ||
      bug.month_done ||
      bug.month_created ||
      bug.month ||
      "Unknown";

    if (!month) return;

    if (!monthlyData[month]) {
      monthlyData[month] = {
        month,
        completedIssues: 0,
        bugs: 0,
      };
    }

    monthlyData[month].bugs++;
  });

  // Convert Object → Array
  const chartData = Object.values(monthlyData);

  // Final Response
  res.json({
    leadTime: avgLeadTime.toFixed(1),
    cycleTime: avgCycleTime.toFixed(1),
    bugRate: bugRate.toFixed(1),
    deploymentFrequency,
    prThroughput,
    chartData,
  });
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});