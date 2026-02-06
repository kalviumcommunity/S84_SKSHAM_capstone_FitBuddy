import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const buildPrompt = (profile) => {
  return `You are an expert fitness coach and nutritionist. Generate a personalized weekly workout and diet plan based on the user's profile below.

USER PROFILE:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Goal: ${profile.goal}
- Activity Level: ${profile.activityLevel}
- Workout Preference: ${profile.workoutPreference}
- Target Body Parts: ${profile.targetBodyParts?.join(', ') || 'Full body'}
- Equipment Available: ${profile.equipmentAvailable?.join(', ') || 'Full gym equipment'}
- Dietary Preference: ${profile.dietaryPreference}
- Allergies: ${profile.allergies?.join(', ') || 'None'}
- Budget: ${profile.budget}

INSTRUCTIONS:
1. Create a 6-day workout plan (Monday-Saturday, Sunday is rest).
2. Each day should focus on specific muscle groups.
3. Include 4-6 exercises per day with sets, reps, and notes.
4. Create a diet plan with 4 meals: Breakfast, Lunch, Dinner, Snack.
5. Each meal should have 1-2 options with calories, protein, and ingredients.
6. Calculate daily macro goals (protein, carbs, fats, total daily calories).
7. Respect the user's dietary preference and allergies strictly.
8. Adjust calorie targets based on the user's goal (cut, bulk, maintain, strength).

You MUST respond with ONLY valid JSON in this exact structure (no markdown, no text before or after):
{
  "workoutPlan": [
    {
      "day": "Monday",
      "focusArea": "Chest & Triceps",
      "exercises": [
        { "name": "Bench Press", "sets": "4", "reps": "8-10", "notes": "Focus on controlled movement" }
      ]
    }
  ],
  "dietPlan": [
    {
      "mealType": "Breakfast",
      "options": [
        { "name": "Oatmeal with Berries", "calories": 350, "protein": 15, "ingredients": ["oats", "berries", "honey", "milk"] }
      ]
    }
  ],
  "macroGoals": {
    "protein": 150,
    "carbs": 200,
    "fats": 60,
    "dailyCalories": 2200
  }
}`;
};

export const generateFitnessPlan = async (profile) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a fitness AI that ONLY responds with valid JSON. Never include markdown formatting, code blocks, or explanatory text. Only output the raw JSON object.',
        },
        {
          role: 'user',
          content: buildPrompt(profile),
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No content in AI response');

    // Parse JSON - remove any potential markdown formatting
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```json?\n?/g, '').replace(/```\n?$/g, '').trim();
    }

    const plan = JSON.parse(cleaned);

    // Validate required fields
    if (!plan.workoutPlan || !plan.dietPlan || !plan.macroGoals) {
      throw new Error('Invalid plan structure from AI');
    }

    return plan;
  } catch (error) {
    console.error('Groq AI Error:', error.message);

    // Retry once with a stricter prompt
    if (!error.retried) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'Respond ONLY with a valid JSON object. No other text.',
            },
            {
              role: 'user',
              content: buildPrompt(profile) + '\n\nIMPORTANT: Return ONLY the JSON object, nothing else.',
            },
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.5,
          max_tokens: 4096,
          response_format: { type: 'json_object' },
        });

        const retryContent = completion.choices[0]?.message?.content?.trim();
        let cleaned = retryContent;
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/```json?\n?/g, '').replace(/```\n?$/g, '').trim();
        }
        return JSON.parse(cleaned);
      } catch (retryError) {
        console.error('Groq retry failed:', retryError.message);
        throw new Error('AI plan generation failed after retry');
      }
    }

    throw error;
  }
};
