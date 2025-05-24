interface EditModalProps {
  toggle: () => void;
}

export default function Modal({ toggle }: EditModalProps) {
  return (
    <div className="flex justify-center items-center m-auto fixed inset-0 bg-black/50 z-50 ">
      <div className="bg-gray-500 w-[500px] h-[500px]">
        <div className="flex justify-end">
          <button className="block" onClick={toggle}>
            ❌{/* <Image src={} alt="개체 수정 창 닫기 버튼" /> */}
          </button>
        </div>
        <div>
          <h3>개체 번호</h3>
          <div></div>
        </div>
        <div>
          <h3>암 / 수</h3>
          <div></div>
        </div>
        <div>
          <h3>백신 접종 차수</h3>
          <div></div>
        </div>
        <div>
          <h3>수정일</h3>
          <div></div>
        </div>
        <div>
          <h3>분만 예정일</h3>
          <div></div>
        </div>
        <div>
          <h3>다음 수정일</h3>
          <div></div>
        </div>
      </div>
    </div>
  );
}
