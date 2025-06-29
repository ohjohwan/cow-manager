import {
  useCowStore,
  Cow,
  InseminationRecord,
} from "@/store/useCattleDeliveryStore";
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
  const [birthCalendar, setBirthCalendar] = useState(false);
  const [inseminationCalendar, setInseminationCalendar] = useState(false);
  const [vaccinationCalendar, setVaccinationCalendar] = useState(false);
  const [inseminationDate, setInseminationDate] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [nextInseminationDate, setNextInseminationDate] = useState("");

  const gender = tempCow.gender ?? cow.gender;

  const handleChange = (field: keyof Cow, value: Cow[keyof Cow]) => {
    setTempField(field, value);
  };

  const handleSave = () => {
    editCow(tempCow);
    toggle();
  };

  const handleInseminationCalendar = (date: string) => {
    setInseminationDate(date);
    setInseminationCalendar(false);
  };

  const handleVaccinationCalendar = (date: string) => {
    setTempField("vaccinationDate", date);
    setVaccinationCalendar(false);
  };

  const Insemination_dueDate_calculator = (date: Date) => {
    const { nextInsemination, dueDate } = calculateDates(date);
    setNextInseminationDate(nextInsemination);
    setExpectedDeliveryDate(dueDate);
  };

  const handleBirthCalendar = (date: string) => {
    setTempField("birth", date);
    setBirthCalendar(false);
  };

  const birthCalculator = (date: Date) => {
    const age = ageCalculator(date);
    setTempField("age", `${age}`);
  };

  // 개체 번호 자동 포맷
  const handleFomatted = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    let autoFormatted = value;

    if (value.length > 8) {
      autoFormatted = `${value.slice(0, 4)} ${value.slice(4, 8)} ${value.slice(
        8
      )}`;
    } else if (value.length > 4) {
      autoFormatted = `${value.slice(0, 4)} ${value.slice(4, 8)}`;
    } else {
      autoFormatted = `${value.slice(0, value.length)}`;
    }

    return autoFormatted;
  };

  // 개체 번호 인풋 유효성 검사
  const handleNumberCheck = (
    parent: keyof Cow,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\s/g, "");

    const returnFormatted = handleFomatted(e);

    if (!/^\d+$/.test(value)) {
      alert("숫자만 입력하세요.");
    }

    setTempField(parent, returnFormatted);
  };

  const handleAddInseminationRecord = () => {
    const currentHistory: InseminationRecord[] = Array.isArray(
      tempCow.inseminationHistory
    )
      ? (tempCow.inseminationHistory as InseminationRecord[])
      : [];

    const newRecord: InseminationRecord = {
      inseminationDate,
      expectedDeliveryDate,
      nextInseminationDate,
      drugName: "",
    };

    if (inseminationDate !== "") {
      setTempField("inseminationHistory", [...currentHistory, newRecord]);
    }
  };

  const handleVaccinationHistory = (date: string) => {
    const currentHistory = Array.isArray(tempCow.vaccinationHistory)
      ? tempCow.vaccinationHistory
      : [];

    setTempField("vaccinationHistory", [...currentHistory, date]);
  };

  const handleDeleteHistory = ({ field, index }: DeleteProps) => {
    deleteCowHistory(field, index);
  };

  const handleDrugNameChange = (index: number, value: string) => {
    const updatedHistory = [...(tempCow.inseminationHistory || [])];
    updatedHistory[index] = {
      ...updatedHistory[index],
      drugName: value,
    };
    setTempField("inseminationHistory", updatedHistory);
  };

  return (
    <div className="flex justify-center items-center m-auto fixed inset-0 bg-black/50 z-40 ">
      <div className="bg-gray-500 w-[650px] h-[900px] p-[50px] relative flex flex-col gap-[40px] overflow-scroll">
        <div className="flex justify-between ">
          <div className="flex flex-col justify-center items-center">
            <h3>개체 번호</h3>
            <div className="flex justify-center border-[1px] w-[180px] h-[26px]">
              {cow.number}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3>성별</h3>
            <div className="border-[1px] w-[180px] flex justify-center gap-[20px] h-[26px]">
              <label>
                <input
                  type="radio"
                  name="gender1"
                  checked={gender === false}
                  onChange={() => handleChange("gender", false)}
                  className="border-[1px]"
                />
                암
              </label>
              <label>
                <input
                  type="radio"
                  name="gender1"
                  checked={gender === true}
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
                {inseminationDate}
              </div>
              <button
                className="border-[1px]"
                onClick={() => {
                  if (inseminationDate) {
                    handleAddInseminationRecord();
                  } else {
                    alert("수정 일자를 먼저 선택해주세요.");
                  }
                }}
              >
                추가
              </button>
            </div>
            {inseminationCalendar && (
              <div className="absolute top-[50px] bg-black z-50">
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
              {expectedDeliveryDate}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3>재발정일</h3>
            <div className="w-[180px] border-[1px] h-[26px] text-center">
              {nextInseminationDate}
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
                  checked={tempCow.vaccineCheck === true}
                  onChange={() => handleChange("vaccineCheck", true)}
                  className="border-[1px]"
                />
                접종
              </label>
              <label>
                <input
                  type="radio"
                  name="vaccineCheck"
                  checked={tempCow.vaccineCheck === false}
                  onChange={() => handleChange("vaccineCheck", false)}
                  className="border-[1px]"
                />
                미접종
              </label>
            </div>
          </div>
          <div>
            <div className="flex flex-col justify-center items-center relative">
              <h3>백신 접종일</h3>
              <div className="flex justify-between w-[180px] h-[27px] border-[1px]">
                <button
                  onClick={() => {
                    if (tempCow.vaccineCheck) {
                      setVaccinationCalendar((prev) => !prev);
                    }
                  }}
                  className="w-[140px]"
                  disabled={
                    tempCow.vaccineCheck === !true &&
                    tempCow.vaccineCheck === undefined
                  }
                >
                  {tempCow.vaccinationDate}
                </button>
                <button
                  className="border-[1px]"
                  onClick={() => {
                    if (tempCow.vaccinationDate) {
                      handleVaccinationHistory(tempCow.vaccinationDate);
                    } else {
                      alert("백신 접종 날짜를 선택해 주세요.");
                    }
                  }}
                >
                  추가
                </button>
              </div>
              {vaccinationCalendar && (
                <div className="absolute top-[50px] bg-black">
                  <Calendar onDateSelect={handleVaccinationCalendar} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-center">
            <div>부</div>
            <input
              value={tempCow.father ?? ""}
              maxLength={11}
              onChange={(e) => handleNumberCheck("father", e)}
              className="border-[1px] w-[180px]"
            />
          </div>
          <div className="text-center">
            <div>모</div>
            <input
              value={tempCow.mother ?? ""}
              maxLength={11}
              onChange={(e) => handleNumberCheck("mother", e)}
              className="border-[1px] w-[180px]"
            />
          </div>
        </div>
        <div className="flex flex-col">
          수정 차수
          <div className="flex flex-col gap-[5px] items-center bg-white h-[150px] w-full text-black relative overflow-auto">
            <div className="flex justify-start items-center text-center w-[800px] absolute top-0 left-0">
              <div className="w-[80px] border-[1px]">차수</div>
              <div className="w-[100px] border-[1px]">수정일</div>
              <div className="w-[100px] border-[1px]">분만일</div>
              <div className="w-[100px] border-[1px]">다음 수정일</div>
              <div className="w-[100px] border-[1px]">약품명</div>
            </div>
            <div className="w-full mt-[25px]">
              {(tempCow.inseminationHistory ?? []).map((record, index) => {
                return (
                  <div key={index} className="flex gap-[15px] w-[1000px]">
                    <div className="flex">
                      <div className="w-[80px] text-center">
                        {index + 1}차 수정 :
                      </div>
                      <div className="w-[100px] text-center">
                        {record.inseminationDate}
                      </div>
                      <div className="w-[100px] text-center">
                        {record.expectedDeliveryDate}
                      </div>
                      <div className="w-[100px] text-center">
                        {record.nextInseminationDate}
                      </div>
                    </div>

                    <input
                      value={record.drugName ?? ""}
                      className="w-[150px] border-[1px]"
                      placeholder="약품"
                      maxLength={10}
                      onChange={(e) =>
                        handleDrugNameChange(index, e.target.value)
                      }
                    />
                    <div className="flex">
                      <button
                        className="underline"
                        onClick={() =>
                          handleDeleteHistory({
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
          </div>
        </div>
        <div className="flex flex-col">
          접종 차수
          <div className="flex flex-col items-center justify-center bg-white h-[150px] w-full text-black gap-[10px]">
            {(tempCow.vaccinationHistory ?? []).map((date, index) => {
              return (
                <div key={index} className="flex gap-[5px]">
                  <div>
                    {index + 1}차 접종 : {date}
                  </div>

                  <button className="underline">수정</button>
                  <button
                    className="underline"
                    onClick={() =>
                      handleDeleteHistory({
                        field: "vaccinationHistory",
                        index,
                      })
                    }
                  >
                    삭제
                  </button>
                  <input className="border-[1px]" placeholder="정액 번호" />
                </div>
              );
            })}
          </div>
        </div>
        <button className="flex justify-end" onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
}
