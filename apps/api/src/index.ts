import dotenv from "dotenv";

/* CONFIGURE ENVIRONMENT VARIABLES */
dotenv.config();

import { app } from "./app.js";
// import connectDB from "./config/database.js";

/* CONNECT TO DATABASE */
// connectDB();

/* SET PORT */
const PORT = Number(process.env.PORT) || 8001;

/* START SERVER */
app.listen(PORT, () => {
   console.log(`Server is running on port http://localhost:${PORT}`);
});
