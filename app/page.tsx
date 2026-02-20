import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Guestbook } from "@/components/sections/guestbook";
import { Contact } from "@/components/sections/contact";
import { ChatWidget } from "@/components/chat-widget";
import { CustomCursor } from "@/components/custom-cursor";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background">
      <CustomCursor />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Guestbook />
      <Contact />
      <ChatWidget />
    </main>
  );
}
