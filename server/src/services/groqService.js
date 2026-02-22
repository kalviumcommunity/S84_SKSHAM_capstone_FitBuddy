import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const buildPrompt = (profile) => {
  const age = profile.age || 25;
  const isChild = age < 10;
  const isSenior = age > 60;
  const isStandardAge = !isChild && !isSenior;

  // Build age-specific instructions
  let ageInstructions = '';
  if (isChild) {
    ageInstructions = `
AGE NOTICE: The user is a CHILD (age ${age}). You MUST:
- Do NOT recommend heavy weight training, gym machines, or intense resistance exercises.
- Focus on fun physical activities: playground exercises, swimming, cycling, jumping rope, basic stretching, yoga for kids.
- Diet should focus on balanced nutrition for growing children with adequate calcium, vitamins, and protein.
- Keep portions child-appropriate. No supplements.
- Avoid recommending strict calorie counting — focus on healthy eating habits instead.`;
  } else if (isSenior) {
    ageInstructions = `
AGE NOTICE: The user is a SENIOR (age ${age}). You MUST:
- Do NOT recommend heavy weightlifting, high-impact exercises, or explosive movements.
- Focus on low-impact exercises: walking, light stretching, chair exercises, yoga, tai chi, resistance bands, light dumbbells.
- Include joint mobility and balance work to prevent falls.
- Diet should focus on heart-healthy, anti-inflammatory foods, adequate protein for muscle preservation, calcium and vitamin D.
- Keep exercises gentle with longer rest times.`;
  }

  // Country-specific diet instruction
  const countryInstruction = profile.country
    ? `\n- COUNTRY: ${profile.country}. IMPORTANT: All food recommendations MUST use ingredients, dishes, and recipes that are commonly available and popular in ${profile.country}. Use local food names where appropriate. Do not suggest foods that are difficult to find in this region.`
    : '';

  // Strength/weakness instruction
  const strengthInstruction = profile.strengthParts?.length
    ? `\n- Strong Body Parts (maintain): ${profile.strengthParts.join(', ')}`
    : '';
  const weaknessInstruction = profile.weaknessParts?.length
    ? `\n- Weak Body Parts (prioritize & improve): ${profile.weaknessParts.join(', ')}`
    : '';

  // Medical conditions instruction
  const medicalInstruction = profile.medicalConditions?.length
    ? `\n- MEDICAL CONDITIONS: ${profile.medicalConditions.join(', ')}. CRITICAL: Generate diet plan avoiding foods contraindicated for these conditions. Mark each meal option with contraindications array.`
    : '';

  // Custom description instruction
  const customInstruction = profile.customDescription?.trim()
    ? `\n- CUSTOM REQUIREMENTS: ${profile.customDescription}. Incorporate these specific requirements into the workout plan.`
    : '';

  return `You are an expert fitness coach and nutritionist. Generate a personalized weekly workout and diet plan based on the user's profile below.

USER PROFILE:
- Age: ${age}
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
- Medical Conditions: ${profile.medicalConditions?.join(', ') || 'None'}
- Budget: ${profile.budget}${countryInstruction}${strengthInstruction}${weaknessInstruction}${medicalInstruction}${customInstruction}
${ageInstructions}

INSTRUCTIONS:
${isStandardAge ? `1. Create a 6-day workout plan (Monday-Saturday, Sunday is rest).
2. Each day should focus on specific muscle groups.${weaknessInstruction ? ' Allocate MORE training volume to weak body parts and LESS to strong body parts.' : ''}
3. Include 4-6 exercises per day. Each exercise MUST have: "name", "sets", "reps", "restTime" (e.g. "60 sec", "90 sec"), and "notes".` : `1. Create a 6-day activity plan (Monday-Saturday, Sunday is rest).
2. Each day should have a themed activity session.
3. Include 3-5 activities per day with sets, reps/duration, restTime, and notes.`}
4. Create a diet plan with exactly 4 meals: Breakfast, Lunch, Dinner, Snack.
5. Each meal MUST have 1-2 options. Each option MUST include: "name", "calories" (number), "protein" (number), "carbs" (number), "fats" (number), "ingredients" (array of objects with "name" and "quantity", e.g. [{"name": "oats", "quantity": "50g"}]), "quantity" (string for the total meal size, e.g. "1 bowl"), and "contraindications" (array of strings).
6. CRITICAL: The "quantity" field at both meal level and ingredient level is MANDATORY. Be specific about serving sizes and measurement for each ingredient so the user knows exactly how much to cook.
7. Calculate daily macro goals (protein, carbs, fats, total daily calories). Use ONLY numbers for calorie and macro values.
8. CRITICAL: The macroGoals values MUST exactly equal the sum of ONE option from each of the 4 meals. Add up the calories, protein, carbs, and fats from one option per meal and use those sums as your macroGoals. They MUST match.
9. Respect the user's dietary preference and allergies strictly.
10. If medical conditions are present, ensure diet recommendations are safe and mark contraindications for each meal.
11. Adjust calorie targets based on the user's goal (cut, bulk, maintain, strength).

You MUST respond with ONLY valid JSON in this exact structure (no markdown, no text before or after):
{
  "workoutPlan": [
    {
      "day": "Monday",
      "focusArea": "Chest & Triceps",
      "exercises": [
        { "name": "Bench Press", "sets": "4", "reps": "8-10", "restTime": "90 sec", "notes": "Focus on controlled movement" }
      ]
    }
  ],
  "dietPlan": [
    {
      "mealType": "Breakfast",
      "options": [
        { 
          "name": "Oatmeal with Berries", 
          "calories": 350, 
          "protein": 15, 
          "carbs": 50, 
          "fats": 8, 
          "ingredients": [
            { "name": "rolled oats", "quantity": "50g" },
            { "name": "blueberries", "quantity": "1/2 cup" },
            { "name": "honey", "quantity": "1 tbsp" },
            { "name": "milk", "quantity": "200ml" }
          ],
          "quantity": "1 bowl (approx 400g)",
          "contraindications": ["gluten sensitivity"]
        }
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

export const estimateMacros = async (foodDescription) => {
  try {
    console.log('Estimating macros for:', foodDescription);
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a nutrition expert. Estimate the nutritional content for a given food description. Respond with a JSON object containing calories, protein, carbs, and fats. Use numbers only. If multiple options exist, give a common average for a single serving.',
        },
        {
          role: 'user',
          content: `Estimate nutrition for: "${foodDescription}". Return JSON with exactly these keys (lowercase): calories, protein, carbs, fats.`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    console.log('Groq raw response for estimation:', content);
    
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    
    // Normalize keys to lowercase just in case
    const normalized = {};
    Object.keys(parsed).forEach(key => {
      normalized[key.toLowerCase()] = parsed[key];
    });

    const getFirstNumber = (val) => {
      if (typeof val === 'number') return val;
      if (typeof val !== 'string') return 0;
      const match = val.match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[0]) : 0;
    };

    return {
      calories: getFirstNumber(normalized.calories) || getFirstNumber(normalized.energy) || 0,
      protein: getFirstNumber(normalized.protein) || 0,
      carbs: getFirstNumber(normalized.carbs) || getFirstNumber(normalized.carbohydrates) || 0,
      fats: getFirstNumber(normalized.fats) || getFirstNumber(normalized.fat) || 0,
    };
  } catch (error) {
    console.error('Macro estimation error in groqService:', error);
    return { calories: 0, protein: 0, carbs: 0, fats: 0 };
  }
};
