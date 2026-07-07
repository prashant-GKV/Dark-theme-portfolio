import { useState } from "react";
import { AuroraBackground } from "./components/AuroraBackground";
import { CustomCursor }     from "./components/CustomCursor";
import { PageLoader }       from "./components/PageLoader";
import { NavBar }           from "./components/NavBar";
import { Hero }             from "./components/Hero";
import { LocationMap }      from "./components/LocationMap";
import { Projects }         from "./components/Projects";
import { Skills }           from "./components/Skills";
import { MoreToExplore }    from "./components/MoreToExplore";
import { QuoteBanner }      from "./components/QuoteBanner";
import { Contact }          from "./components/Contact";
import { ChatBot }          from "./components/ChatBot";

export default function App() {
  const [chatMessage, setChatMessage] = useState<string | undefined>(undefined);

  return (
    <div
      style={{
        minHeight:       "100vh",
        backgroundColor: "var(--bg-primary)",
        color:           "var(--text-primary)",
        fontFamily:      "'Inter', sans-serif",
        overflowX:       "hidden",
        position:        "relative",
      }}
    >
      {/* Foundation layers */}
      <AuroraBackground />
      <CustomCursor />
      <PageLoader />

      {/* App shell */}
      <NavBar />

      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero onChatOpen={(msg) => setChatMessage(msg)} />
        <LocationMap />
        <Projects />
        <Skills />
        <MoreToExplore />
        <QuoteBanner />
        <Contact />
      </main>

      <ChatBot key={chatMessage} initialMessage={chatMessage} />
    </div>
  );
}
