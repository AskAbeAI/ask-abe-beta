import Link from 'next/link';
import Image from 'next/image';


const NavBar: React.FC = () => {
  return (
    <header className="justify-center items-center bg-[#FAF5E6] flex flex-col px-5 border-b border-solid">
      <nav className="justify-between items-stretch flex w-full my-2">
        <div className="flex items-center font-imfell font-bold text-2xl">ASK ABE AI</div>
        <ul className="items-stretch self-center flex justify-between gap-10 my-auto">
          <li className="text-black text-base font-dmsans leading-6">
            <Link href="/" aria-label="Link One">
              Home
            </Link>
          </li>
          <li className="text-black text-base font-dmsans leading-6">
            <Link href="/how" aria-label="Link One">
              How To Use
            </Link>
          </li>
          <li className="text-black text-base font-dmsans leading-6">
            <Link href="/devlog" aria-label="Link Two">
              Devlog
            </Link>
          </li>
          <li className="text-black text-base font-dmsans leading-6">
            <Link href="/legal" aria-label="Link Three">
              Legal
            </Link>
          </li>
          <li className="justify-between items-stretch font-dmsans flex gap-1">
            <Link href="/playground" aria-label="Link Four">
              <div className="text-black text-base leading-6">Playground</div>
            </Link>

          </li>
        </ul>
        <Link href="/sign-in" className="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
          <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
          <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
          <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
          <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
          <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
          <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">Sign In</span>
        </Link>
        {/* <button
          className="text-white text-base leading-6 whitespace-nowrap justify-center items-stretch border bg-zinc-500 rounded-full px-5 py-2 border-solid border-black"
          type="button"
        >
          Sign In
        </button> */}
      </nav>
    </header>
  );
}

export default NavBar;