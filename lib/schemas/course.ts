import { z } from 'zod';

// Base course schema
export const CourseSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  credits: z.number().positive(),
  category: z.enum(['general', 'specialized', 'thesis']),
  subCategory: z.string().optional(), // For 3-domain, foreign language, etc.
  deliveryMethod: z.enum(['text', 'schooling', 'media']), // Keio-specific terms
  hasLabSession: z.boolean().default(false), // For natural science
  prerequisites: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  semester: z.array(z.enum(['spring', 'summer', 'fall', 'winter'])),
  description: z.string().optional(),
});

// Constraint schemas - start simple, will expand
export const ConstraintSchema = z.object({
  id: z.string(),
  type: z.enum(['credit_minimum', 'prerequisite', 'delivery_limit', 'category_requirement']),
  target: z.string(), // what this constraint applies to
  rule: z.record(z.any()), // flexible rule object
  priority: z.number().default(1),
});

export const GraduationPlanSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  type: z.enum(['fastest', 'safest', 'interest_driven']),
  courses: z.array(z.object({
    courseId: z.string(),
    semester: z.number(),
  })),
  totalCredits: z.number(),
  estimatedCompletion: z.number(),
});

// Keio-specific graduation requirements
export const KeioGraduationRequirements = z.object({
  totalCredits: z.literal(124),
  general: z.object({
    minCredits: z.literal(48),
    threeDomainCourses: z.object({
      minCredits: z.literal(32),
      textBasedMin: z.literal(24),
      schoolingMediaMax: z.literal(12),
    }),
    foreignLanguage: z.object({
      mandatoryCredits: z.literal(8),
      schoolingRequired: z.literal(2), // Must be in-person
      optionalMax: z.literal(4),
    }),
  }),
  specialized: z.object({
    minCredits: z.literal(68),
    mandatoryCourses: z.literal(7),
    categories: z.literal(7),
  }),
  thesis: z.object({
    credits: z.literal(8),
  }),
});

export type Course = z.infer<typeof CourseSchema>;
export type Constraint = z.infer<typeof ConstraintSchema>;
export type GraduationPlan = z.infer<typeof GraduationPlanSchema>;
export type KeioRequirements = z.infer<typeof KeioGraduationRequirements>;