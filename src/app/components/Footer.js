export default function Footer() {
  const marqueeItems = Array.from({ length: 8 }, () => "Fresh fast delivered");

  return (
    <footer className="bg-[#0B0D12]">
      <div className="bg-[#EF4444] h-16 sm:h-[72px] flex items-center overflow-hidden">
        <div className="marquee-track">
          <div className="marquee-content">
            {marqueeItems.map((item, index) => (
              <p
                key={`marquee-a-${index}`}
                className="text-white text-xl sm:text-2xl font-semibold whitespace-nowrap"
              >
                {item}
              </p>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {marqueeItems.map((item, index) => (
              <p
                key={`marquee-b-${index}`}
                className="text-white text-xl sm:text-2xl font-semibold whitespace-nowrap"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 text-white sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-3 h-12 w-12 bg-[url(/nomnom.svg)] bg-contain bg-center bg-no-repeat" />
            <p className="text-sm font-extrabold tracking-tight">
              <span>Nom</span>
              <span className="text-red-500">Nom</span>
            </p>
            <p className="text-xs text-white/70">Swift delivery</p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-[11px] uppercase tracking-wider text-white/50">NomNom</p>
            <p>Home</p>
            <p>Contact us</p>
            <p>Delivery zone</p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-[11px] uppercase tracking-wider text-white/50">Menu</p>
            <p>Appetizers</p>
            <p>Salads</p>
            <p>Pizzas</p>
            <p>Main dishes</p>
            <p>Desserts</p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-[11px] uppercase tracking-wider text-white/50">Menu</p>
            <p>Side dish</p>
            <p>Brunch</p>
            <p>Desserts</p>
            <p>Beverages</p>
            <p>Fish &amp; Sea foods</p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-[11px] uppercase tracking-wider text-white/50">Follow us</p>
            <div className="flex gap-3">
              <button className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
                </svg>
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-[11px] text-white/40">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <p>Copy right 2024 © Nomnom LLC</p>
            <p>Privacy policy</p>
            <p>Terms and condition</p>
            <p>Cookie policy</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
