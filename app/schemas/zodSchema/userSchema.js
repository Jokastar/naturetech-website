 const userSchema = z.object({
    name: z.string().default(''),
    email: z.string().email(),
    role: z.enum(['user']).default('user'),
  });

  module.exports={
    userSchema:userSchema
  }
