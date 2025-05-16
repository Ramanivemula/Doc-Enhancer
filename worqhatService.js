require('dotenv').config();
const axios = require('axios');
console.log("🔑 API KEY Loaded:", process.env.WORQHAT_API_KEY);

const apiKey = process.env.WORQHAT_API_KEY || 'wh_m9437f7bk6p2tx1igSUxcSENRADNSpCUgZJaQ8qBVV';
const apiUrl = 'https://api.worqhat.com/api/ai/content/v4';

async function enhanceText(text) {
  return await callWorqhatAPI(
    `Enhance this technical document to make it more comprehensive, well-structured, and technically accurate. Add helpful examples where appropriate. Format the document with proper headings, sections, and emphasis:\n\n${text}`
  );
}

async function simplifyText(text) {
  return await callWorqhatAPI(
    `Rewrite this technical document in simple, easy-to-understand language. Avoid jargon or explain it when necessary. Use clear examples and analogies that would help non-technical users understand the concepts:\n\n${text}`
  );
}

async function summarizeText(text) {
  return await callWorqhatAPI(
    `Create a comprehensive executive summary of this technical document. Include:
1. Main purpose and objectives
2. Key features and functionalities
3. Important technical details
4. Implementation considerations
5. Benefits and use cases

Format with clear headings and bullet points where appropriate:\n\n${text}`
  );
}

async function translateText(text, targetLanguage) {
  return await callWorqhatAPI(
    `Translate the following technical document to ${targetLanguage}. Maintain the formatting, code blocks, and technical accuracy:\n\n${text}`
  );
}

async function makeAccessible(text) {
  return await callWorqhatAPI(
    `Revise this technical document to improve accessibility. Follow best practices for screen readers, include alt-text suggestions for images (if applicable), simplify layout instructions, and clarify color-related details:\n\n${text}`
  );
}

async function generateFlowchart(text) {
  return await callWorqhatAPI(
    `Analyze the following documentation and generate a flowchart in Mermaid.js syntax to represent the process or structure:\n\n${text}`
  );
}

async function callWorqhatAPI(prompt) {
  try {
    const response = await axios.post(
      apiUrl,
      {
        question: prompt,
        model: "aicon-v4-nano-160824"
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        proxy: false
      }
    );

    console.log("🔁 Worqhat API response:", response.data);
    return response.data.content;
  } catch (error) {
    console.error("❌ Worqhat API Error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  enhanceText,
  simplifyText,
  summarizeText,
  translateText,
  makeAccessible,
  generateFlowchart
};
