export default function About() {
  const points = [
    "Ковдри з вовни використовують в усьому світі, адже це дійсно один із найтепліших наповнювачів. Обробляють шерсть за спеціальною технологією, тому вона пружна та не має запаху. Такі ковдри підходять і дорослим, і дітям, вони також мають гарні вентилювальні властивості та дають шкірі дихати.",
    "Ковдра простьобана у формі фігурних ромбів, це забезпечує рівномірність розподілу утеплювача та зберігає його цілісність у процесі експлуатації.",
    "Чохол ковдри — Mikrofiber. Матеріал добрий в експлуатації, не дає зсідання та зберігає первісний вигляд після багаторазового прання, це матеріал нового покоління.",
  ];

  return (
    <section id="about" className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
              <div className="bg-orange-100 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🌡️</div>
                <h4 className="font-bold text-gray-900 mb-2">Терморегуляція</h4>
              </div>
              <div className="bg-orange-100 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🧵</div>
                <h4 className="font-bold text-gray-900 mb-2">Якість</h4>
              </div>
              <div className="bg-orange-100 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">✨</div>
                <h4 className="font-bold text-gray-900 mb-2">Комфорт</h4>
              </div>
            </div>

            {points.map((point, index) => (
              <div key={index} className="mb-6 md:mb-8">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg">
                  {point}
                </p>
              </div>
            ))}

            <div className="mt-8 md:mt-12 p-6 md:p-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-600">
              <p className="text-gray-800 leading-relaxed text-sm md:text-base lg:text-lg font-medium">
                Оберіть нашу ковдру з овечої вовни для бездоганного сну в будь-яку пору року. Відчуйте комфорт, затишок і здоровий сон з ковдрою, яка адаптується до ваших потреб і дарує неперевершене відчуття легкості та тепла.
              </p>
            </div>

            <div className="mt-8 md:mt-10 text-center p-6 bg-orange-600 rounded-xl text-white">
              <p className="text-lg md:text-xl font-bold mb-2">
                Мега розпродаж <span className="text-2xl md:text-3xl">-50%</span>
              </p>
              <p className="text-sm md:text-base opacity-90">
                з сьогодні до кінця тижня на ковдри з овечої вовни
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

