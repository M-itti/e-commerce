import express from "express";
import morgan from "morgan";
import process from "node:process";

import dbRouter from "./routes/db.mjs";
import authRouter from "./routes/auth.mjs";
import authProduct from "./routes/product.mjs";

const app = express();

const port = process.env.PORT || 5000;

app.use(morgan("dev"));

// encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the route file
app.use("/db", dbRouter);
app.use("/", authRouter);
app.use("/product", authProduct);

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
