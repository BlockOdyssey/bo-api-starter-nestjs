const path = require("path");
const editJsonFile = require("edit-json-file");
const ncp = require("ncp").ncp;

async function createProject(projectName) {
    try {
        console.log("[ 1 / 3 ] 🔍  copying project...");
        await copyProjectFiles(projectName);
        console.log("[ 2 / 3 ] 🚚  updatePackageJson...");
        await updatePackageJson(projectName);
        console.log("[ 3 / 3 ] 🔗  complete...");
    } catch (error) {
        console.error(error);
    }
}

function copyProjectFiles(projectName) {
    const prjFolder = `../default`;
    const source = path.join(__dirname, prjFolder);

    return new Promise((resolve, reject) => {
        ncp.limit = 16;
        ncp(source, projectName, function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}

async function updatePackageJson(projectName) {
    const file = editJsonFile(projectName + "/package.json", {
        autosave: true,
    });
    file.set("name", path.basename(projectName));
}

module.exports = createProject;
