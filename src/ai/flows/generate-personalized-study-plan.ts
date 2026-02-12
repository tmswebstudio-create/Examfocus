'use server';
/**
 * @fileOverview An AI agent that generates personalized study plans for students.
 *
 * - generatePersonalizedStudyPlan - A function that generates a personalized study plan.
 * - GenerateStudyPlanInput - The input type for the generatePersonalizedStudyPlan function.
 * - GenerateStudyPlanOutput - The return type for the generatePersonalizedStudyPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateStudyPlanInputSchema = z.object({
  examSubject: z.string().describe('The subject of the upcoming exam.'),
  examDate: z.string().describe('The date of the upcoming exam in YYYY-MM-DD format.'),
  examNotes: z.string().optional().describe('Optional notes or specific topics for the exam.'),
  historicalPerformance: z.array(
    z.object({
      subject: z.string().describe('The subject of the past exam.'),
      score: z.number().describe('The score received on the past exam (e.g., out of 100).'),
      date: z.string().describe('The date of the past exam in YYYY-MM-DD format.'),
    })
  ).optional().describe('An array of past exam results for personalization.'),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const GenerateStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('A detailed, personalized study plan including topics, resources, and a suggested timeline.'),
});
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generatePersonalizedStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return generateStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedStudyPlanPrompt',
  input: { schema: GenerateStudyPlanInputSchema },
  output: { schema: GenerateStudyPlanOutputSchema },
  prompt: `You are an AI study assistant specialized in creating personalized study plans for students.

Based on the following information, create a detailed study plan to help the student prepare for their upcoming exam.

Exam Details:
Subject: {{{examSubject}}}
Date: {{{examDate}}}
{{#if examNotes}}Notes: {{{examNotes}}}{{/if}}

{{#if historicalPerformance}}
Historical Performance:
{{#each historicalPerformance}}
- Subject: {{this.subject}}, Score: {{this.score}}, Date: {{this.date}}
{{/each}}

Consider the student's past performance to identify potential areas of weakness or strength, and tailor the plan accordingly.
{{else}}
No historical performance data is available. Create a general but effective study plan.
{{/if}}

Your study plan should include:
- Key topics to focus on.
- Recommended study methods or resources.
- A suggested timeline leading up to the exam date.
- Tips for effective studying and exam preparation.

Format the study plan as a well-structured text, easy to read and follow. Be encouraging and helpful.`,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
