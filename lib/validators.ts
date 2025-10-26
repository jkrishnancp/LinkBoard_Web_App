import { z } from 'zod';

export const linkCardSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  customName: z.string().optional(),
  url: z.string().url('Must be a valid URL'),
  logo: z.string().url().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  hidden: z.boolean().optional(),
  previewMode: z.boolean().optional(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  i: z.string(),
});

export const boardSettingsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  theme: z.enum(['system', 'light', 'dark']),
  density: z.enum(['compact', 'comfy', 'poster']),
  cardRadius: z.enum(['sm', 'md', 'lg', 'xl']),
  showHeader: z.boolean(),
  gridCols: z.number(),
});

export const appStateSchema = z.object({
  links: z.array(linkCardSchema),
  layoutVersion: z.number(),
  settings: boardSettingsSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const addLinkFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  color: z.string().optional(),
});

export type LinkCard = z.infer<typeof linkCardSchema>;
export type BoardSettings = z.infer<typeof boardSettingsSchema>;
export type AppState = z.infer<typeof appStateSchema>;
export type AddLinkForm = z.infer<typeof addLinkFormSchema>;
