const timeElement = document.getElementById("nowTime");
const nameElement = document.getElementById("name");
const timerElement = document.getElementById("timer");

// 옵션에서 설정한 이름 세팅 함수
const setName = async () => {
  // 옵션 설정은 sync에서 가져온다.
  const resSync = await chrome.storage.sync.get(["name"]);
  nameElement.textContent = resSync.name ?? "Anonymous";
};
setName();

// 로컬로 설정한 카운트 세팅, 1초마다 바뀌어야하므로 setInterval을 사용한다.
const setCount = async () => {
  // 현재 count는 local에서 가져온다.
  const resLocal = await chrome.storage.local.get(["count"]);
  const count = resLocal.count ?? 0; // 값이 없는 경우 0으로 초기화

  timerElement.textContent = `현재 ${count}초가 지났습니다!`;

  // nowTime에는 현재 시각이 1초마다 렌더링되도록 한다.
  const currentTime = new Date().toLocaleTimeString();
  timeElement.textContent = `현재 시각: ${currentTime}`;
};

setCount(); //팝업을 열 경우 1회 최초 실행, 그 이후 1초마다 실행
setInterval(setCount, 1000);

const startBtn = document.getElementById("btnStart");
const stopBtn = document.getElementById("btnEnd");
const resetBtn = document.getElementById("btnReset");
const optionBtn = document.getElementById("btnGoOption");

const updateIsRunnig = async (isRunning) => {
  await chrome.storage.local.set({
    isRunning: !!isRunning,
  });
  console.log(`update runnig status : ${!!isRunning}`);
};

startBtn.addEventListener("click", () => {
  // 실행상태 업데이트
  updateIsRunnig(true);
});
stopBtn.addEventListener("click", () => {
  // 실행상태 업데이트
  updateIsRunnig(false);
});
resetBtn.addEventListener("click", async () => {
  // time 0으로 초기화, 타이머 멈춤
  await chrome.storage.local.set({
    count: 0,
    isRunning: false,
  });
  console.log("reset timer");
});

optionBtn.addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});
