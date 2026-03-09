import Link from "next/link";
import LogoFlat from "@/app/components/shared/svg/LogoFlat";

export default function SpeakerInviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-800">
            <LogoFlat size={28} />
            {/* <span className="font-semibold text-brand-500">Citizen Monitors</span> */}
          </Link>
          <span className="text-sm text-gray-500">Speaker invite</span>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-4xl">{children}</main>
    </div>
  );
}
