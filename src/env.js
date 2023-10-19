import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const CREDENTIALS = process.env.CREDENTIALS || "empty";

export default { PORT, CREDENTIALS };
