import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full text-orange-700 font-semibold">
              Мега розпродаж -50%
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Ковдра стьобана<br />на овчині
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 md:mb-8 font-medium">
              ВАШ КОМФОРТ - НАША ТУРБОТА!
            </p>
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 line-through text-lg md:text-xl">2100 грн</span>
                <span className="text-3xl md:text-4xl font-bold text-orange-600">1050 грн</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#order"
                className="bg-orange-600 text-white px-8 py-4 rounded-full hover:bg-orange-700 transition-colors font-bold text-lg text-center"
              >
                Придбати
              </Link>
              <Link
                href="#about"
                className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-full hover:bg-orange-50 transition-colors font-bold text-lg text-center"
              >
                Дізнатись більше
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 w-full max-w-lg">
            <img 
              src="/images/5.jpg" 
              alt="Ковдра стьобана на овчині" 
              className="wow fadeInRight rounded-2xl shadow-xl w-full h-auto"
              data-wow-delay="0.6s"
              style={{ visibility: "visible", animationDelay: "0.6s", animationName: "fadeInRight" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

