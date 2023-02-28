import express from 'express';
import controller from './controller.js';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 80;

app.use(
    cors({
        origin: '*'
    })
);
app.use(express.json());

const buildPath = '../NugetDownloaderClient/build';

app.use('/', express.static(path.resolve(buildPath)))

app.get('*', (request, response) => {
    response.sendFile(path.resolve( buildPath + '/index.html'));
});

app.post('/download', controller.downloadNuget);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});