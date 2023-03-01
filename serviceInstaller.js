import {Service} from 'node-windows';

const svc = new Service({
    name: 'NugetDownloader',
    description: 'run NugetDownloader on startup',
    script: process.cwd() + '\\NugetDownloaderServer\\app.js',
});
svc.workingdirectory = process.cwd() + '\\NugetDownloaderServer';

svc.on('install', function (){
    svc.start();
});

svc.install();