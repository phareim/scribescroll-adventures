'use server';

/**
 * @fileOverview A flow that interprets user commands in a text-based RPG, identifying key actions and objects.
 *
 * - interpretUserCommand - A function that handles the interpretation of user commands.
 * - InterpretUserCommandInput - The input type for the interpretUserCommand function.
 * - InterpretUserCommandOutput - The return type for the interpretUserCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretUserCommandInputSchema = z.object({
  command: z
    .string()
    .describe('The user command to interpret, e.g., look at the rusty sword.'),
});
export type InterpretUserCommandInput = z.infer<typeof InterpretUserCommandInputSchema>;

const InterpretUserCommandOutputSchema = z.object({
  action: z.string().describe('The primary action the user wants to perform.'),
  object: z
    .string()
    .optional()
    .describe('The object the user is interacting with, if any.'),
  details: z
    .string()
    .optional()
    .describe('Any additional details or context from the command.'),
});
export type InterpretUserCommandOutput = z.infer<typeof InterpretUserCommandOutputSchema>;

export async function interpretUserCommand(input: InterpretUserCommandInput): Promise<InterpretUserCommandOutput> {
  return interpretUserCommandFlow(input);
}

const commandInterpreterPrompt = ai.definePrompt({
  name: 'commandInterpreterPrompt',
  input: {schema: InterpretUserCommandInputSchema},
  output: {schema: InterpretUserCommandOutputSchema},
  prompt: `You are the game master of a text-based RPG. Your task is to interpret the player's commands and extract the key information.

  The player's command will be given to you, you must follow the instructions to return a JSON object that can be parsed by Typescript code.
  Here are the instructions:
  *   Determine the primary action the user wants to perform (e.g., "look", "take", "use").
  *   Identify the object the user is interacting with, if any. Not every action has to have an object, so do not assume it exists
  *   Extract any additional details or context from the command that might be relevant to the game.

  Command: {{{command}}}
  \n  Make sure to return valid JSON.
  Follow this format:
  {
    "action": "the action the user wants to perform",
    "object": "the object the user is interacting with",
    "details": "any additional details or context from the command"
  }
  `,
});

const interpretUserCommandFlow = ai.defineFlow(
  {
    name: 'interpretUserCommandFlow',
    inputSchema: InterpretUserCommandInputSchema,
    outputSchema: InterpretUserCommandOutputSchema,
  },
  async input => {
    const {output} = await commandInterpreterPrompt(input);
    return output!;
  }
);
