/**
 * Тестовий скрипт для перевірки API endpoint
 */

const testData = {
  name: "Тест Користувач",
  phone: "+380501234567",
  email: "test@example.com",
  size: "155*210"
};

async function testAPI() {
  console.log("🧪 Тестування API endpoint /api/telegram\n");
  console.log("Дані для відправки:", testData);
  console.log("\nВідправляю запит...\n");

  try {
    const response = await fetch("http://localhost:3000/api/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    
    console.log("Статус відповіді:", response.status);
    console.log("Відповідь сервера:", JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log("\n✅ Тест пройшов успішно! Перевірте Telegram.");
    } else {
      console.log("\n❌ Помилка:", data.error || "невідома помилка");
    }
  } catch (error) {
    console.error("\n❌ Помилка з'єднання:", error.message);
    console.log("\nПереконайтеся, що сервер запущений: npm run dev");
  }
}

testAPI();
