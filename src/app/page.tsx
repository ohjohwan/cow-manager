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
  const [searchReturn, setSearchReturn] = useState<Cow[] | null>(null);
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
    } else if (value.length > 4) {
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
    Object.values(tempCow).every((value) => value !== "" && value !== null) &&
    !error;

  const handleSearchCow = (cowNumber: string) => {
    if (cowNumber === "") {
      alert("개체 번호를 입력해 주세요.");
      return;
    }
    const result = searchCow(cowNumber);
    setSearchReturn(result ?? null);
  };

  // 개체 정보 수정 모달
  const handleEditModal = (cow?: Cow) => {
    if (cow) setSelectedCow(cow);
    setEditToggle(!editToggle);
  };

  const handleDeleteCow = (number: string) => {
    deleteCow(number);
    const result = searchCow(number);
    setSearchReturn(result ?? null);
  };

  return (
    <div className="flex flex-col gap-[30px]">
      {editToggle && selectedCow && (
        <EditModal toggle={handleEditModal} cow={selectedCow} />
      )}
      <div>
        <p className="text-[50px]">개체 등록</p>
        <div className="text-[15px] w-[500px] flex items-center gap-[20px] relative">
          <div className="bg-bg">
            <h3 className="text-fg text-[25px]">개체 번호</h3>
            <input
              pattern="^\d+$"
              value={tempCow.number}
              minLength={11}
              maxLength={11}
              className="border-[1px] h-[30px] focus:rounded-[50px] transition-all duration-500"
              placeholder="개체 번호 입력"
              onChange={(e) => handleNumberCheck(e)}
              inputMode="numeric"
            ></input>
            {error && <p>{error}</p>}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[25px]">암수 여부</h3>
            <div className="border-[1px] w-[180px] flex justify-center items-center gap-[20px] h-[30px]">
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
            className="border-[1px] w-[100px] h-[50px] absolute bottom-0 right-0"
            onClick={handleAddCow}
            disabled={!isValid}
          >
            등록하기
          </button>
        </div>
      </div>

      <div>
        <p className="text-[50px]">개체 검색</p>
        <div className="flex">
          <input
            value={searchCowNumber}
            className="border-[1px] w-[200px] h-[30px] focus:rounded-[50px] transition-all duration-500"
            onChange={(e) => setSearchCowNumber(handleFomatted(e))}
            maxLength={11}
            minLength={11}
          />
          <button
            className="block w-[40px] border-[1px]"
            onClick={() => handleSearchCow(searchCowNumber)}
          >
            검색
          </button>
        </div>
      </div>

      <div>
        <p className="text-[50px]">등록 개체</p>
        <div className="w-[500px] flex flex-col gap-[15px]">
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
      </div>

      <div>
        {searchReturn &&
          searchReturn.map((result) => (
            <div key={result.number} className="flex gap-[20px]">
              <div>{result.number}</div>
              <div className="flex gap-[10px]">
                <button
                  className="border-[1px]"
                  onClick={() => handleEditModal(result)}
                >
                  수정
                </button>
                <button
                  className="border-[1px]"
                  onClick={() => handleDeleteCow(result.number)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
