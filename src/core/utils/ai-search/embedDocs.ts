// scripts/embedDocs.ts
import { Configuration, OpenAIApi } from "azure-openai";
import { guides } from "./guides";

export const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY!,
  azure: {
    apiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY!,
    endpoint: `${process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT}`,
    deploymentName: `${process.env.NEXT_PUBLIC_AZURE_OPENAI_EMBEDDING_DEPLOYMENT}`,
  }
}));

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}

export const runAi = async (question: string) => {
  const embedded: any[] = [];

  for (const guide of guides) {
    const res = await openai.createEmbedding({
      model: "text-embedding-3-large",
      input: guide.question,
    });

    embedded.push({
      ...guide,
      embedding: (res.data??[]).data.length > 0 ? res.data.data[0].embedding : {},
    });
  }

  const resQ = await openai.createEmbedding({
    model: "text-embedding-3-large",
    input: question,
  });

  const userEmbedding = resQ.data.data[0].embedding;

  // Compute similarity for each guide
  const scoredGuides = embedded.map((guide) => ({
    ...guide,
    similarity: cosineSimilarity(userEmbedding, guide.embedding??[]),
  }));
  scoredGuides.sort((a, b) => b.similarity - a.similarity);

  // Return best match
  const bestMatch = scoredGuides[0];

  return {
    question: bestMatch.question,
    answer: bestMatch.answer,
    similarity: bestMatch.similarity,
  };

}
