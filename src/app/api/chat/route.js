import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages = [], customApiKey = "" } = body;

    // Determine Gemini API Key from process environment or custom request
    const apiKey =
      customApiKey?.trim() ||
      process.env.GEMINI_API_KEY?.trim() ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "NO_API_KEY",
          reply:
            "⚠️ **Gemini API Key Missing**\n\nPlease set your `GEMINI_API_KEY` in the `eventflow-client/.env` file.",
        },
        { status: 400 }
      );
    }

    // Attempt to fetch live events from backend server to provide context
    let liveEventsContext = "";
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const eventsRes = await fetch(`${serverUrl}/api/events/all?limit=15`, {
        cache: "no-store",
      });
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        const events = eventsData.result || eventsData.events || [];
        if (events.length > 0) {
          liveEventsContext =
            "\n\n### Current Live Events on EventFlow:\n" +
            events
              .slice(0, 10)
              .map(
                (ev, idx) =>
                  `${idx + 1}. **${ev.title || ev.name}** | Category: ${ev.category || "General"} | Date: ${ev.date || "Upcoming"} | Price: $${ev.ticketPrice ?? ev.price ?? 0} | Location: ${ev.location || "Online"}`
              )
              .join("\n");
        }
      }
    } catch (e) {
      console.warn("Could not fetch live events context for AI chatbot:", e.message);
    }

    // System prompt defining AI assistant persona and EventFlow platform knowledge
    const systemPrompt = `You are EventFlow AI Assistant for EventFlow, an event ticket booking & management platform.

### About EventFlow Platform:
- **Core Features**: Discover events, filter by category/location/date, book tickets via Stripe payments, manage ticket bookings, and get QR code tickets.
- **For Organizers**: Create and manage events, track ticket sales, view real-time revenue analytics, and customize organization profiles.
- **Pricing Tiers**:
  - **Free Tier ($0/mo)**: Host up to 3 events, standard ticketing, basic support.
  - **Pro Tier ($29/mo)**: Unlimited events, custom branding, low booking fees, priority support.
  - **Enterprise Tier ($99/mo)**: Dedicated account manager, custom API integrations, 0% platform fee options, 24/7 phone support.
- **Platform Navigation Quick Links**:
  - Browse Events: /events
  - Pricing & Plans: /pricing
  - User Dashboard: /dashboard
  - Login / Register: /login , /register

${liveEventsContext}

### Response Instructions (CRITICAL):
1. **Be Direct & Concise**: Give ONLY the exact, direct answer to the user's question.
2. **No Fluff or Filler**: Do NOT include greetings, pleasantries, preambles, introductory filler (such as "Sure! Here is the information:"), or trailing sign-offs.
3. **Strict Focus**: Answer ONLY what was asked. Avoid off-topic information, unsolicited advice, or unnecessary promotional chatter.
4. **Formatting**: Use clean Markdown (bullet points, bold text) for readability.
5. **Links**: Include platform links (e.g., /events, /pricing) only when directly relevant to answering the question.`;

    // Map conversation messages to Gemini contents format (roles: 'user' and 'model')
    const formattedContents = messages.map((msg) => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content || msg.text || "" }],
    }));

    if (formattedContents.length === 0) {
      formattedContents.push({ role: "user", parts: [{ text: "Hello" }] });
    }

    // Dynamic Discovery of Available Gemini Models for this API Key
    let candidateModels = [];
    try {
      const listModelsRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        { cache: "no-store" }
      );
      if (listModelsRes.ok) {
        const listData = await listModelsRes.json();
        if (Array.isArray(listData.models)) {
          candidateModels = listData.models
            .filter(
              (m) =>
                m.supportedGenerationMethods &&
                m.supportedGenerationMethods.includes("generateContent")
            )
            .map((m) => m.name.replace(/^models\//, ""));
        }
      }
    } catch (err) {
      console.warn("Could not list Gemini models dynamically:", err.message);
    }

    // Fallback list of models if dynamic listing returns empty or fails
    const defaultModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-2.5-pro",
      "gemini-1.5-flash-8b",
    ];

    // Combine candidate models, putting flash models first
    const modelsToTry = Array.from(
      new Set([...candidateModels, ...defaultModels])
    );

    let lastErrorDetails = [];

    for (const model of modelsToTry) {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      // Payload structure 1: Using systemInstruction field
      const payloadWithSystemInstruction = {
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      };

      // Payload structure 2: Prepending system prompt to user content (compatibility fallback)
      const contentsPrepended = [
        {
          role: "user",
          parts: [
            {
              text: `[SYSTEM INSTRUCTION: ${systemPrompt}]\n\nUser Question:\n${formattedContents[0]?.parts[0]?.text || "Hello"
                }`,
            },
          ],
        },
        ...formattedContents.slice(1),
      ];

      const payloadPrepended = {
        contents: contentsPrepended,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      };

      // Try calling Gemini API (attempt systemInstruction first, then prepended content fallback)
      for (const payload of [payloadWithSystemInstruction, payloadPrepended]) {
        try {
          const res = await fetch(geminiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errText = await res.text();
            lastErrorDetails.push(`Model ${model}: (${res.status}) ${errText}`);
            continue;
          }

          const data = await res.json();
          const candidate = data.candidates?.[0];
          const textResponse = candidate?.content?.parts?.[0]?.text;

          if (textResponse) {
            return NextResponse.json({
              success: true,
              reply: textResponse,
              modelUsed: model,
            });
          }
        } catch (err) {
          lastErrorDetails.push(`Model ${model} fetch exception: ${err.message}`);
        }
      }
    }

    // Extract cleanest error message for display
    const firstErrorMessage =
      lastErrorDetails.find((msg) => msg.includes("API key")) ||
      lastErrorDetails[0] ||
      "Unable to connect to Gemini API models.";

    return NextResponse.json(
      {
        success: false,
        error: "GEMINI_API_ERROR",
        reply: `⚠️ **Gemini API Configuration Notice**\n\n${firstErrorMessage}\n\n*Tip: Please check your \`GEMINI_API_KEY\` in \`eventflow-client/.env\`.*`,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in AI Chat API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        reply: "Sorry, an internal error occurred while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
