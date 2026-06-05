import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 가능합니다." });
  }

  try {
    const { question, products } = req.body;

    if (!question) {
      return res.status(400).json({ error: "질문이 없습니다." });
    }

    const productText = products
      .map((p) => {
        return `
상품명: ${p.name}
태그: ${p.tag}
원가: ${p.originPrice}원
판매가: ${p.salePrice}원
할인율: ${p.discount}
재고: ${p.stock}개
`;
      })
      .join("\n");

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
너는 못난이 농산물 판매 사이트의 AI 상품 도우미야.

아래 상품 목록만 기준으로 답변해.
없는 상품은 없다고 말해.
가격 비교를 요청하면 판매가 기준으로 비교해.
사용자가 찾는 농산물이 있으면 상품명, 가격, 재고를 알려줘.

[상품 목록]
${productText}

[사용자 질문]
${question}
`
    });

    res.status(200).json({
      answer: response.output_text
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI 응답 생성 실패"
    });
  }
}
