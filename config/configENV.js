import dotenv from "dotenv"

dotenv.config();
const config = {
    PIN: process.env.HSM_PIN,
    LIB: process.env.LIB_HSM,
}

export default config;