import { writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const port = 8000;
const secret = randomBytes(32).toString("hex");
const pepper = randomBytes(32).toString("hex");

const envContent = `PORT=${port}\nSECRET=${secret}\nPEPPER=${pepper}\n`;
writeFileSync(".env", envContent, { encoding: "utf8" });
console.log("Created .env file.");