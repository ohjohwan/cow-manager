import { EditableCow, useCowStore, Cow } from "@/store/useCattleDeliveryStore";
import { useState } from "react";
import Calendar from "@/components/Calendar";
import { calculateDates, ageCalculator } from "@/utils/dateCalculatorUtils";

interface EditModalProps {
  toggle: () => void;
  cow: Cow;
}

interface DeleteProps {
  field: "inseminationHistory" | "vaccinationHistory";
  index: number;
}

export default function Modal({ toggle, cow }: EditModalProps) {
  const { editCow, tempCow, setTempField, deleteCowHistory } = useCowStore();
  const [editData, setEditData] = useState<EditableCow>({ ...cow });
  const [birthCalendar, setBirthCalendar] = useState(false);
  const [inseminationCalendar, setInseminationCalendar] = useState(false); // 달력 표시 토글 상태

  const handleChange = (field: keyof EditableCow, value: string | boolean) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    editCow(editData);
    toggle();
  };

  const handleInseminationCalendar = (date: string) => {
    setTempField("inseminationDate", date);
    setInseminationCalendar(false); // 날짜 선택 후 캘린더 닫기
  };

  const Insemination_dueDate_calculator = (date: Date) => {
    const { nextInsemination, dueDate } = calculateDates(date);
    setTempField("nextInseminationDate", nextInsemination);
    setTempField("expectedDeliveryDate", dueDate);
  };

  const handleBirthCalendar = (date: string) => {
    setTempField("birth", date);
    setBirthCalendar(false);
  };

  const birthCalculator = (date: Date) => {
    const age = ageCalculator(date);
    setTempField("age", `${age}`);
  };

  const handleInseminationHistory = (date: string) => {
    const currentHistory = Array.isArray(tempCow.inseminationHistory)
      ? tempCow.inseminationHistory
      : [];

    setTempField("inseminationHistory", [...currentHistory, date]);
  };

  const handleInseminationDeleteHistory = ({ field, index }: DeleteProps) => {
    deleteCowHistory(field, index);
  };

  return (
    <div className="flex justify-center items-center m-auto fixed inset-0 bg-black/50 z-40">
      <div className="bg-gray-500 w-[500px] h-[900px] p-[50px] relative flex flex-col gap-[40px]">
        <div className="flex justify-between ">
          <div className="flex flex-col justify-center items-center">
            <h3>개체 번호</h3>
            <div className="flex justify-center border-[1px] w-[180px] h-[26px]">
              {cow.number}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3>암수 여부</h3>
            <div className="border-[1px] w-[180px] flex justify-center gap-[20px] h-[26px]">
              <label>
                <input
                  type="radio"
                  name="gender"
                  checked={editData.gender === false}
                  onChange={() => handleChange("gender", false)}
                  className="border-[1px]"
                />
                암
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  checked={editData.gender === true}
                  onChange={() => handleChange("gender", true)}
                  className="border-[1px]"
                />
                수
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-center items-center text-center relative">
            <h3 className="block">출생일</h3>
            <div
              className="border-[1px] w-[180px] h-[27px]"
              onClick={() => setBirthCalendar((prev) => !prev)}
            >
              {tempCow.birth} / {tempCow.age}개월
            </div>
            {birthCalendar && (
              <div className="absolute top-[50px] bg-black z-50">
                <Calendar
                  onDateSelect={handleBirthCalendar}
                  onDateObject={birthCalculator}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-center relative">
            <h3>수정 일자</h3>
            <div className="border-[1px] w-[180px] h-[27px] flex justify-between">
              <div
                onClick={() => setInseminationCalendar((prev) => !prev)}
                className="relative text-center w-[140px] h-[27px]"
              >
                {tempCow.inseminationDate}
              </div>
              <button
                className="border-[1px]"
                onClick={() => {
                  if (tempCow.inseminationDate) {
                    handleInseminationHistory(tempCow.inseminationDate);
                  } else {
                    alert("수정 일자를 먼저 선택해주세요.");
                  }
                }}
              >
                추가
              </button>
            </div>
            {inseminationCalendar && (
              <div className="absolute top-[50px] bg-black">
                <Calendar
                  onDateSelect={handleInseminationCalendar}
                  onDateObject={Insemination_dueDate_calculator}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-center items-center">
            <h3>분만 예정일</h3>
            <div className="w-[180px] border-[1px] h-[26px] text-center">
              {tempCow.expectedDeliveryDate}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3>다음 수정일</h3>
            <div className="w-[180px] border-[1px] h-[26px] text-center">
              {tempCow.nextInseminationDate}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-center items-center">
            <h3>백신 접종 여부</h3>
            <div className="flex border-[1px] w-[180px] justify-center gap-[20px]">
              <label>
                <input
                  type="radio"
                  name="vaccineCheck"
                  checked={editData.vaccineCheck === true}
                  onChange={() => handleChange("vaccineCheck", true)}
                  className="border-[1px]"
                />
                접종
              </label>
              <label>
                <input
                  type="radio"
                  name="vaccineCheck"
                  checked={editData.vaccineCheck === false}
                  onChange={() => handleChange("vaccineCheck", false)}
                  className="border-[1px]"
                />
                미접종
              </label>
            </div>
          </div>
          <div>
            <div className="flex flex-col justify-center items-center">
              <h3>백신 접종</h3>
              <div className="flex justify-between w-[180px] h-[27px] border-[1px]">
                <button
                  className="w-[140px]"
                  disabled={editData.vaccineCheck === !true}
                ></button>
                <button className="border-[1px]">추가</button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          수정 차수
          <div className="flex items-center justify-center bg-white h-[150px] w-full text-black gap-[10px]">
            <div className="block">
              {(tempCow.inseminationHistory ?? []).map((date, index) => {
                return (
                  <div key={index} className="flex gap-[15px]">
                    <div>
                      {index + 1}차 수정 : {date}
                    </div>
                    <div className="flex">
                      <button className="underline">수정</button>
                      <button
                        className="underline"
                        onClick={() =>
                          handleInseminationDeleteHistory({
                            field: "inseminationHistory",
                            index,
                          })
                        }
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-[5px]"></div>
          </div>
        </div>
        <div className="flex flex-col">
          접종 차수
          <div className="flex items-center justify-center bg-white h-[150px] w-full text-black gap-[10px]">
            <p className="block">1차 수정 : 2025.05.31</p>
            <div className="flex gap-[5px]">
              <button className="underline">수정</button>
              <button className="underline">삭제</button>
            </div>
          </div>
        </div>
        <button
          className="absolute bottom-[10px] right-[10px]"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </div>
  );
}
