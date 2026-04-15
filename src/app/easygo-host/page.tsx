"use client"

export default function HostHero() {
      const goToOwnerModule = () => {
    // Dusre project ka full URL yahan daalo
    window.location.href = "http://localhost:5174";
  };
  return (
    <section className="w-full bg-gray-50 py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Turn Your Car into <span className="text-orange-500">Cash</span>
          </p>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Rent Your Car with{" "}
            <span className="text-blue-600 underline underline-offset-4">
              EasyGo Host
            </span>{" "}
            Today!
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            Join 35,000+ hosts earning car rental income by renting out their
            cars on EasyGo, India&apos;s largest car-sharing marketplace. Easy &
            secure.
          </p>

          <button 
          onClick={goToOwnerModule}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
            Register as Host
          </button>
        </div>

       
      </div>

      {/* STATS SECTION */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
        
        {[
          { value: "35K+", label: "Live Hosts" },
          { value: "₹100Cr+", label: "Earned by Hosts" },
          { value: "90+", label: "Cities" },
          { value: "70L+", label: "Trips Served" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold text-gray-900">
              {item.value}
            </h2>
            <p className="text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}