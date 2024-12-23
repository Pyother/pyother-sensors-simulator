#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

try {
    console.log("Installing frontend dependencies...");
    process.chdir(path.join(__dirname, "../frontend"));
    execSync("npm install", { stdio: "inherit" });
    execSync("npm run build", { stdio: "inherit" });

    console.log("Installing backend dependencies...");
    process.chdir(path.join(__dirname, "../backend"));
    execSync("npm install", { stdio: "inherit" });

    console.log("Starting backend...");
    execSync("npm start", { stdio: "inherit" });
} catch (error) {
    console.error("An error occurred during setup:", error.message);
    process.exit(1);
}
