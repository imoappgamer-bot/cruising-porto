import { moderateText } from '../services/aiModerationService.js';

/**
 * Extrai o campo de texto do body consoante o tipo de rota.
 */
function extractText(req) {
  return (
    req.body.text ||
    req.body.message ||
    req.body.content ||
    req.body.comment ||
    req.body.bio ||
    req.body.description ||
    ''
  );
}

/**
 * Middleware de moderação de conteúdo via IA.
 * @param {string} context - Contexto da rota ('comment', 'message', 'profile', 'location')
 */
function textModerationMiddleware(context) {
  return async (req, res, next) => {
    const text = extractText(req);
    if (!text || !text.trim()) return next();

    try {
      const result = await moderateText(text, context);

      if (result.riskLevel === 'high') {
        return res.status(400).json({
          error: 'Conteúdo não permitido pela política da plataforma.',
          labels: result.labels,
        });
      }

      req.moderationStatus =
        result.riskLevel === 'medium' ? 'pending_review' : 'approved';
      next();
    } catch (err) {
      // Em caso de falha no serviço de IA, aprova com pending_review (fail-safe)
      req.moderationStatus = 'pending_review';
      next();
    }
  };
}

export { textModerationMiddleware };
