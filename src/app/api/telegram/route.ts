import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, size } = body;

    // Валідація обов'язкових полів
    if (!name || !phone || !size) {
      return NextResponse.json(
        { error: "Будь ласка, заповніть всі обов'язкові поля" },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    console.log("=== Telegram API Debug ===");
    console.log("Bot Token:", botToken ? "✅ Налаштовано" : "❌ Відсутній");
    console.log("Chat ID:", chatId || "❌ Відсутній");
    console.log("Form Data:", { name, phone, email, size });

    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN не налаштовано");
      return NextResponse.json(
        { error: "Серверна помилка: токен бота не налаштовано" },
        { status: 500 }
      );
    }

    // Формуємо повідомлення
    const sizeLabels: Record<string, string> = {
      "155*210": "Полуторний 155*210 - 1050 грн",
      "175*210": "Двоспальний 175*210 - 1100 грн",
      "200*220": "Євро 200*220 - 1150 грн",
    };
    const selectedSize = sizeLabels[size] || size;

    const message = `
🛒 <b>Нове замовлення з сайту Top Home Shop</b>

👤 <b>Ім'я:</b> ${name}
📞 <b>Телефон:</b> ${phone}
${email ? `📧 <b>Email:</b> ${email}` : ""}
📏 <b>Розмір ковдри:</b> ${selectedSize}

⏰ <b>Час замовлення:</b> ${new Date().toLocaleString("uk-UA", {
      timeZone: "Europe/Kyiv",
    })}
    `.trim();

    // Якщо chatId не вказано, спробуємо отримати його автоматично
    let finalChatId = chatId;
    
    if (!finalChatId) {
      console.log("Chat ID не знайдено, спробуємо отримати через getUpdates...");
      try {
        const updatesUrl = `https://api.telegram.org/bot${botToken}/getUpdates`;
        const updatesResponse = await fetch(updatesUrl);
        const updatesData = await updatesResponse.json();
        
        if (updatesData.ok && updatesData.result && updatesData.result.length > 0) {
          // Беремо останнє повідомлення
          const lastUpdate = updatesData.result[updatesData.result.length - 1];
          if (lastUpdate.message && lastUpdate.message.chat) {
            finalChatId = lastUpdate.message.chat.id.toString();
            console.log(`Знайдено Chat ID: ${finalChatId}`);
            console.log(`⚠️  Додайте це значення в .env.local: TELEGRAM_CHAT_ID=${finalChatId}`);
          }
        }
      } catch (error) {
        console.error("Помилка отримання Chat ID:", error);
      }
    }

    // Відправляємо повідомлення, якщо знайшли chat_id
    if (finalChatId) {
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: finalChatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      const data = await response.json();

      console.log("Telegram API Response:", JSON.stringify(data, null, 2));

      if (!response.ok || !data.ok) {
        console.error("Помилка відправки в Telegram:", data);
        return NextResponse.json(
          { error: `Помилка відправки повідомлення: ${data.description || "невідома помилка"}` },
          { status: 500 }
        );
      }

      console.log("✅ Повідомлення успішно відправлено в Telegram!");
      return NextResponse.json({ 
        success: true, 
        message: "Замовлення успішно відправлено в Telegram!" 
      });
    } else {
      // Якщо chatId все ще не знайдено
      console.warn("TELEGRAM_CHAT_ID не налаштовано і не вдалося отримати автоматично.");
      console.log("Дані замовлення:", { name, phone, email, size });
      console.log("Інструкція: Напишіть боту @surveyridgebot в Telegram, потім запустіть: node scripts/get-telegram-chat-id.js");
      
      return NextResponse.json(
        { 
          success: false,
          error: "Chat ID не налаштовано. Напишіть боту @surveyridgebot в Telegram та додайте Chat ID в .env.local",
          instruction: "1. Напишіть боту @surveyridgebot в Telegram\n2. Запустіть: node scripts/get-telegram-chat-id.js\n3. Додайте Chat ID в .env.local"
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Помилка обробки замовлення:", error);
    return NextResponse.json(
      { error: "Помилка сервера при обробці замовлення" },
      { status: 500 }
    );
  }
}
