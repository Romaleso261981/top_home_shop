type FeedbackFormSectionProps = {
  title: string;
  buttonText: string;
};

export function FeedbackFormSection({
  title,
  buttonText,
}: FeedbackFormSectionProps) {
  return (
    <section className="mb-12 bg-[#15698f] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">{title}</h2>

        <form className="mt-8">
          <div className="grid gap-4 lg:grid-cols-3">
            <input
              type="text"
              name="name"
              placeholder="Ваше ім'я"
              className="h-12 w-full border-0 bg-white px-5 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Ваш телефон"
              className="h-12 w-full border-0 bg-white px-5 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
            />
          </div>

          <textarea
            name="message"
            placeholder="Напишіть питання"
            rows={9}
            className="mt-4 w-full border-0 bg-white px-5 py-4 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
          />

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="min-w-[280px] bg-[linear-gradient(90deg,#0b6e95_0%,#15a8d6_100%)] px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

