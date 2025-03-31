import type { Request, Response } from 'express';

const notAllowed = (req: Request, res: Response) => {
  res.status(405).json({ message: 'Method Not Allowed' });
};

export default notAllowed;
