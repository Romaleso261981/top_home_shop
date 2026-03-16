export default function Home() {
  return (
    <div className="bg-zinc-50">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        {/* Hero */}
        <section className="mb-12 rounded-2xl bg-white px-6 py-10 shadow-sm sm:px-10 lg:mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Бетонні промислові підлоги
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Будівництво довговічних промислових бетонних підлог&nbsp;«під ключ»
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-700 sm:text-lg">
            Проєктуємо та влаштовуємо бетонні промислові підлоги для складів, виробництв,
            торгових центрів та логістичних комплексів. Працюємо за технологією, яка
            забезпечує міцність, зносостійкість і безпечну експлуатацію під навантаженнями.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="tel:+380965984470"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Зателефонувати менеджеру
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-7 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-100"
            >
              Отримати комерційну пропозицію
            </a>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            Працюємо по всій Україні. Допоможемо підібрати оптимальне рішення під ваші
            навантаження та умови експлуатації.
          </p>
        </section>

        {/* Про промислові підлоги */}
        <section className="mb-12 grid gap-10 rounded-2xl bg-white px-6 py-8 shadow-sm sm:px-10 lg:mb-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              Що таке промислові бетонні підлоги
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700 sm:text-base">
              Під промисловими підлогами розуміють конструкції, які сприймають інтенсивні
              механічні, динамічні, теплові та хімічні навантаження в цехах, складах,
              логістичних комплексах, торгових залах. У більшості випадків це
              багатошарова бетонна система: основа, армування, захисні та фінішні шари.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
              Правильно спроєктована і виконана промислова підлога працює десятиліттями без
              дорогих ремонтів. Неправильний вибір матеріалів або технології вже в перші
              місяці дає тріщини, пилення та відшарування фінішного шару.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-900">
              Коли потрібна промислова підлога
            </h3>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <li>• склади з навантажувачами та стелажами великої висоти</li>
              <li>• виробничі цехи з вібраціями та точковими навантаженнями</li>
              <li>• торгові та виставкові центри з великим трафіком людей</li>
              <li>• холодильні та морозильні камери з низькими температурами</li>
              <li>• паркінги, рампи, зони розвантаження вантажного транспорту</li>
            </ul>
          </div>
        </section>

        {/* Види промислових підлог */}
        <section className="mb-12 rounded-2xl bg-white px-6 py-8 shadow-sm sm:px-10 lg:mb-16">
          <h2 className="text-2xl font-bold text-zinc-900">
            Основні види промислових підлог
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
            Під конкретне приміщення ми підбираємо конструкцію підлоги та тип фінішного
            покриття з урахуванням навантажень, хімічних впливів, температури та вимог до
            гігієни.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-zinc-50 p-5">
              <h3 className="text-lg font-semibold text-zinc-900">
                Бетонні промислові підлоги
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                Класична промислова підлога на ущільненій основі з армуванням, швами та
                зміцненим верхнім шаром (топінг). Витримує високі навантаження від техніки,
                стійка до стирання, може поліруватися до декоративного вигляду.
              </p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-5">
              <h3 className="text-lg font-semibold text-zinc-900">
                Полімерні та полімер‑цементні покриття
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                Епоксидні та поліуретанові системи для зон з підвищеними вимогами до
                хімічної стійкості, гігієни та вологозахисту (харчові виробництва,
                лабораторії, фармацевтика).
              </p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-5">
              <h3 className="text-lg font-semibold text-zinc-900">
                Стяжки під фінішні покриття
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                Бетонні та цементно‑піщані стяжки як основа під плитку, лінолеум, ПВХ,
                полімерні наливні підлоги або інші декоративні рішення.
              </p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-5">
              <h3 className="text-lg font-semibold text-zinc-900">
                Спеціальні рішення
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                Антистатичні, теплостійкі, морозостійкі та інші спеціалізовані системи
                підлоги для конкретних технологічних процесів.
              </p>
            </div>
          </div>
        </section>

        {/* Переваги */}
        <section className="mb-12 rounded-2xl bg-white px-6 py-8 shadow-sm sm:px-10 lg:mb-16">
          <h2 className="text-2xl font-bold text-zinc-900">Переваги наших підлог</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <ul className="space-y-2 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <li>• Висока несуча здатність і стійкість до точкових навантажень</li>
              <li>• Стійкість до стирання та ударів, мінімальне пилення поверхні</li>
              <li>• Можливість роботи в умовах підвищеної вологості та температур</li>
              <li>• Сумісність з навантажувачами, штабелерами, стелажами вузьких проходів</li>
            </ul>
            <ul className="space-y-2 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <li>• Можливість інтеграції теплої підлоги та інженерних мереж</li>
              <li>• Варіанти фінішної обробки: шліфування, топінг, полімерні покриття</li>
              <li>• Проєктування швів і вузлів примикання до колон, стін, воріт</li>
              <li>• Оптимальна вартість володіння за рахунок тривалого ресурсу</li>
            </ul>
          </div>
        </section>

        {/* Етапи робіт */}
        <section className="mb-12 rounded-2xl bg-white px-6 py-8 shadow-sm sm:px-10 lg:mb-16">
          <h2 className="text-2xl font-bold text-zinc-900">Етапи влаштування підлоги</h2>
          <ol className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
            <li>
              <span className="font-semibold text-zinc-900">1. Обстеження об’єкта.</span>{" "}
              Аналіз ґрунтів, існуючих конструкцій, навантажень, умов експлуатації.
            </li>
            <li>
              <span className="font-semibold text-zinc-900">
                2. Проєктування конструкції підлоги.
              </span>{" "}
              Підбір товщини плити, армування, типу бетону, швів, фінішного шару.
            </li>
            <li>
              <span className="font-semibold text-zinc-900">
                3. Підготовка основи та влаштування плити.
              </span>{" "}
              Ущільнення основи, гідроізоляція, армування, бетонування з контролем рівня.
            </li>
            <li>
              <span className="font-semibold text-zinc-900">
                4. Фінішна обробка та шви.
              </span>{" "}
              Зміцнення поверхні (топінг/шліфування/полімер), нарізка та герметизація швів.
            </li>
            <li>
              <span className="font-semibold text-zinc-900">
                5. Здача об’єкта та рекомендації з експлуатації.
              </span>{" "}
              Передаємо паспорт підлоги та регламент догляду.
            </li>
          </ol>
        </section>

        {/* Контактний блок */}
        <section
          id="contact"
          className="mb-10 rounded-2xl bg-emerald-600 px-6 py-9 text-white shadow-sm sm:px-10"
        >
          <h2 className="text-2xl font-bold">Потрібна консультація по промисловій підлозі?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
            Розкажіть коротко про об’єкт: площу, призначення приміщення, тип навантажень
            (стелажі, навантажувачі, температура). Ми підготуємо для вас технічне рішення та
            орієнтовний кошторис.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="tel:+380965984470"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-zinc-100"
            >
              +38 (096) 598 44 70
            </a>
            <a
              href="mailto:monolitrvua@gmail.com"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Написати на email
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
