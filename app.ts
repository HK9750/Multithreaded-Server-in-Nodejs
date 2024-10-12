import express, { Express } from "express";
import cluster, { Worker } from "cluster";

export function runApp() {
  const app: Express = express();
  const PORT = 3000;

  app.listen(PORT, () => {
    console.log(`The server has started running on port:${PORT}`);
  });

  process.on("message", (msg: string) => {
    if (msg === "shutdown") {
      console.log(`Worker with pid:${process.pid} is terminating`);
      process.exit(0);
    }
  });

  process.on("SIGINT", () => {
    console.log(`Worker with pid:${process.pid} is interrupted`);
  });
}

export function forkNewWorker(): void {
  const worker: Worker = cluster.fork();
  console.log(`Starting the worker with pid:${worker.process.pid}`);

  worker.on("message", (msg: string) => {
    if (msg === "worker:ready") {
      console.log(
        `Worker with the pid:${worker.process.pid} waiting for the connection`
      );
    }
  });

  worker.on("online", () => {
    console.log(`Worker with the pid:${worker.process.pid} is online!!`);
  });
}

export function shutDownAllWorkers() {
  for (const id in cluster.workers) {
    const worker = cluster.workers[id];
    if (worker) {
      console.log(`Shutting the worker with pid:${worker.process.pid}`);
      worker.send("shutdown");
      setTimeout(() => {
        worker.kill("SIGTERM");
      }, 5000);
    }
  }

  setTimeout(() => {
    console.log(`Master process exiting.....`);
    process.exit(0);
  }, 10000);
}

export function restartWorker(worker: Worker) {
  console.log(`Worker with pid:${worker.process.pid} is restarting`);
  worker.disconnect();
  worker.on("exit", () => {
    if (!worker.exitedAfterDisconnect) return;
    console.log(
      `Worker ${worker.process.pid} exited. Starting a new worker...`
    );
    forkNewWorker();
  });
}
