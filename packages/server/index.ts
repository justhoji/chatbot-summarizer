import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const client = new OpenAI();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('HEllo world!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({
      message: 'Hello World',
   });
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt } = req.body;
   const response = await client.responses.create({
      model: 'gpt-5-nano',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
   });
   res.json({ message: response.output_text });
});
app.listen(port, () => {
   console.log(`Server listening on port ${port}...`);
});
