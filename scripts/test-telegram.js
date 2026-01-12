/**
 * Тестовий скрипт для перевірки відправки повідомлення в Telegram
 * 
 * Використання:
 * node scripts/test-telegram.js
 */

const fs = require('fs');
const path = require('path');

// Читаємо .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

const env = loadEnv();
const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = env.TELEGRAM_CHAT_ID;

async function testTelegram() {
  if (!BOT_TOKEN) {
    console.error("❌ TELEGRAM_BOT_TOKEN не знайдено в .env.local");
    return;
  }

  console.log("🤖 Тестування відправки повідомлення в Telegram...\n");

  // Якщо Chat ID не вказано, спробуємо отримати автоматично
  let chatId = CHAT_ID;

  if (!chatId) {
    console.log("⚠️  Chat ID не знайдено, спробуємо отримати автоматично...");
    try {
      const updatesUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
      const response = await fetch(updatesUrl);
      const data = await response.json();

      if (data.ok && data.result && data.result.length > 0) {
        const lastUpdate = data.result[data.result.length - 1];
        if (lastUpdate.message && lastUpdate.message.chat) {
          chatId = lastUpdate.message.chat.id.toString();
          console.log(`✅ Знайдено Chat ID: ${chatId}\n`);
        }
      } else {
        console.log("❌ Оновлень не знайдено. Спочатку напишіть боту @surveyridgebot в Telegram.\n");
        return;
      }
    } catch (error) {
      console.error("❌ Помилка отримання Chat ID:", error.message);
      return;
    }
  } else {
    console.log(`✅ Використовується Chat ID з .env.local: ${chatId}\n`);
  }

  // Тестове повідомлення
  const testMessage = `
🧪 <b>Тестове повідомлення</b>

Це тестове повідомлення для перевірки роботи Telegram бота.

⏰ Час: ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}
  `.trim();

  try {
    console.log("📤 Відправляю тестове повідомлення...");
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      console.log("✅ Повідомлення успішно відправлено в Telegram!");
      console.log(`📱 Перевірте ваш Telegram - повідомлення має прийти зараз.\n`);
    } else {
      console.error("❌ Помилка відправки:", data.description || "невідома помилка");
      console.error("Повна відповідь:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Помилка:", error.message);
  }
}

testTelegram();
