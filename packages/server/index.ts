import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { chatController } from './controllers/chat.controller';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
   res.send('HEllo world!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({
      message: 'Hello World',
   });
});

app.post('/api/chat', async (req: Request, res: Response) => {
   chatController.sendMessage(req, res);
});
app.listen(port, () => {
   console.log(`Server listening on port ${port}...`);
});
