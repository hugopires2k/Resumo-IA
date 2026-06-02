# Documentação de Prompt Engineering — ResumeAI

## Contexto

Durante o desenvolvimento do ResumeAI, percebemos cedo que a qualidade do resumo dependia quase que inteiramente de como a gente formulava o prompt. O código em si é simples — o verdadeiro trabalho foi entender como se comunicar bem com a IA.

Usamos a **Groq API** com o modelo **LLaMA 3.3 70B Versatile**, escolhido pela velocidade de resposta e pelo generoso plano gratuito, ideal para um MVP.

---

## A API utilizada

**Serviço:** Groq  
**Endpoint:** `https://api.groq.com/openai/v1/chat/completions`  
**Modelo:** `llama-3.3-70b-versatile`  
**Limite de tokens na resposta:** 1000  

A Groq foi escolhida porque processa requisições muito mais rápido que outras alternativas, o que melhora bastante a experiência do usuário — ninguém gosta de esperar 10 segundos por um resumo.

---

## O System Prompt

Esse é o prompt de sistema que roda em todas as chamadas da aplicação:

```
Você é um assistente especialista em análise e síntese de textos em português brasileiro.

Dado um texto de entrada, você deve retornar um JSON com exatamente estas chaves:
{
  "resumo": "o resumo do texto no estilo solicitado",
  "tema": "tema principal do texto em 2-4 palavras",
  "tom": "tom detectado: informativo / técnico / jornalístico / acadêmico / comercial / conversacional",
  "pontos_chave": ["ponto 1", "ponto 2", "ponto 3"]
}

Retorne SOMENTE o JSON, sem backticks, sem texto antes ou depois.
```

### Por que escrevemos assim?

Cada decisão aqui foi intencional:

**"Você é um assistente especialista..."**
Dar uma identidade ao modelo melhora a consistência das respostas. Testamos sem essa linha e os resumos ficavam genéricos demais.

**Estrutura JSON obrigatória**
Essa foi a decisão mais importante. No começo, a IA retornava texto livre e a gente precisava fazer parsing manual — quebrando com frequência. Forçar o JSON resolveu 95% dos problemas de integração.

**"Retorne SOMENTE o JSON, sem backticks, sem texto antes ou depois"**
Sem essa instrução, o modelo ficava adicionando ```json no começo e ``` no final, além de frases como "Aqui está o resumo:". Isso quebrava o `JSON.parse()` direto. Adicionar essa linha explícita eliminou o problema.

**Campos separados (resumo, tema, tom, pontos_chave)**
Poderíamos pedir só o resumo, mas separar em campos nos deu flexibilidade para exibir as tags de tema e tom na interface — que viraram um dos diferenciais visuais do projeto.

---

## O User Prompt (dinâmico por estilo)

Além do system prompt, enviamos um prompt de usuário que varia de acordo com o estilo escolhido:

**Conciso:**
```
Escreva um resumo conciso de 3 a 5 frases capturando a essência do texto.
```

**Pontos-chave em tópicos:**
```
Escreva o resumo como uma lista de 4 a 6 tópicos (bullet points) com os pontos mais importantes.
```

**Executivo:**
```
Escreva um resumo executivo profissional destacando: contexto, principais achados e conclusão.
```

**Didático:**
```
Escreva o resumo em linguagem simples e didática, como se explicasse para alguém sem conhecimento prévio do assunto.
```

Cada estilo foi testado com textos reais de diferentes áreas — tecnologia, política, saúde e negócios — para garantir que a IA seguia as instruções de forma consistente.

---

## Como validamos os outputs

Nosso processo de validação foi manual e iterativo:

1. Rodávamos o mesmo texto nos 4 estilos e comparávamos os resultados
2. Testávamos com textos "difíceis" — muito curtos, muito técnicos, em inglês misturado com português
3. Verificávamos se o JSON vinha sempre bem formado (adicionamos um try/catch separado só para o parse)
4. Lemos os resumos em voz alta para checar se soavam naturais em português

Não implementamos testes automatizados nesse MVP, mas o try/catch duplo (um para a chamada de API, outro para o parse do JSON) garante que o usuário sempre recebe uma mensagem de erro compreensível se algo der errado.

---

## Evolução do prompt ao longo do projeto

A versão atual é a **v2.1**. A v1.0 era bem mais simples e gerava resultados inconsistentes. As principais mudanças foram:

- Adição da instrução explícita de retornar só JSON (resolveu os backticks)
- Separação de campos no JSON (antes era só "resumo")
- Especificação de "português brasileiro" (o modelo tendia a usar expressões de Portugal)
- Limite de palavras para o campo "tema" (antes vinha frases longas demais)
