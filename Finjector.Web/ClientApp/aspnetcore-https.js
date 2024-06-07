// This script sets up HTTPS for the application using the ASP.NET Core HTTPS certificate
import fs from "fs";
import { spawn } from "child_process";
import path from "path";

const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ""
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv
  .map((arg) => arg.match(/--name=(?<value>.+)/i))
  .filter(Boolean)[0];
const certificateName = certificateArg
  ? certificateArg.groups.value
  : process.env.npm_package_name;

if (!certificateName) {
  console.error(
    "Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly."
  );
  process.exit(-1);
}


export const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
export const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

console.log(`If certificate expires, delete the files here for Certificate: ${certFilePath}`);

// make sure we don't do this in Azure DevOps environment
if (
  process.env.VITEST_ENV !== "ci" &&
  (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath))
) {
  spawn(
    "dotnet",
    [
      "dev-certs",
      "https",
      "--export-path",
      certFilePath,
      "--format",
      "Pem",
      "--no-password",
    ],
    { stdio: "inherit" }
  ).on("exit", (code) => process.exit(code));
}
