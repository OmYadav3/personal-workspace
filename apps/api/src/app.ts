import express, { type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/* MIDDLEWARES - HELMET WHICH PROVIDES SECURITY FOR HEADERS */
app.use(helmet());

/* MIDDLEWARES - CORS WHICH ALLOWS US TO ACCESS RESOURCES FROM DIFFERENT ORIGINS */
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

/* MIDDLEWARES - BODY PARSING WHICH ALLOWS US TO ACCESS JSON DATA */
app.use(express.json());

/* MIDDLEWARES - URL ENCODED BODY PARSING WHICH ALLOWS US TO ACCESS FORM DATA */
app.use(express.urlencoded({ extended: true }));

/* MIDDLEWARES - COOKIE PARSING WHICH ALLOWS US TO ACCESS COOKIES */
app.use(cookieParser());

/* LOGGING THE REQUEST */

app.use((req, res, next) => {
   const startTime = Date.now();

   res.on("finish", () => {
      console.log(
         `${req.method} ${req.originalUrl} | ${res.statusCode} | ${Date.now() - startTime}ms`,
      );
   });

   next();
});

/* HEALTH CHECK ENDPOINT */
app.get("/", (_, res: Response) => {
   return res.status(200).json({
      success: true,
      message: "Server is Healthy Now ",
   });
});

/* IMPORT ROUTES */
import authRoute from "./modules/auth/auth.route.js";

/* IMPLEMENT ROUTES */
app.use("/api/v1/auth", authRoute);

/* MIDDLEWARES - ERROR HANDLER */
app.use(errorMiddleware);

export { app };
