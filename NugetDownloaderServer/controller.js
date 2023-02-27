import fs from 'fs';
import os from 'os';
import path from 'path';
import {exec} from 'child_process';
import zipDir from 'adm-zip';

async function downloadNuget(req, res) {
    let tmpDir;
    const appPrefix = 'nuget-downloader';
    try {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
        const child = exec(`nuget install ${req.body.package} -Version ${req.body.version} -OutputDirectory ${tmpDir}`);
        child.on('exit', () => {
            const zip = new zipDir();
            zip.addLocalFolder(tmpDir + `/${req.body.package}.${req.body.version}`);
            zip.writeZip(tmpDir + `/${req.body.package}.${req.body.version}.zip`);
            res.status(200).end(zip.toBuffer(), 'binary');
        });
    }
    catch (err){
        // handle error
        console.log(err);
        res.status(500).send('Failed downloading package');
    }
    finally {
        try {
            if (tmpDir) {
                fs.rmSync(tmpDir, { recursive: true });
            }
        }
        catch (e) {
            console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
        }
    }
}

export default {downloadNuget}