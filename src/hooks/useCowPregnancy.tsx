const cowPragnency = (aiDate) => {
  let dueDate; // 분만 예정일
  let nextEstrus; // 재발정일

  dueDate = aiDate + 20;
  nextEstrus = aiDate - 90 + 10;
};

export default cowPragnency;
