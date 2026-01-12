/**
 * Скрипт для отримання Chat ID з Telegram бота
 * 
 * Інструкція:
 * 1. Спочатку напишіть будь-яке повідомлення вашому боту в Telegram: @surveyridgebot
 * 2. Запустіть цей скрипт: node scripts/get-telegram-chat-id.js
 * 3. Скопіюйте Chat ID та додайте його в .env.local як TELEGRAM_CHAT_ID
 */

const BOT_TOKEN = "8555898660:AAGACcEFsN5akhBXgtBUowjscQpZl28CMJ8";

async function getChatId() {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`
    );
    const data = await response.json();

    if (!data.ok) {
      console.error("Помилка:", data.description);
      return;
    }

    if (data.result && data.result.length > 0) {
      const updates = data.result;
      console.log("\n📱 Знайдені чати:\n");
      
      const chatIds = new Set();
      updates.forEach((update) => {
        if (update.message && update.message.chat) {
          const chat = update.message.chat;
          chatIds.add({
            id: chat.id,
            username: chat.username || "немає",
            firstName: chat.first_name || "",
            lastName: chat.last_name || "",
            type: chat.type,
          });
        }
      });

      if (chatIds.size > 0) {
        Array.from(chatIds).forEach((chat) => {
          console.log(`Chat ID: ${chat.id}`);
          console.log(`Ім'я: ${chat.firstName} ${chat.lastName || ""}`);
          console.log(`Username: @${chat.username}`);
          console.log(`Тип: ${chat.type}`);
          console.log("---\n");
        });
        console.log(
          `\n✅ Додайте один з цих Chat ID в .env.local:\nTELEGRAM_CHAT_ID=ваш_chat_id\n`
        );
      } else {
        console.log(
          "\n⚠️  Чати не знайдено. Спочатку напишіть повідомлення боту @surveyridgebot в Telegram.\n"
        );
      }
    } else {
      console.log(
        "\n⚠️  Оновлень не знайдено. Спочатку напишіть повідомлення боту @surveyridgebot в Telegram.\n"
      );
    }
  } catch (error) {
    console.error("Помилка запиту:", error.message);
  }
}

getChatId();
