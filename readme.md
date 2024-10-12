# Multi-Threaded Node.js Server

This project is a multi-threaded Node.js server built using TypeScript. It leverages the `cluster` module to efficiently handle multiple requests by utilizing all available CPU cores. The server dynamically spawns worker processes to distribute the load and improve performance.

## Features

- Multi-threaded processing using Node.js `cluster` module
- Efficient load distribution across worker processes
- Graceful shutdown and restart capabilities
- Built with TypeScript for type safety and scalability

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 14+ recommended)
- [npm](https://www.npmjs.com/)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HK9750/Multithreaded-Server-in-Nodejs.git
cd multithreadservernodejs
```
