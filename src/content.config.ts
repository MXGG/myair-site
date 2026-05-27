import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blogSchema = ({ image }: { image: any }) =>
	z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		readingMinutes: z.number().int().positive().optional(),
		heroImage: z.optional(image()),
	});

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: blogSchema,
});

const blogZh = defineCollection({
	loader: glob({ base: './src/content/blogZh', pattern: '**/*.{md,mdx}' }),
	schema: blogSchema,
});

export const collections = { blog, blogZh };
