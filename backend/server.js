require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, { family: 4 });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const cors = require("cors");
var corsOptions = {
  // Allow requests from the frontend served by ingress (same-origin)
  // In development, allow any origin so Minikube + nip.io host works.
  origin: true,
  optionsSuccessStatus: 200,
  methods: "GET, PUT, POST, PATCH, DELETE",
};

app.use(cors(corsOptions));

const usersRouter = require("./routes/users");
// Mount API routers under /api so ingress path /api/* maps correctly
app.use("/api/users", usersRouter);

const productsRouter = require("./routes/products");
app.use("/api/products", productsRouter);

const server = app.listen(3000, "0.0.0.0", () => console.log("Server Started"));
server.on("error", console.error);
console.log("Listening on", server.address());

// ---- PROMETHEUS METRICS SETUP ----
const client = require("prom-client");

// Enable collection of default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics();

// Create custom histogram for request duration
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 300, 500, 1000, 2000, 5000],
});

// Middleware to measure API latency
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
// ---- END PROMETHEUS METRICS SETUP ----

//fix rebuild
