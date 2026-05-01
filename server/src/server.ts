import express from 'express';
import userRoutes from './routes/userRoutes.js';


import prisma from './config/prisma.js';
import { requestLogger } from './middlewares/loggers.js';
import { errorHandler } from "./middlewares/errorHandlers.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import cors from 'cors';



const app = express();
const port = Number(process.env.PORT ?? 3000);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected.");

    app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}.`);
    });
  }
  catch (error){
    console.error("Unable to connect to the database:", error);
  };
}

// Swagger - dev only
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
};

if (process.env.NODE_ENV !== "production") {
  // En développement : CORS permissif
  app.use(cors());
} else {
  // En production : CORS restreint
  app.use(cors(corsOptions));
}

app.use(express.json());

//logger

app.use(requestLogger)

// Mode test temporaire: on ne monte que les routes users
app.use('/api/users', userRoutes);


//app.use('/', rootRoutes);

app.use('/',express.static('public'));

app.use(errorHandler);

startServer();
