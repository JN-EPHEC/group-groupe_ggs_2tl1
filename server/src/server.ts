import express from 'express';
import userRoutes from './routes/userRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authControllers from './routes/authRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import prodRoutes from './routes/prodRoutes.js';
import catRoutes from './routes/catRoutes.js';
import productRoutes from './routes/productRoutes.js';
import verifyAuth from './middlewares/requireAuth.js';
import verifyAdmin from './middlewares/requireAdmin.js';
import authRoutes from './routes/authRoutes.js';
import checkoutRoutes from "./routes/checkoutRoutes.js";


import prisma from './config/prisma.js';
import { requestLogger } from './middlewares/loggers.js';
import { errorHandler } from "./middlewares/errorHandlers.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import cors from 'cors';
import cookieParser from "cookie-parser";




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

app.use(cors(corsOptions));

app.use(express.json());

//logger

app.use(requestLogger)

//middleware express lit automatiquement les cookies envoyés par le navigateur et les met dans req.cookies
//pas mal ce bazar
app.use(cookieParser());

app.use('/api/admin',verifyAuth,verifyAdmin,adminUserRoutes)
app.use('/api/users', verifyAuth,userRoutes);
app.use('/api/addresses', verifyAuth,addressRoutes);
app.use('/api/orders', verifyAuth,orderRoutes);
app.use('/api/auth', authControllers)
app.use('/api/products', prodRoutes);
app.use('/api/categories', catRoutes);
app.use('/api/produits', productRoutes);
app.use('/api/auth/',verifyAuth,authRoutes);
app.use("/api/checkout", verifyAuth, checkoutRoutes);


//app.use('/', rootRoutes);

app.use('/',express.static('public'));

app.use(errorHandler);

startServer();
