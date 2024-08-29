import express from "express";
import http from "http";
import { AssistantController } from "./controller.js";

const app = express();
const server = http.createServer(app);
const controller = new AssistantController()

app.get('/api/ia/music', async (req, res) => {
    const { music } = req.query;
    if (music) {
        const result = await controller.getMusica(music);
        res.json(result);
        return;
    }
    res.end("musica inválida")
});

server.listen(process.env.PORT || 3000,()=>{
    console.log(`server is running at port ${server.address().port}`);
})