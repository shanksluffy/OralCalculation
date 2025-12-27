
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIFeedback = async (score: number, total: number, timeTakenSeconds: number) => {
  try {
    const accuracy = (score / total) * 100;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        用户完成口算练习。统计：题数${total}, 正确${score}, 准确率${accuracy.toFixed(1)}%, 耗时${timeTakenSeconds}秒。
        请作为严谨温柔的数学老师提供一段短评语（80字内）。鼓励进步，针对性建议。直接输出文字。
      `,
    });
    return response.text || "出色完成！数学训练需要持之以恒。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "非常棒的练习！数学逻辑是思维的基础，加油！";
  }
};
