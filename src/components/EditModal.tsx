import { Cow, useCowStore } from "@/store/useCattleDeliveryStore";
import { EditableCow } from "@/store/useCattleDeliveryStore";
import { useState } from "react";

interface EditModalProps {
  toggle: () => void;
  cow: Cow;
}

export default function Modal({ toggle, cow }: EditModalProps) {
  const { editCow } = useCowStore();
  const [editData, setEditData] = useState<EditableCow>({ ...cow });

  const handleChange = (field: keyof EditableCow, value: string | boolean) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    editCow(editData);
    toggle();
  };

  return (
    <div className="flex justify-center items-center m-auto fixed inset-0 bg-black/50 z-50">
      <div className="bg-gray-500 w-[500px] h-[500px] p-[50px] relative flex flex-col gap-[40px]">
        <div className="flex justify-between ">
          <div className="flex flex-col justify-center items-center">
            <h3>개체 번호</h3>
            <div className="flex justify-center border-[1px] w-[180px] h-[26px]">
              {cow.number}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3>암수 여부</h3>
            <div className="border-[1px] w-[180px] flex justify-center gap-[20px] h-[26px]">
              <label>
                <input
                  type="radio"
                  name="gender"
                  checked={editData.gender === false}
                  onChange={() => handleChange("gender", false)}
                  className="border-[1px]"
                />
                암
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  checked={editData.gender === true}
                  onChange={() => handleChange("gender", true)}
                  className="border-[1px]"
                />
                수
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex">
            <div className="flex flex-col justify-center items-center">
              <h3 className="block">나이</h3>
              <input className="border-[1px]"></input>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3>백신 접종 여부</h3>
            <div className="flex border-[1px] w-[180px] justify-center gap-[20px]">
              <label>
                <input
                  type="radio"
                  name="vaccineCheck"
                  checked={editData.vaccineCheck === true}
                  onChange={() => handleChange("vaccineCheck", true)}
                  className="border-[1px]"
                />
                접종
              </label>
              <label>
                <input
                  type="radio"
                  name="vaccineCheck"
                  checked={editData.vaccineCheck === false}
                  onChange={() => handleChange("vaccineCheck", false)}
                  className="border-[1px]"
                />
                미접종
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-center items-center">
            <h3>백신 접종 차수</h3>
            <div className="w-[180px] border-[1px] h-[26px]"></div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3>수정일</h3>
            <div className="w-[180px] border-[1px] h-[26px]"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-center items-center">
            <h3>분만 예정일</h3>
            <div className="w-[180px] border-[1px] h-[26px]"></div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3>다음 수정일</h3>
            <div className="w-[180px] border-[1px] h-[26px]"></div>
          </div>
        </div>
        <button
          className="absolute bottom-[10px] right-[10px]"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </div>
  );
}
