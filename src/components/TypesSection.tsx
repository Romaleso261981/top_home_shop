export function TypesSection() {
  return (
    <section className="mb-12 rounded-2xl bg-white px-6 py-8 shadow-sm sm:px-10 lg:mb-16">
      <h2 className="text-2xl font-bold text-zinc-900">Основні види промислових підлог</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
        Під конкретне приміщення ми підбираємо конструкцію підлоги та тип фінішного
        покриття з урахуванням навантажень, хімічних впливів, температури та вимог до
        гігієни.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-zinc-50 p-5">
          <h3 className="text-lg font-semibold text-zinc-900">Бетонні промислові підлоги</h3>
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
          <h3 className="text-lg font-semibold text-zinc-900">Стяжки під фінішні покриття</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Бетонні та цементно‑піщані стяжки як основа під плитку, лінолеум, ПВХ,
            полімерні наливні підлоги або інші декоративні рішення.
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-5">
          <h3 className="text-lg font-semibold text-zinc-900">Спеціальні рішення</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Антистатичні, теплостійкі, морозостійкі та інші спеціалізовані системи
            підлоги для конкретних технологічних процесів.
          </p>
        </div>
      </div>
    </section>
  );
}

