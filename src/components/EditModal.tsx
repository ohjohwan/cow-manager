interface EditModalProps {
  toggle: () => void;
}

export default function Modal({ toggle }: EditModalProps) {
  return (
    <div className="flex justify-center items-center m-auto fixed inset-0 bg-black/50 z-50">
      <div className="bg-gray-500 w-[500px] h-[500px] p-[50px] relative flex flex-col gap-[40px]">
        <button className="absolute top-[10px] right-[10px]" onClick={toggle}>
          ❌
        </button>
        <div className="flex justify-between">
          <div className="flex flex-col justify-center items-center">
            <h3>개체 번호</h3>
            <input className="border-[1px] w-[180px] h-[26px]"></input>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3>암수 여부</h3>
            <div className="border-[1px] w-[180px] flex justify-center gap-[20px] h-[26px]">
              <label>
                <input type="checkbox" className="border-[1px]" />암
              </label>
              <label>
                <input type="checkbox" className="border-[1px]" />수
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h3>백신 접종 차수</h3>
          <div></div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-center items-center">
            <h3>수정일</h3>
            <div className="w-[180px] border-[1px] h-[26px]"></div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3>분만 예정일</h3>
            <div className="w-[180px] border-[1px] h-[26px]"></div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h3>다음 수정일</h3>
          <div className="w-[180px] border-[1px] h-[26px]"></div>
        </div>
      </div>
    </div>
  );
}
