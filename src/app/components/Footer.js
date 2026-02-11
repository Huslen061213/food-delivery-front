export default function Footer() {
  return (
    <div className="bg-[#18181B] h-[755px]">
      <div className="bg-[#EF4444] h-[90px] flex items-center overflow-hidden pl-[98px]">
        <div className="flex gap-[34px] px-10">
          <p className="text-white text-3xl font-semibold whitespace-nowrap">
            Fresh fast delivered
          </p>
          <p className="text-white text-3xl font-semibold whitespace-nowrap">
            Fresh fast delivered
          </p>
          <p className="text-white text-3xl font-semibold whitespace-nowrap">
            Fresh fast delivered
          </p>
          <p className="text-white text-3xl font-semibold whitespace-nowrap">
            Fresh fast delivered
          </p>
          <p className="text-white text-3xl font-semibold whitespace-nowrap">
            Fresh fast delivered
          </p>
        </div>
      </div>
      <div>
        <div className="bg-[url(/logo.svg)] w-[88px] h-[93px]"></div>
        <div className="flex flex-col gap-4">
          <p className="text-white">NOMNOM</p>
          <p className="text-white">Home</p>
          <p className="text-white">Contact us</p>
          <p className="text-white">Delivery zone</p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-white">MENU</p>
          <p className="text-white">Appetizers</p>
          <p className="text-white">Salads</p>
          <p className="text-white">Pizzas</p>
          <p className="text-white">Lunch favorites</p>
          <p className="text-white">Main dishes</p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-white">Side dish</p>
          <p className="text-white">Brunch</p>
          <p className="text-white">Desserts</p>
          <p className="text-white">Beverages</p>
          <p className="text-white">Fish & Sea foods</p>
        </div>
      </div>
    </div>
  );
}
