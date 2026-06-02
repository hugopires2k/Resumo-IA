const SYSTEM_PROMPT = `Você é um assistente especialista em análise e síntese de textos em português brasileiro.

Dado um texto de entrada, você deve retornar um JSON com exatamente estas chaves:
{
  "resumo": "o resumo do texto no estilo solicitado",
  "tema": "tema principal do texto em 2-4 palavras",
  "tom": "tom detectado: informativo / técnico / jornalístico / acadêmico / comercial / conversacional",
  "pontos_chave": ["ponto 1", "ponto 2", "ponto 3"]
}

Retorne SOMENTE o JSON, sem backticks, sem texto antes ou depois.`;

function buildUserPrompt(text, style) {
  const styles = {
    conciso: "Escreva um resumo conciso de 3 a 5 frases capturando a essência do texto.",
    bullet: "Escreva o resumo como uma lista de 4 a 6 tópicos (bullet points) com os pontos mais importantes.",
    executivo: "Escreva um resumo executivo profissional destacando: contexto, principais achados e conclusão.",
    didatico: "Escreva o resumo em linguagem simples e didática, como se explicasse para alguém sem conhecimento prévio do assunto."
  };
  return `Estilo solicitado: ${styles[style]}\n\nTexto:\n${text}`;
}

async function resumir() {
  const text = document.getElementById('inputText').value.trim();
  const style = document.getElementById('styleSelect').value;

  if (!text || text.length < 50) {
    showError('Por favor, cole um texto com pelo menos 50 caracteres.');
    return;
  }

  setLoading(true);
  hideError();
  hideOutput();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SUA_CHAVE_GROQ_AQUI'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(text, style) }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro na API');
    }

    const raw = data.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (parseError) {
      throw new Error('A IA não retornou um formato JSON perfeitamente válido. Por favor, tente novamente.');
    }

    showOutput(parsed);
  } catch (err) {
    showError('Erro ao processar: ' + err.message);
  } finally {
    setLoading(false);
  }
}

function setLoading(v) {
  document.getElementById('btnRun').disabled = v;
  document.getElementById('spinner').style.display = v ? 'block' : 'none';
  document.getElementById('btnText').textContent = v ? 'Processando...' : '✦ Resumir';
}

function showOutput(data) {
  const sec = document.getElementById('outputSection');
  const content = document.getElementById('outputContent');
  const tags = document.getElementById('tagsRow');

  let text = data.resumo || '';

  if (data.pontos_chave && data.pontos_chave.length) {
    text += '\n\n— Pontos-chave Extraídos:\n' + data.pontos_chave.map(p => '• ' + p).join('\n');
  }

  content.textContent = text;

  tags.innerHTML = '';
  if (data.tema) {
    const t = document.createElement('span');
    t.className = 'tag tag-tema';
    t.textContent = '📌 ' + data.tema;
    tags.appendChild(t);
  }
  if (data.tom) {
    const t = document.createElement('span');
    t.className = 'tag tag-tom';
    t.textContent = '🎚 ' + data.tom;
    tags.appendChild(t);
  }

  sec.style.display = 'block';
  sec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideOutput() {
  document.getElementById('outputSection').style.display = 'none';
}

function showError(msg) {
  const box = document.getElementById('errorBox');
  box.textContent = '⚠ ' + msg;
  box.style.display = 'block';
}

function hideError() {
  document.getElementById('errorBox').style.display = 'none';
}

function copiar() {
  const text = document.getElementById('outputContent').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.btn-copy');
    btn.textContent = 'Copiado ✓';
    setTimeout(() => btn.textContent = 'Copiar', 2000);
  });
}