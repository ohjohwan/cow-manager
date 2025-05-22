import { create } from "zustand";

interface Cow {
  number: string; // 개체 번호
  gender: boolean | null;
  inseminationDate: string; // 수정 일자
  expectedDeliveryDate: string; // 분만 일자
  nextInseminationDate: string; // 다음 수정 일자자
}

export interface EditCow extends Cow {
  vaccineCheck: boolean;
  vaccineDose: string[] | string;
}

interface CowStoreState {
  cowState: Cow[]; // 소 정보 배열

  tempCow: Cow; // 현재 입력 중인 소 정보

  setTempField: (field: keyof Cow, value: string) => void;

  addCow: () => void;
  deleteCow: (cowNumber: string) => void;

  searchCow: (cowNumber: string) => void;
}

export const useCowStore = create<CowStoreState>((set, get) => ({
  cowState: [],

  tempCow: {
    number: "",
    gender: null,
    inseminationDate: "",
    expectedDeliveryDate: "",
    nextInseminationDate: "",
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
        inseminationDate: "",
        expectedDeliveryDate: "",
        nextInseminationDate: "",
      },
    })),

  deleteCow: (cowNumber) =>
    set((state) => ({
      cowState: state.cowState.filter((cow) => cow.number !== cowNumber),
    })),

  searchCow: (cowNumber) =>
    get().cowState.find((cow) => cow.number === cowNumber),
}));
