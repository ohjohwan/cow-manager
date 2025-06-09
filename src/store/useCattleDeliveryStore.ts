import { create } from "zustand";

export interface Cow {
  number: string; // 개체 번호
  gender: boolean | null;
  inseminationDate?: string; // 수정 일자
  vaccinationDate?: string;
  inseminationHistory?: string[]; // 수정 차수
  expectedDeliveryDate?: string; // 분만 일자
  nextInseminationDate?: string; // 다음 수정 일자
  birth?: string;
  age?: string; // 개체 나이
  vaccineCheck?: boolean; // 백신 접종 여부
  vaccinationHistory?: string[]; // 백신 접종 차수
}

export type EditableCow = {
  number: string;
} & Partial<Omit<Cow, "number">>;

interface CowStoreState {
  // 소 정보 배열
  cowState: Cow[];

  // 현재 입력 중인 소 정보
  tempCow: Cow;

  // 개체 정보 수정
  setTempField: (field: keyof Cow, value: string | string[] | boolean) => void;

  // 개체 추가
  addCow: () => void;

  // 개체 삭제
  deleteCow: (cowNumber: string) => void;

  // 개체 수정 내역 삭제
  deleteCowHistory: (
    field: "inseminationHistory" | "vaccinationHistory",
    index: number
  ) => void;

  // 개체 수정
  editCow: (payload: EditableCow) => void;

  // 개체 검색
  searchCow: (cowNumber: string) => void;
}

export const useCowStore = create<CowStoreState>((set, get) => ({
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

  deleteCowHistory: (
    field: "inseminationHistory" | "vaccinationHistory",
    index: number
  ) =>
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
    })),

  searchCow: (cowNumber) =>
    get().cowState.find((cow) => cow.number === cowNumber),
}));
