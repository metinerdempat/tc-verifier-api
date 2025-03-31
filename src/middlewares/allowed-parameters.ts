import type { NextFunction, Request, Response } from 'express';

const allowedParameters = (req: Request, res: Response, next: NextFunction) => {
  const whiteList = ['tc', 'name', 'surname', 'birthdate'];

  const shouldNext = whiteList.join() === Object.keys(req.body).join();

  if (!shouldNext) {
    res.status(400).send('Bad Request');
    return;
  }

  next();
};

export default allowedParameters;
