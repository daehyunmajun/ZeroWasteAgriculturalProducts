import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST 요청만 가능합니다." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY가 없습니다." });
    }

    const { question, products = [] } = req.body || {};

    if (!question) {
      return res.status(400).json({ error: "질문이 없습니다." });
    }

    const productText = products.map((p) => `
상품명: ${p.name}
태그: ${p.tag}
원가: ${p.originPrice}원
판매가: ${p.salePrice}원
할인율: ${p.discount}
재고: ${p.stock}개
`).join("\n");

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "너는 못난이 농산물 판매 사이트의 AI 상품 도우미야. 상품 목록 안에서만 답변해."
        },
        {
          role: "user",
          content: `
상품 목록:
${productText}

사용자 질문:
${question}
`
        }
      ]
    });

    return res.status(200).json({
      answer: response.choices[0].message.content
    });

  } catch (error) {
    console.error("AI SEARCH ERROR:", error);

    return res.status(500).json({
      error: error.message || "AI 응답 생성 실패"
    });
  }
}
