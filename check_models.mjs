import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.argv[2];

if (!apiKey) {
    console.error("❌ Error: Falta la API Key.");
    console.error("Uso: node check_models.mjs TU_API_KEY_AQUI");
    process.exit(1);
}

console.log("🔍 Conectando con Google AI Studio...");

async function listModels() {
    try {
        // Usamos la API REST directamente ya que el SDK de Node a veces abstrae esto
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Error de API:", data.error.message);
            return;
        }

        console.log("\n--- 🤖 Modelos Disponibles para tu API Key ---");
        if (data.models) {
            const contentModels = data.models.filter(m =>
                m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")
            );

            if (contentModels.length === 0) {
                console.log("⚠️ No se encontraron modelos generativos.");
            }

            contentModels.forEach(m => {
                console.log(`\n📌 Nombre: ${m.name}`);
                console.log(`   Nombre Visible: ${m.displayName}`);
                console.log(`   Versión: ${m.version}`);
                console.log(`   Descripción: ${m.description.substring(0, 100)}...`);
            });

            console.log("\n-------------------------------------------");
            console.log("✅ Si ves 'gemini-2.5' o 'nano-banana' aquí, ¡tienes acceso!");
            console.log("ℹ️  Si solo ves 'gemini-1.5' o 'gemini-pro', usa esos por ahora.");
        } else {
            console.log("⚠️ No se encontraron modelos.");
        }

    } catch (error) {
        console.error("❌ Error de conexión:", error.message);
    }
}

listModels();
