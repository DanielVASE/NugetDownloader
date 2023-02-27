import express from 'express';
import controller from './controller.js';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(
    cors({
        origin: '*'
    })
);
app.use(express.json());

app.post('/download', controller.downloadNuget);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});