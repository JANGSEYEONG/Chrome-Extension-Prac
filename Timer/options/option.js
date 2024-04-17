const nameInput = document.getElementById("userName");
const timeInput = document.getElementById("timer");
const saveBtn = document.getElementById("btnSave");

// storage.sync를 활용해 옵션값은 브라우저 별로 동기화 되도록 한다.

// 버튼 클릭 시 로컬에 저장
saveBtn.addEventListener("click", async () => {
  const name = nameInput.value;
  const notificationTime = timeInput.value;
  await chrome.storage.sync.set({
    name,
    notificationTime,
  });
  console.log("set options");
});

// 새로 로드될 때 기본 옵션을 세팅해준다.
const setOptions = async () => {
  const res = await chrome.storage.sync.get(["name", "notificationTime"]);
  nameInput.value = res.name ?? "Anonymous";
  timeInput.value = res.notificationTime ?? 1000; //1000초 기본값
};

setOptions();
