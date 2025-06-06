// 분만 예정일, 수정일 계산식
export const calculateDates = (inseminationDate: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");

  const formatNextDate = new Date(inseminationDate);
  formatNextDate.setMonth(formatNextDate.getMonth() + 1);
  formatNextDate.setDate(formatNextDate.getDate() + 20);

  const formatDueDate = new Date(inseminationDate);
  formatDueDate.setMonth(formatDueDate.getMonth() - 3);
  formatDueDate.setDate(formatDueDate.getDate() + 10);

  return {
    // 다음 수정일
    nextInsemination: `${formatNextDate.getFullYear()}-${pad(
      formatNextDate.getMonth() + 1
    )}-${pad(formatNextDate.getDate())}`,

    // 분만 예정일
    dueDate: `${formatDueDate.getFullYear()}-${
      formatDueDate.getMonth() + 1
    }-${formatDueDate.getDate()}`,
  };
};

// 개체 개월 수 계산식
export const ageCalculator = (birthDate: Date | string): number => {
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return years * 12 + months;
};
