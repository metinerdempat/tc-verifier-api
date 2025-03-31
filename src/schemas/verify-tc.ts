import { z } from 'zod';

const verifyTcSchema = z.object({
  tc: z
    .string()
    .length(11)
    //  https://github.com/mgulener/turkiye-regex-kaliplari
    .regex(/^[1-9]{1}[0-9]{9}[02468]{1}$/, 'Invalid TC number'),
  name: z.string().min(1, 'Invalid name'),
  surname: z.string().min(1, 'Invalid surname'),
  birthdate: z
    .string()
    .length(4, 'Invalid birthdate')
    .refine((value) => {
      const year = parseInt(value);
      return year >= 1900 && year <= new Date().getFullYear();
    }, 'Invalid birthdate'),
});

export default verifyTcSchema;
