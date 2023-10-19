import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const CREDENTIALS = process.env.CREDENTIALS || "empty";
const APP_VERSION = process.env.npm_package_version || "1.0.1";

export default { PORT, CREDENTIALS, APP_VERSION };
