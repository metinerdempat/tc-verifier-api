import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

dotenv.config();

import { routesVerifyTc } from './routes';
import { notAllowedMiddleware, rateLimitMiddleware } from './middlewares';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  express.json({
    limit: '10kb',
  }),
);
app.use(helmet());

app.use('/verify-tc', rateLimitMiddleware, routesVerifyTc);
app.use(notAllowedMiddleware);

app.listen(PORT, () => {
  console.log(`Server is listening on: ${PORT} 👾🚀`);
});
