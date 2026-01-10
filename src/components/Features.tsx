export default function Features() {
  const features = [
    {
      title: "Комфортний та затишний сон",
      description: "Ковдра з овечої шерсті забезпечить вам комфортний і затишний сон при будь-якій температурі, в будь-який час року.",
      icon: "😴",
    },
    {
      title: "Не викликає алергію",
      description: "За своїм хімічним складом вовняне волокно є білком кератином, який перешкоджає затримці всередині волокон вологи і пилу.",
      icon: "🌿",
    },
    {
      title: "Висока міцність і легкість",
      description: "Вироби володіють чудовими еластичними якостями, мають високу міцність і легкість.",
      icon: "⚡",
    },
    {
      title: "Низька теплопровідність",
      description: "Овчина є матеріалом з низькою теплопровідністю: природне тепло благотворно впливає на болі в спині, суглобах і м'язах.",
      icon: "🔥",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">
          ГОЛОВНІ ПЕРЕВАГИ<br />Ковдри з овечої вовни:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl md:text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-lg md:text-xl text-gray-800 font-semibold mb-2">
            Ексклюзивна укривало з наповнювачем вовна — це співвідношення ціни та якості.
          </p>
          <p className="text-base md:text-lg text-gray-600">
            <strong>можуть бути використані в будь-яку пору року!</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

