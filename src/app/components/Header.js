export default function Header() {
  return (
    <div>
      <div className="bg-[#18181B] flex h-43 justify-between items-center px-22 py-3 box-border">
        <div>
          <div className="bg-[url(/nomnom.svg)] w-[46px] h-[37.3px]"></div>
          <div className="flex flex-col">
            <p class="w-22 h-7 font-extrabold tracking-tight">
              <span class="text-white">Nom</span>
              <span class="text-red-500">Nom</span>
            </p>
            <p className="text-white h-4">Swift delivery</p>
          </div>
        </div>
        <div className="flex gap-[12.81px]">
          <button className="flex items-center px-3 py-2 text-black bg-white rounded-full box-border h-9 w-[75px] text-sm">
            Sign up
          </button>
          <button className="flex items-center px-3 py-2 text-white bg-red-500 rounded-full box-border h-9 w-[65px] text-sm">
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
