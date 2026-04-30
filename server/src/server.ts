import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminUserRouters from './routes/adminUserRoutes.js'
import prodRoutes from './routes/prodRoutes.js';
import jwtRoutes from './routes/jwtRoutes.js';
import catRoutes from './routes/catRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';


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

//Toutes les routes


app.use('/api/users', userRoutes); //routes vers les fonctionnalités utilisateur

app.use('/api/auth', authRoutes); //routes vers l'authentification utilisateur

app.use('/api/admin',adminUserRouters);//routes vers l'accès administrateurs

app.use('/api/products',prodRoutes);//routes vers les produits

app.use('/api/categories',catRoutes);//Routes vers les catégories

app.use('/api/cart',cartRoutes);//routes vers le panier

app.use('/api/orders',orderRoutes);//routes vers les commandes


//app.use('/', rootRoutes);

app.use('/',express.static('public'));

app.use(errorHandler);

startServer();
