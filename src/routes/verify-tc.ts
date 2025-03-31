import { Router } from 'express';
import * as soap from 'soap';
import { redisClient } from '../lib';
import { REDIS_CACHE_TTL } from '../constants';
import { validateRequestBody } from 'zod-express-middleware';
import { verifyTcSchema } from '../schemas';
import { allowedParametersMiddleware } from '../middlewares';

const router = Router();

const SERVICE_URL = process.env.SERVICE_URL!;

const validateTC = async (tc: string, name: string, surname: string, birthdate: string): Promise<boolean> => {
  const body = {
    TCKimlikNo: tc,
    Ad: name.toLocaleUpperCase('tr-TR'),
    Soyad: surname.toLocaleUpperCase('tr-TR'),
    DogumYili: birthdate,
  };

  try {
    const cached = await redisClient.get(tc);
    if (cached && JSON.stringify(JSON.parse(cached).body) === JSON.stringify(body)) {
      return Boolean(JSON.parse(cached).result);
    }

    const soapClient = await soap.createClientAsync(SERVICE_URL);
    const response = await soapClient.TCKimlikNoDogrulaAsync(body);
    const result: boolean = response[0].TCKimlikNoDogrulaResult;

    await redisClient.set(
      body.TCKimlikNo,
      JSON.stringify({
        body,
        result: String(result),
      }),
      'EX',
      REDIS_CACHE_TTL,
    );
    
    return result;
  } catch (error) {
    return false;
  }
};

router.post('/', allowedParametersMiddleware, validateRequestBody(verifyTcSchema), async (req, res) => {
  const { tc, name, surname, birthdate } = req.body;
  try {
    const result = await validateTC(tc, name, surname, birthdate);
    res.status(200).json({ result });
  } catch (error: any) {
    const errorMessage = error?.message || 'An error occurred';
    res.status(400).json({ result: false, message: errorMessage });
  }
});

export default router;
