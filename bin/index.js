#!/usr/bin/env node

const path = require("path");
const starter = require("../lib/starter");
const destination = getDest(process.argv[2]);

function getDest(destFolder) {
    destFolder = destFolder || "api-starter-nestjs";
    return path.join(process.cwd(), destFolder);
}

starter(destination);
