export default function Reviews() {
  const reviews = [
    {
      username: "@churik_inna",
      text: "Дуже задоволена покупкою ковдри з овечої вовни! Вона забезпечує комфортний сон як взимку, так і влітку. Взимку під нею тепло, а влітку не жарко. До того ж, ковдра допомагає розслабитися після важкого дня, знімає напруження. Рекомендую всім!",
    },
    {
      username: "@yasya_nata",
      text: "Це просто неймовірна ковдра! Відчувається натуральність матеріалу, який не викликає алергії. Під нею дуже приємно спати, вона легка, але водночас тепла. Овеча вовна дійсно забезпечує комфортний сон і здоров'я. Дуже задоволена покупкою!",
    },
    {
      username: "@zheka.iz.odesy",
      text: "Ковдра з овечої вовни стала справжнім відкриттям для мене! Вона чудово зберігає тепло взимку, а влітку під нею не жарко. Якість виконання на високому рівні, ковдра м'яка і дуже приємна на дотик. Сон під такою ковдрою став набагато кращим та спокійнішим.",
    },
  ];

  return (
    <section id="reviews" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-6">
          Що кажуть клієнти?
        </h2>
        <p className="text-center text-gray-600 mb-8 md:mb-12 text-sm md:text-base">
          Реальні відгуки від наших клієнтів з Instagram
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {review.username.charAt(1).toUpperCase()}
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-900">Відгук від:</p>
                  <p className="text-orange-600 font-semibold">{review.username}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

