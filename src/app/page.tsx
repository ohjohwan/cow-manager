"use client";

import Calendar from "@/components/Calendar";
import { useState } from "react";
import { useCowStore } from "@/store/useCattleDeliveryStore";

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false); // 달력 표시 토글 상태
  const { tempCow, setTempField, cowState } = useCowStore();

  const handleDateSelect = (date: string) => {
    setTempField("inseminationDate", date);
    setShowCalendar(false); // 날짜 선택 후 캘린더 닫기
  };

  const Insemination_dueDate_Calculator = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 20);
    nextDate.setMonth(nextDate.getMonth() + 1);

    // 다음 수정일
    const nextInsemination = `${nextDate.getFullYear()}-${pad(
      nextDate.getMonth()
    )}-${pad(nextDate.getDate())}`;

    // 분만 예정일
    const dueDate = `${date.getFullYear()}-${date.getMonth() - 3 + 1}-${
      date.getDate() + 10
    }`;

    setTempField("nextInseminationDate", nextInsemination);
    setTempField("expectedDeliveryDate", dueDate);
  };

  return (
    <>
      <p className="text-[50px] text-center">소 개체 등록</p>
      <div className="text-white text-[15px] flex gap-[20px]">
        <div>
          <h3>개체 번호</h3>
          <input
            value={tempCow.number}
            className="border-[1px]"
            placeholder="1234"
            onChange={(e) => setTempField("number", e.target.value)}
          ></input>
        </div>
        <div>
          <h3>수정 일자</h3>
          <input
            value={tempCow.inseminationDate}
            onClick={() => setShowCalendar((prev) => !prev)}
            readOnly
            placeholder="YYYY-MM-DD"
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
      </div>
      <p className="text-[50px] text-center">등록 개체</p>
      <ul>
        {cowState.map((cow) => {
          return <li key={cow.number}>{cow}</li>;
        })}
      </ul>
    </>
  );
}
