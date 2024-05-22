 import {z} from "zod"; 
 const userSchema = z.object({
    firstname: z.string().default(''),
    email: z.string().email(),
    role: z.enum(['user']).default('user'),
  });

  module.exports={
    userSchema:userSchema
  }
