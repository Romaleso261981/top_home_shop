import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Top Home Shop</h3>
            <p className="text-gray-400 text-sm">
              Якісні ковдри з овечої вовни для вашого комфортного сну
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Допомога</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Політика конфіденційності
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Договір оферти
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Угода користувача
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Умови гарантії та повернення
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Контакти</h4>
            <p className="text-gray-400 text-sm mb-2">
              Доставка по всій Україні
            </p>
            <p className="text-gray-400 text-sm">
              Нова Пошта та Укрпошта
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Top Home Shop. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
}

