import { initMonitorAutoRefresh } from "./render-monitor.js";

document.addEventListener("DOMContentLoaded", () => {
  initMonitorAutoRefresh({
    bracketTarget: document.getElementById("monitorBracketArea"),
    podiumTarget: document.getElementById("monitorPodiumArea"),
    statusTarget: document.getElementById("monitorStatus"),
    infoTarget: document.getElementById("monitorCompetitionInfo")
  });
});
