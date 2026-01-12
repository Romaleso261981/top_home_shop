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

    // Якщо вказано chatId, відправляємо туди, інакше використовуємо getUpdates для отримання chat_id
    if (chatId) {
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        console.error("Помилка відправки в Telegram:", data);
        return NextResponse.json(
          { error: "Помилка відправки повідомлення" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: "Замовлення успішно відправлено!" });
    } else {
      // Якщо chatId не вказано, повертаємо інструкцію
      console.warn("TELEGRAM_CHAT_ID не налаштовано. Повідомлення не відправлено.");
      console.log("Дані замовлення:", { name, phone, email, size });
      
      // Можна також спробувати отримати chat_id через getUpdates
      // Але для цього потрібно спочатку написати боту в Telegram
      return NextResponse.json(
        { 
          success: true, 
          message: "Замовлення прийнято! (Chat ID не налаштовано - перевірте .env.local)" 
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
