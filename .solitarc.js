const path = require("path");
const programDir = path.join(__dirname, "program");
const idlDir = path.join(__dirname, "packages", "sdk", "idl");
const sdkDir = path.join(__dirname, "packages", "sdk", "src", "generated");
const binaryInstallDir = path.join(__dirname, ".crates");

module.exports = {
  idlGenerator: "anchor",
  programName: "blob_metadata",
  programId: "BLoBXGoEp1KmFcYNbzFeq9KaFyrqy4A1HH55ceA19qLW",
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir
};