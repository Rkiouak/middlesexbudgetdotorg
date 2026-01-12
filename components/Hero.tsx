import Image from "next/image";

export default function Hero() {
  return (
    <header>
      <div
        className="relative w-full h-24 md:h-32"
        style={{
          background: "linear-gradient(135deg, #162e1a 0%, #1e4d2b 25%, #1e4d2b 75%, #162e1a 100%)"
        }}
      >
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
