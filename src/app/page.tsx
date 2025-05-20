"use client";

import Calendar from "@/components/Calendar";
import { useState } from "react";
import { useCowStore } from "@/store/useCattleDeliveryStore";

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false); // 달력 표시 토글 상태
  const { tempCow, setTempField, cowState, addCow } = useCowStore();
  const [error, setError] = useState("");

  const handleDateSelect = (date: string) => {
    setTempField("inseminationDate", date);
    setShowCalendar(false); // 날짜 선택 후 캘린더 닫기
  };

  // 개체 번호 인풋 유효성 검사
  const handleNumberCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^\d+$/.test(value)) {
      setError("숫자만 입력하세요.");
    } else if (value.length < 4 || value.length > 10) {
      setError("4~10자리 숫자를 입력하세요.");
    } else {
      setError("");
    }

    setTempField("number", e.target.value);
  };

  // 등록 전 중복 개체 검사
  const handleAddCow = () => {
    const isDuplicate = cowState.some((cow) => cow.number === tempCow.number);
    if (isDuplicate) {
      alert("이미 등록된 개체 번호입니다.");
    } else {
      addCow();
    }
  };

  const Insemination_dueDate_Calculator = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");

    const formatNextDate = new Date(date);
    formatNextDate.setDate(formatNextDate.getDate() + 20);
    formatNextDate.setMonth(formatNextDate.getMonth() + 1);

    const formatDueDate = new Date(date);
    formatDueDate.setDate(formatDueDate.getDate() + 10);
    formatDueDate.setDate(formatDueDate.getMonth() - 3);

    // 다음 수정일
    const nextInsemination = `${formatNextDate.getFullYear()}-${pad(
      formatNextDate.getMonth()
    )}-${pad(formatNextDate.getDate())}`;

    // 분만 예정일
    const dueDate = `${formatDueDate.getFullYear()}-${
      formatDueDate.getMonth() - 3
    }-${formatDueDate.getDate() + 10}`;

    setTempField("nextInseminationDate", nextInsemination);
    setTempField("expectedDeliveryDate", dueDate);
  };

  const isValid =
    Object.values(tempCow).every((value) => value !== "") && !error;

  return (
    <>
      <p className="text-[50px] text-center">소 개체 등록</p>
      <div className="text-white text-[15px] flex gap-[20px]">
        <div>
          <h3>개체 번호</h3>
          <input
            pattern="^\d+$"
            value={tempCow.number}
            minLength={4}
            maxLength={10}
            className="border-[1px]"
            placeholder="개체 번호 입력"
            onChange={(e) => handleNumberCheck(e)}
            inputMode="numeric"
          ></input>
          {error && <p>{error}</p>}
        </div>
        <div>
          <h3>수정 일자</h3>
          <input
            pattern="^\d+$/"
            value={tempCow.inseminationDate}
            required
            onClick={() => setShowCalendar((prev) => !prev)}
            readOnly
            placeholder="수정 일자 선택"
            className="border-[1px]"
          />
          {showCalendar && (
            <Calendar
              onDateSelect={handleDateSelect}
              onDateObject={Insemination_dueDate_Calculator}
            />
          )}
        </div>
        <div>
          <h3>분만 예정일</h3>
          <div className="w-[100px]">{tempCow.expectedDeliveryDate}</div>
        </div>
        <div>
          <h3>다음 수정 일자</h3>
          <div className="w-[100px]">{tempCow.nextInseminationDate}</div>
        </div>
        <button
          className="border-[1px] w-[50px]"
          onClick={handleAddCow}
          disabled={!isValid}
        >
          등록
        </button>
      </div>
      <p className="text-[50px] text-center">등록 개체</p>
      <ul>
        {cowState.map((cow) => {
          return (
            <div key={cow.number}>
              <div>{cow.number}</div>
              <button>수정</button>
              <button>삭제</button>
            </div>
          );
        })}
      </ul>
    </>
  );
}
