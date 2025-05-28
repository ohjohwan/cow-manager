"use client";

import { useState } from "react";
import { useCowStore } from "@/store/useCattleDeliveryStore";
import { Cow } from "@/store/useCattleDeliveryStore";
import EditModal from "@/components/EditModal";

export default function Home() {
  const { tempCow, setTempField, cowState, addCow, deleteCow, searchCow } =
    useCowStore();
  const [error, setError] = useState("");
  const [searchCowNumber, setSearchCowNumber] = useState("");
  const [searchReturn, setSearchReturn] = useState<Cow | null>(null);
  const [editToggle, setEditToggle] = useState(false);
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);

  // 개체 번호 자동 포맷
  const handleFomatted = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    let autoFormatted = value;

    if (value.length > 8) {
      autoFormatted = `${value.slice(0, 4)} ${value.slice(4, 8)} ${value.slice(
        8
      )}`;
    } else if (value.length > 5) {
      autoFormatted = `${value.slice(0, 4)} ${value.slice(4, 8)}`;
    } else {
      autoFormatted = `${value.slice(0, value.length)}`;
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

  const isValid =
    Object.values(tempCow).every((value) => value !== "") && !error;

  const handleSearchCow = (cowNumber: string) => {
    const result = searchCow(cowNumber);
    setSearchReturn(result ?? null);
  };

  // 개체 정보 수정 모달
  const handleEditModal = (cow?: Cow) => {
    if (cow) setSelectedCow(cow);
    setEditToggle(!editToggle);
  };

  return (
    <>
      {editToggle && selectedCow && (
        <EditModal toggle={handleEditModal} cow={selectedCow} />
      )}
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
        <div className="flex flex-col justify-center items-center">
          <h3>암수 여부</h3>
          <div className="border-[1px] w-[180px] flex justify-center gap-[20px] h-[26px]">
            <label>
              <input
                type="radio"
                name="gender"
                checked={tempCow.gender === false}
                onChange={() => setTempField("gender", false)}
                className="border-[1px]"
              />{" "}
              암
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                checked={tempCow.gender === true}
                className="border-[1px]"
                onChange={() => setTempField("gender", true)}
              />{" "}
              수
            </label>
          </div>
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
                <button
                  className="border-[1px]"
                  onClick={() => handleEditModal(cow)}
                >
                  수정
                </button>
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
          <div className="flex gap-[20px]">
            <div>{searchReturn.number}</div>
            <div className="flex gap-[10px]">
              <button
                className="border-[1px]"
                onClick={() => selectedCow && handleEditModal(selectedCow)}
              >
                수정
              </button>
              <button
                className="border-[1px]"
                onClick={() => deleteCow(searchReturn.number)}
              >
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
