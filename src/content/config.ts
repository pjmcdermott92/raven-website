import { z, defineCollection } from 'astro:content';

const testimonialsCollection = defineCollection({
    schema: z.object({
        name: z.string(),
        pubDate: z.string(),
        shortQuote: z.string(),
    }),
});

const servicesCollection = defineCollection({
    schema: z.object({
        icon: z.string(),
        serviceName: z.date(),
    }),
});

export const collections = {
    testimonials: testimonialsCollection,
    services: servicesCollection,
};
