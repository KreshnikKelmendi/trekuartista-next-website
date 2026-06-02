"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WorkDetailVideoAudioContextValue = {
  unmutedId: string | null;
  setUnmutedId: (id: string | null) => void;
};

const WorkDetailVideoAudioContext =
  createContext<WorkDetailVideoAudioContextValue | null>(null);

export function WorkDetailVideoAudioProvider({ children }: { children: ReactNode }) {
  const [unmutedId, setUnmutedId] = useState<string | null>(null);

  const value = useMemo(
    () => ({ unmutedId, setUnmutedId }),
    [unmutedId]
  );

  return (
    <WorkDetailVideoAudioContext.Provider value={value}>
      {children}
    </WorkDetailVideoAudioContext.Provider>
  );
}

export function useWorkDetailVideoAudio() {
  return useContext(WorkDetailVideoAudioContext);
}
