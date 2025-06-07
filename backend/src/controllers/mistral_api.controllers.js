import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey });

export const getFields = async (projectContent)=>{

    const prompt = `
    Extract all relevant technical fields that has a meaning to it, technologies, tools, frameworks, or concepts mentioned in the content below.
    
    For each field:
    - If there is a commonly used short form, include both the short form and the full form as separate strings in the output array.
    - If no common short form exists, include only the full form.
    - Return all results as a single JSON array of strings.
    - Ensure no duplicates.
    - Only include fields actually mentioned in the content.
    - Do not include any text, explanation, or markdown, only a valid JSON array.
    
    Content: 
    ${projectContent}
    `;
    
    
    // Modify the prompt to ask for tech field extraction
    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    
    // Parse and display the list
    try {
      let raw = chatResponse.choices[0].message.content.trim();

      // Remove markdown code block if present
      if (raw.startsWith('```')) {
        raw = raw.replace(/^```(?:json)?\s*/, '').replace(/```$/, '').trim();
      }

      const fields = JSON.parse(raw);
      console.log("Extracted tech fields:", fields);
      return fields
    } catch (err) {
      console.error("Failed to parse response:", chatResponse.choices[0].message.content);
    }
}
