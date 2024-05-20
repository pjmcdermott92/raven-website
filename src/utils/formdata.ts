import { z } from 'astro:content';

export const contactFormValidator = z.object({
    first_name: z.string().min(2, { message: 'Please provide your first name' }),
    last_name: z.string().min(2, { message: 'Please provide your last name' }),
    email: z
        .string({ message: 'Please provide your email address' })
        .email({ message: 'Please provide a valid email address' }),
    phone: z.string().optional(),
    message: z.string().min(3, { message: 'Please enter a message' }),
    name__verify: z.string().max(0),
});

export const getZodErrors = (fieldErrors: any) => {
    const errors: any = {};

    for (const key in fieldErrors) {
        errors[key] = fieldErrors[key as keyof typeof fieldErrors][0];
    }

    return errors;
};
