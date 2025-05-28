// 분만 예정일, 수정일 계산식
export const calculateDates = (inseminationDate: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");

  const formatNextDate = new Date(inseminationDate);
  formatNextDate.setDate(formatNextDate.getDate() + 20);
  formatNextDate.setMonth(formatNextDate.getMonth() + 1);

  const formatDueDate = new Date(inseminationDate);
  formatDueDate.setDate(formatDueDate.getDate() + 10);
  formatDueDate.setDate(formatDueDate.getMonth() - 3);

  return {
    // 다음 수정일
    nextInsemination: `${formatNextDate.getFullYear()}-${pad(
      formatNextDate.getMonth()
    )}-${pad(formatNextDate.getDate())}`,

    // 분만 예정일
    dueDate: `${formatDueDate.getFullYear()}-${formatDueDate.getMonth() - 3}-${
      formatDueDate.getDate() + 10
    }`,
  };
};
