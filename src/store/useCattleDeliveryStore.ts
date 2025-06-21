import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InseminationRecord {
  inseminationDate: string;
  expectedDeliveryDate: string;
  nextInseminationDate: string;
  drugName: string;
}
export interface Cow {
  number: string;
  gender: boolean | null;
  vaccinationDate?: string;
  inseminationHistory?: InseminationRecord[];
  birth?: string;
  age?: string;
  vaccineCheck?: boolean;
  vaccinationHistory?: string[];
}

export type EditableCow = {
  number: string;
} & Partial<Omit<Cow, "number">>;

interface CowStoreState {
  cowState: Cow[];
  tempCow: Cow;
  setTempField: (field: keyof Cow, value: Cow[keyof Cow]) => void;
  addCow: () => void;
  deleteCow: (cowNumber: string) => void;
  deleteCowHistory: (
    field: "inseminationHistory" | "vaccinationHistory",
    index: number
  ) => void;
  editCow: (payload: EditableCow) => void;
  searchCow: (cowNumber: string) => Cow[];
}

export const useCowStore = create<CowStoreState>()(
  persist(
    (set, get) => ({
      cowState: [],
      tempCow: {
        number: "",
        gender: null,
      },

      setTempField: (field, value) =>
        set((state) => ({
          tempCow: {
            ...state.tempCow,
            [field]: value,
          },
        })),

      addCow: () =>
        set((state) => ({
          cowState: [...state.cowState, state.tempCow],
          tempCow: {
            number: "",
            gender: null,
          },
        })),

      deleteCow: (cowNumber) =>
        set((state) => ({
          cowState: state.cowState.filter((cow) => cow.number !== cowNumber),
        })),

      deleteCowHistory: (field, index) =>
        set((state) => {
          const prevArray = Array.isArray(state.tempCow[field])
            ? [...(state.tempCow[field] as string[])]
            : [];

          const newArray = prevArray.filter((_, i) => i !== index);

          return {
            tempCow: {
              ...state.tempCow,
              [field]: newArray,
            },
          };
        }),

      editCow: (payload) =>
        set((state) => ({
          cowState: state.cowState.map((cow) =>
            cow.number === payload.number ? { ...cow, ...payload } : cow
          ),
          tempCow: {
            number: "",
            gender: null,
          },
        })),

      searchCow: (cowNumber: string) =>
        get().cowState.filter((cow) => cow.number.includes(cowNumber)),
    }),
    {
      name: "cow-storage",
      partialize: (state) => ({ cowState: state.cowState }), // tempCow는 저장 제외
    }
  )
);
