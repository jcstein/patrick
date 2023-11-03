import { invoke } from "@tauri-apps/api/tauri";

let celestiaLogsEl: HTMLElement | null;

async function celestiaVersion() {
  const output = await invoke("celestia_version");
  if (celestiaLogsEl) {
    celestiaLogsEl.style.textAlign = 'left';
    celestiaLogsEl.textContent += `Celestia light node version: ${String(output)}\n`;
    celestiaLogsEl.scrollIntoView(false);
  }
}

async function celestiaInit() {
  const output = await invoke("celestia_init");
  if (celestiaLogsEl) {
    celestiaLogsEl.style.textAlign = 'left';
    celestiaLogsEl.textContent += `Initalize Celestia light node: ${String(output)}\n`;
    celestiaLogsEl.scrollIntoView(false);
  }
}

let isRunning = false;
let shouldUpdateLogs = true;

async function celestiaStart() {
  isRunning = true;
  shouldUpdateLogs = true;
  await invoke("celestia_start");
  if (celestiaLogsEl) {
    celestiaLogsEl.style.textAlign = 'left';
    celestiaLogsEl.textContent += `Starting Celestia light node...\n`;
    celestiaLogsEl.scrollIntoView(false);
  }

  // Start a loop to continuously get the latest output
  while (isRunning) {
    const output = (await invoke("get_output")) as string[];
    if (celestiaLogsEl && shouldUpdateLogs) {
      celestiaLogsEl.textContent += output.join('\n') + '\n';
      celestiaLogsEl.scrollIntoView(false);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for 1 second
  }
}

window.addEventListener("DOMContentLoaded", () => {
  celestiaLogsEl = document.querySelector("#celestia-logs");

  // Add event listener for the "Check version" button
  document.querySelector("#run-celestia")?.addEventListener("click", celestiaVersion);

  // Add event listener for the "Initialize light node" button
  document.querySelector("#init-celestia")?.addEventListener("click", celestiaInit);

  // Add event listener for the "Start light node" button
  document.querySelector("#start-celestia")?.addEventListener("click", celestiaStart);

  // Add event listener for the "Stop" button
  document.querySelector("#stop-celestia")?.addEventListener("click", async () => {
    const message = await invoke("celestia_stop");
    isRunning = false;
    if (celestiaLogsEl) {
      celestiaLogsEl.style.textAlign = 'left';
      celestiaLogsEl.textContent += `Stopping Celestia light node...\n${message}\n`;
      celestiaLogsEl.scrollIntoView(false);
    }
  });
  
  // Add event listener for the "Clear Logs" button
  document.querySelector("#clearLogs")?.addEventListener("click", () => {
    if (celestiaLogsEl) {
      celestiaLogsEl.textContent = '';
      shouldUpdateLogs = false;
    }
  });
});