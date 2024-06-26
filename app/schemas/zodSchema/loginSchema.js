import {z} from "zod"; 

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').min(5, 'Email must be at least 5 characters'),
  password: z.string(),
});

export const signInSchema =  z.object({
  firstname:z.string().min(1),
  email: z.string().email('Invalid email format').min(5, 'Email must be at least 5 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

