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
  origin: ["http://localhost:5173", "https://aishwarya-kanago.github.io"],
  optionsSuccessStatus: 200,
  methods: "GET, PUT, POST, PATCH, DELETE",
};

app.use(cors(corsOptions));

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const productsRouter = require("./routes/products");
app.use("/products", productsRouter);

app.listen(5000, () => console.log("Server Started"));
