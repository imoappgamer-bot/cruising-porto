import axios from 'axios';

/**
 * Serviço de moderação de texto via IA externa.
 * Se AI_SERVICE_URL não estiver definido (dev/test), devolve stub seguro.
 */
async function moderateText(text, context) {
  if (!process.env.AI_SERVICE_URL) {
    // stub seguro para dev/test
    return { riskLevel: 'low', labels: [] };
  }

  const res = await axios.post(
    `${process.env.AI_SERVICE_URL}/internal/ai/moderate-text`,
    { text, context },
    { timeout: 5000 }
  );

  return res.data;
}

export { moderateText };
