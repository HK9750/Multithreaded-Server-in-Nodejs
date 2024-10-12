import cluster, { Worker } from "cluster";
import os from "os";
import { forkNewWorker, shutDownAllWorkers, restartWorker } from "./app";

if (cluster.isPrimary) {
  const numOfCpus = os.cpus().length;

  for (let i = 0; i < numOfCpus; i++) {
    forkNewWorker();
  }

  cluster.on("exit", (worker: Worker, code: number, signal: string) => {
    console.error(
      `Worker ${worker.process.pid} exited with code ${code} (${signal}). Restarting...`
    );
    forkNewWorker();
  });

  process.on("SIGHUP", () => {
    console.log(
      `Signal is Hangup and graceful restart of the worker have begin`
    );
    for (const id in cluster.workers) {
      if (cluster.workers[id]) {
        restartWorker(cluster.workers[id] as Worker);
      }
    }
  });

  process.on("SIGTERM", () => {
    console.log(`Primary process is shutting down .....`);
    shutDownAllWorkers();
  });
} else {
  import("./app").then((app) => app.runApp());
}
