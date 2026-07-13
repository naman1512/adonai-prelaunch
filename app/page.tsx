import Lightning from "@/components/Lightning";
import AdonaiLogo3D from "@/components/AdonaiLogo3D";
import Footer from "@/components/Footer";
import FooterGL from "@/components/UI/FooterGL";

export default function Home() {
  return (
    <div className="relative w-full bg-black overflow-hidden">
      {/* Aurora layer — atmospheric depth */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FooterGL />
      </div>

      {/* Lightning layer — on top of aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Lightning
          hue={353}
          xOffset={0}
          speed={1.4}
          intensity={2}
          size={3}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 w-full h-screen overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="h-[80vh] w-full">
            <AdonaiLogo3D />
          </div>
        </div>
        {/* Bottom blend — dissolves hero into marquee */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-20"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, #050505 100%)",
          }}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
