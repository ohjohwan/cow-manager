import { create } from "zustand";

export interface Cow {
  number: string; // 개체 번호
  gender: boolean | null;
  inseminationDate: string; // 수정 일자
  expectedDeliveryDate: string; // 분만 일자
  nextInseminationDate: string; // 다음 수정 일자자
  age?: string; // 개체 나이
  vaccineCheck?: boolean; // 백신 접종 여부
  vaccineDose?: string[] | string; // 백신 접종 차수
}

export type EditableCow = {
  number: string;
} & Partial<Omit<Cow, "number">>;

interface CowStoreState {
  cowState: Cow[]; // 소 정보 배열

  tempCow: Cow; // 현재 입력 중인 소 정보

  setTempField: (field: keyof Cow, value: string | boolean) => void;

  // 개체 추가
  addCow: () => void;

  // 개체 삭제
  deleteCow: (cowNumber: string) => void;

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

  editCow: (payload) =>
    set((state) => ({
      cowState: state.cowState.map((cow) =>
        cow.number === payload.number ? { ...cow, ...payload } : cow
      ),
    })),

  searchCow: (cowNumber) =>
    get().cowState.find((cow) => cow.number === cowNumber),
}));
