"use client";

import Calendar from "@/components/Calendar";
import { useState } from "react";
import { useCowStore } from "@/store/useCattleDeliveryStore";
import { EditCow } from "@/store/useCattleDeliveryStore";

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false); // 달력 표시 토글 상태
  const { tempCow, setTempField, cowState, addCow, deleteCow, searchCow } =
    useCowStore();
  const [error, setError] = useState("");
  const [searchCowNumber, setSearchCowNumber] = useState("");
  const [searchReturn, setSearchReturn] = useState<EditCow | null>(null);

  const handleDateSelect = (date: string) => {
    setTempField("inseminationDate", date);
    setShowCalendar(false); // 날짜 선택 후 캘린더 닫기
  };

  // 개체 번호 자동 포맷
  const handleFomatted = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    let autoFormatted = value;

    if (value.length > 8) {
      autoFormatted = `${value.slice(0, 4)} ${value.slice(4, 8)} ${value.slice(
        8
      )}`;
    } else if (value.length <= 8) {
      autoFormatted = `${value.slice(0, 4)} ${value.slice(4, 8)}`;
    }

    return autoFormatted;
  };

  // 개체 번호 인풋 유효성 검사
  const handleNumberCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");

    const returnFormatted = handleFomatted(e);

    if (!/^\d+$/.test(value)) {
      setError("숫자만 입력하세요.");
    } else if (value.length !== 9) {
      setError("9자리 숫자를 입력하세요.");
    } else {
      // 유효한 입력인 경우에 에러 제거 필수 (꼭 기억하기)
      setError("");
    }

    setTempField("number", returnFormatted);
  };

  // 개체 등록(등록 전 중복 여부 검사 수행)
  const handleAddCow = () => {
    const isDuplicate = cowState.some((cow) => cow.number === tempCow.number);
    if (isDuplicate) {
      alert("이미 등록된 개체 번호입니다.");
    } else {
      addCow();
    }
  };

  // 분만 예정일, 수정일 계산식
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

  const handleSearchCow = (cowNumber: string) => {
    const result = searchCow(cowNumber);
    setSearchReturn(result ?? null);
  };

  return (
    <>
      <p className="text-[50px] text-center">소 개체 등록</p>
      <div className="text-white text-[15px] flex gap-[20px]">
        <div>
          <h3>개체 번호</h3>
          <input
            pattern="^\d+$"
            value={tempCow.number}
            minLength={11}
            maxLength={11}
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
      <div className="text-center w-[500px] flex flex-col justify-center items-center gap-[15px] mx-auto">
        {cowState.map((cow) => {
          return (
            <div key={cow.number} className="flex gap-[20px]">
              <div>{cow.number}</div>
              <div className="flex gap-[10px]">
                <button className="border-[1px]">수정</button>
                <button
                  className="border-[1px]"
                  onClick={() => deleteCow(cow.number)}
                >
                  삭제
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[50px]">개체 번호 검색</p>
      <div className="flex gap-[15px]">
        <input
          value={searchCowNumber}
          className="border-[1px] w-full m-auto"
          onChange={(e) => setSearchCowNumber(handleFomatted(e))}
          maxLength={11}
          minLength={11}
        ></input>
        <button
          className="block w-[40px] border-[1px]"
          onClick={() => handleSearchCow(searchCowNumber)}
        >
          검색
        </button>
      </div>
      <div>
        {searchReturn && (
          <>
            <div>{searchReturn.number}</div>
            <div>{searchReturn.gender}</div>
          </>
        )}
      </div>
    </>
  );
}
