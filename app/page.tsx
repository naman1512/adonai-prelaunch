"use client";

import Lightning from "@/components/Lightning";
import AdonaiLogo3D from "@/components/AdonaiLogo3D";
import Footer from "@/components/Footer";
import FooterGL from "@/components/UI/FooterGL";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formExpanded, setFormExpanded] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  const SHEET_URL = "YOUR_WEB_APP_URL_HERE"; // <- paste your Google Apps Script URL

  // Focus name field after expansion animation settles
  useEffect(() => {
    if (formExpanded) {
      const timer = setTimeout(() => nameRef.current?.focus(), 500);
      return () => clearTimeout(timer);
    }
  }, [formExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    setError("");

    try {
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ name, email }),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-black overflow-hidden">
      {/* Aurora layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FooterGL />
      </div>

      {/* Lightning layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Lightning hue={353} xOffset={0} speed={1.4} intensity={2} size={3} />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 w-full h-screen overflow-hidden flex items-center justify-center">

        <div className="relative z-30 flex flex-col items-center text-center px-6 -mt-8">

          {/* 3D Logo */}
          <div className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px]">
            <AdonaiLogo3D />
          </div>

          {/* Message + Description - fade out when form expands */}
          <div
            style={{
              overflow: "hidden",
              maxHeight: formExpanded ? "0px" : "200px",
              opacity: formExpanded ? 0 : 1,
              transform: formExpanded ? "translateY(-8px)" : "translateY(0px)",
              transition: "max-height 0.6s ease, opacity 0.4s ease, transform 0.4s ease",
              pointerEvents: formExpanded ? "none" : "auto",
            }}
          >
            <p
              className="font-display italic -mt-2 mb-1 text-2xl md:text-3xl lg:text-5xl leading-normal"
              style={{
                color: "#f0ece4",
                textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.75)"
              }}
            >
              The Reserve is preparing to open.
            </p>
            <p
              className="font-mono mb-5 leading-relaxed max-w-sm mx-auto text-center"
              style={{
                fontSize: "18px",
                letterSpacing: "0.06em",
                color: "rgba(240, 236, 228, 0.55)",
                textShadow: "0 1px 8px rgba(0,0,0,0.7)"
              }}
            >
              Enter your email to request private access to the inaugural collection.
            </p>
          </div>

          {/* Content Area */}
          {!submitted ? (
            <div className="w-full max-w-sm flex flex-col items-center">

              {/* Form Fields - slide in when expanded */}
              <div
                style={{
                  overflow: "hidden",
                  maxHeight: formExpanded ? "260px" : "0px",
                  opacity: formExpanded ? 1 : 0,
                  transform: formExpanded ? "translateY(0px)" : "translateY(12px)",
                  transition: "max-height 0.6s ease, opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
                  width: "100%",
                }}
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-0 w-full">

                  {/* Name Field */}
                  <div
                    className="relative group/name flex items-center w-full border-b pb-3 mb-4"
                    style={{ borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    <input
                      ref={nameRef}
                      id="waitlist-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="FIRST NAME"
                      spellCheck={false}
                      autoComplete="given-name"
                      className="w-full bg-transparent border-none outline-none font-mono py-2 text-center placeholder:text-white/35 focus:placeholder:text-transparent"
                      style={{
                        fontSize: "14px",
                        letterSpacing: "0.18em",
                        color: "#f0ece4",
                        textShadow: "0 1px 8px rgba(0,0,0,0.6)"
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-0 h-[1.5px] group-focus-within/name:w-full transition-all duration-700"
                      style={{ backgroundColor: "#f0ece4" }}
                    />
                  </div>

                  {/* Email Field */}
                  <div
                    className="relative group/email flex items-center w-full border-b pb-3"
                    style={{ borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    <input
                      id="waitlist-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="EMAIL ADDRESS"
                      spellCheck={false}
                      autoComplete="email"
                      className="w-full bg-transparent border-none outline-none font-mono py-2 text-center placeholder:text-white/35 focus:placeholder:text-transparent"
                      style={{
                        fontSize: "14px",
                        letterSpacing: "0.18em",
                        color: "#f0ece4",
                        textShadow: "0 1px 8px rgba(0,0,0,0.6)"
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-0 h-[1.5px] group-focus-within/email:w-full transition-all duration-700"
                      style={{ backgroundColor: "#f0ece4" }}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p
                      className="font-mono uppercase tracking-widest mt-3 text-center"
                      style={{ fontSize: "10px", color: "rgba(255,100,100,0.85)" }}
                    >
                      {error}
                    </p>
                  )}

                  {/* Reserve Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-mono uppercase mt-6 mx-auto px-10 py-3 rounded-full border transition-all duration-500 disabled:opacity-40"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      color: "#f0ece4",
                      borderColor: "rgba(255,255,255,0.18)",
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = "#f0ece4";
                        e.currentTarget.style.color = "#050505";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#f0ece4";
                    }}
                  >
                    {loading ? "RESERVING..." : "RESERVE"}
                  </button>
                </form>
              </div>

              {/* Request Access Button - visible only before expansion */}
              <div
                style={{
                  overflow: "hidden",
                  maxHeight: formExpanded ? "0px" : "80px",
                  opacity: formExpanded ? 0 : 1,
                  transition: "max-height 0.4s ease, opacity 0.3s ease",
                  pointerEvents: formExpanded ? "none" : "auto",
                }}
              >
                <button
                  type="button"
                  onClick={() => setFormExpanded(true)}
                  className="font-mono uppercase px-10 py-3 rounded-full border transition-all duration-500"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    color: "#f0ece4",
                    borderColor: "rgba(255,255,255,0.18)",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0ece4";
                    e.currentTarget.style.color = "#050505";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#f0ece4";
                  }}
                >
                  REQUEST ACCESS
                </button>
              </div>

            </div>
          ) : (
            <div className="py-4 text-center max-w-lg mx-auto">
              <p
                className="font-display italic text-2xl md:text-3xl leading-snug"
                style={{
                  color: "#f0ece4",
                  textShadow: "0 2px 16px rgba(0,0,0,0.95)"
                }}
              >
                May grace find you first, {name}.
              </p>
              <p
                className="font-mono mt-4 leading-relaxed text-center max-w-lg"
                style={{
                  fontSize: "15px",
                  letterSpacing: "0.12em",
                  color: "rgba(240, 236, 228, 0.5)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.7)"
                }}
              >
                The Reserve will summon you when the doors are ready to open.<br />
                Until then, remain expectant.
              </p>
            </div>
          )}
        </div>

        {/* Bottom blend */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
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
