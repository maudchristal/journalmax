"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createId } from "@/lib/id";
import { loadState, saveState } from "@/lib/storage";
import type {
  Circle,
  FamilyMember,
  IndividualRelease,
  JournalEntry,
  JournalState,
  UserProfile,
} from "@/lib/types";

type JournalContextValue = {
  hydrated: boolean;
  state: JournalState;
  profile: UserProfile;
  addEntry: (input: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => void;
  updateEntry: (id: string, patch: Partial<JournalEntry>) => void;
  removeEntry: (id: string) => void;
  upsertCircle: (circle: Omit<Circle, "id" | "createdAt"> & { id?: string }) => void;
  removeCircle: (id: string) => void;
  upsertFamily: (
    member: Omit<FamilyMember, "id" | "createdAt"> & { id?: string },
  ) => void;
  removeFamily: (id: string) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
};

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<JournalState>(() => loadState());

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  const addEntry = useCallback(
    (input: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const entry: JournalEntry = {
        ...input,
        id: createId(),
        createdAt: now,
        updatedAt: now,
      };
      setState((s) => ({ ...s, entries: [entry, ...s.entries] }));
    },
    [],
  );

  const updateEntry = useCallback((id: string, patch: Partial<JournalEntry>) => {
    setState((s) => ({
      ...s,
      entries: s.entries.map((e) =>
        e.id === id
          ? { ...e, ...patch, updatedAt: new Date().toISOString() }
          : e,
      ),
    }));
  }, []);

  const removeEntry = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      entries: s.entries.filter((e) => e.id !== id),
    }));
  }, []);

  const upsertCircle = useCallback(
    (circle: Omit<Circle, "id" | "createdAt"> & { id?: string }) => {
      const now = new Date().toISOString();
      setState((s) => {
        if (circle.id) {
          return {
            ...s,
            circles: s.circles.map((c) =>
              c.id === circle.id
                ? { ...c, ...circle, id: circle.id }
                : c,
            ),
          };
        }
        const row: Circle = {
          ...circle,
          id: createId(),
          createdAt: now,
        };
        return { ...s, circles: [row, ...s.circles] };
      });
    },
    [],
  );

  const removeCircle = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      circles: s.circles.filter((c) => c.id !== id),
      entries: s.entries.map((e) => ({
        ...e,
        circleIds: e.circleIds.filter((cid) => cid !== id),
      })),
    }));
  }, []);

  const upsertFamily = useCallback(
    (member: Omit<FamilyMember, "id" | "createdAt"> & { id?: string }) => {
      const now = new Date().toISOString();
      setState((s) => {
        if (member.id) {
          return {
            ...s,
            family: s.family.map((f) =>
              f.id === member.id ? { ...f, ...member, id: member.id } : f,
            ),
          };
        }
        const row: FamilyMember = {
          ...member,
          id: createId(),
          createdAt: now,
        };
        return { ...s, family: [row, ...s.family] };
      });
    },
    [],
  );

  const removeFamily = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      family: s.family.filter((f) => f.id !== id),
    }));
  }, []);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState((s) => ({
      ...s,
      profile: { ...s.profile, ...patch },
    }));
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      state,
      profile: state.profile,
      addEntry,
      updateEntry,
      removeEntry,
      upsertCircle,
      removeCircle,
      upsertFamily,
      removeFamily,
      updateProfile,
    }),
    [
      hydrated,
      state,
      addEntry,
      updateEntry,
      removeEntry,
      upsertCircle,
      removeCircle,
      upsertFamily,
      removeFamily,
      updateProfile,
    ],
  );

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
}

export function useJournal(): JournalContextValue {
  const ctx = useContext(JournalContext);
  if (!ctx) {
    throw new Error("useJournal must be used within JournalProvider");
  }
  return ctx;
}

export type NewEntryInput = {
  body: string;
  tags: string[];
  visibility: JournalEntry["visibility"];
  circleIds: string[];
  unlockAt: string | null;
  timedAudience: JournalEntry["timedAudience"];
  individualRelease?: IndividualRelease;
};
