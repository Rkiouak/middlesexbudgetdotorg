import Image from "next/image";

export default function Hero() {
  return (
    <header>
      <div className="relative w-full h-24 md:h-32 bg-[#1e4d2b]">
        <Image
          src="/middlesex-header.png"
          alt="Town of Middlesex, Vermont - Est. 1763"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
    </header>
  );
}
