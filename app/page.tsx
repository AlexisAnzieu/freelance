import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="relative h-[90vh] bg-gradient-to-br from-black to-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1664575599736-c5197c684128?q=80&auto=format"
          alt="Freelancer working"
          fill
          className="object-cover opacity-40 transition-opacity duration-700 hover:opacity-50"
          priority
        />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white space-y-6">
              <h1 className="text-5xl tracking-tight font-extrabold sm:text-6xl md:text-7xl animate-fade-in">
                <span className="block bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                  Freelance Tooling
                </span>
                <span className="block bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mt-2">
                  Streamline Your Business
                </span>
              </h1>
              <p className="mt-6 max-w-md mx-auto text-lg sm:text-xl md:mt-8 md:text-2xl md:max-w-3xl text-gray-300 leading-relaxed">
                Elevate your freelance journey with our comprehensive suite of
                tools. From invoice management to client tracking, we&apos;ve
                got everything you need to succeed.
              </p>
              <div className="mt-12 flex gap-6 justify-center">
                <a
                  href="/signup"
                  className="transform transition-all duration-300 hover:scale-105 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-medium text-white hover:from-blue-700 hover:to-blue-800 md:py-5 md:px-12 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </a>
                <a
                  href="/login"
                  className="transform transition-all duration-300 hover:scale-105 rounded-lg backdrop-blur-md bg-white/10 px-8 py-4 text-lg font-medium text-white hover:bg-white/20 md:py-5 md:px-12 border border-white/30"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-50 to-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature cards */}
            {[
              {
                title: "Invoice Management",
                description:
                  "Create and manage professional invoices effortlessly. Track payments and send automatic reminders.",
                image:
                  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&auto=format",
              },
              {
                title: "Client Management",
                description:
                  "Keep track of your clients, projects, and communications all in one place.",
                image:
                  "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&auto=format",
              },
              {
                title: "Analytics Dashboard",
                description:
                  "Get insights into your business with detailed analytics and reporting tools.",
                image:
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&auto=format",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative transform transition-all duration-300 hover:scale-105"
              >
                <div className="h-72 w-full relative rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 className="text-xl font-bold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
