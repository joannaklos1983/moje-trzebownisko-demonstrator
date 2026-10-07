"use client";

import { useEffect, useRef } from "react";
import { BottomNav } from "@/components/resident/BottomNav";
import { CalendarScreen } from "@/components/resident/CalendarScreen";
import { EntryScreen } from "@/components/resident/EntryScreen";
import { FavoritesScreen } from "@/components/resident/FavoritesScreen";
import { StartHeader } from "@/components/resident/start/StartHeader";
import { HomeScreen } from "@/components/resident/HomeScreen";
import { MessageDetail } from "@/components/resident/MessageDetail";
import { NotificationsScreen } from "@/components/resident/NotificationsScreen";
import { PendingScreen } from "@/components/resident/PendingScreen";
import { SearchScreen } from "@/components/resident/SearchScreen";
import { SubHeader } from "@/components/resident/SubHeader";
import { useAppState } from "@/lib/store";

/* Aplikacja mieszkańca wewnątrz ramki telefonu. Ekran wynika ze stanu (bez adresów URL). */
export function ResidentApp() {
  const { screen, detailId, stubKey } = useAppState();
  const scrollRef = useRef<HTMLDivElement>(null);

  /* po zmianie widoku przewijamy ekran na górę */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [screen, detailId, stubKey]);

  const showNav = screen !== "entry" && !(screen === "stub" && (stubKey === "register" || stubKey === "about"));

  return (
    <>
      <div className="scr" ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", position: "relative" }}>
        {screen === "entry" && <EntryScreen />}
        {screen === "home" && (
          <>
            <StartHeader />
            <HomeScreen />
          </>
        )}
        {screen !== "entry" && screen !== "home" && (
          <>
            <SubHeader />
            {screen === "notifs" ? <NotificationsScreen /> : screen === "detail" ? <MessageDetail /> : screen === "search" ? <SearchScreen /> : screen === "calendar" ? <CalendarScreen /> : screen === "fav" ? <FavoritesScreen /> : <PendingScreen />}
          </>
        )}
      </div>
      {showNav && <BottomNav />}
    </>
  );
}
