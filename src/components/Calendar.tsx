"use client";
import { useState } from "react";

export default function Calendar({
  onDateSelect,
  onDateObject,
}: {
  onDateSelect: (date: string) => void;
  onDateObject: (date: Date) => void;
}) {
  const [currentYear, setYear] = useState(new Date().getFullYear()); // 현재 연도
  const [currentMonth, setMonth] = useState(new Date().getMonth()); // 현재 월

  // 해당 월의 첫 번째 날 요일 추출
  const getFirstDayOfMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    return date.getDay();
  };

  // 해당 월의 마지막 날짜 추출
  const getLastDateOfMonth = (year: number, month: number) => {
    const date = new Date(year, month + 1, 0);
    return date.getDate();
  };

  const createCalendarDates = (year: number, month: number) => {
    const firstDay = getFirstDayOfMonth(year, month); // 당월 첫 번째 날
    const lastDate = getLastDateOfMonth(year, month); // 당월 마지막 날

    // 빈 배열 생성
    const calendarDays = Array(firstDay).fill(null);

    // 해당 월의 날짜를 추가
    for (let day = 1; day <= lastDate; day++) {
      calendarDays.push(day);
    }

    // 날짜 배열의 길이가 42가 될 때까지 null로 채움 (6주짜리 달력 생성을 위해)
    while (calendarDays.length < 42) {
      calendarDays.push(null);
    }

    return calendarDays;
  };

  const dates = createCalendarDates(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      // 1월이면 작년 12월로 변경
      setYear(currentYear - 1);
      setMonth(11);
    } else {
      setMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      // 12월이면 내년 1월로 변경
      setYear(currentYear + 1);
      setMonth(0);
    } else {
      setMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number | null) => {
    if (day === null) return;
    const formattedDate = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    const dayObject = new Date(currentYear, currentMonth, day);

    onDateObject(dayObject);
    onDateSelect(formattedDate);
  };

  return (
    <div className="w-[300px] flex flex-col items-center justify-center z-50">
      <div className="flex justify-center">
        {/* 상단 헤더 */}
        <button onClick={handlePrevMonth}>◀ 이전</button>
        <h2>
          {currentYear}년 {currentMonth + 1}월
        </h2>
        <button onClick={handleNextMonth}>다음 ▶</button>
      </div>
      <div className="w-[300px]">
        <div className="grid grid-cols-7">
          {/* 요일 헤더 */}
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} className="flex items-center justify-center">
              {day}
            </div>
          ))}

          {/* 날짜 */}
          {dates.map((date, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className="flex items-center justify-center border hover:bg-red-400"
            >
              {date !== null ? date : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
