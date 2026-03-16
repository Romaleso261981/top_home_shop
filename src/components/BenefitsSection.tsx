export function BenefitsSection() {
  return (
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
  );
}

