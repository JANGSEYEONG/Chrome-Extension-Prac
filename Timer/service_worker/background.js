// setInterval은 이벤트로 간주되지 않아, 일정시간이 지나면 서비스가 대기 상태로 빠지게 된다.
// -> 서비스가 죽지 않도록 1초마다 알람 이벤트를 발생시키고, 해당 이벤트를 리슨한다.

// 단순히 1초마다 이벤트를 발생시키기 위한 알람으로, 익명으로 설정한다.
chrome.alarms.create({
  periodInMinutes: 1 / 60, //1초마다 이벤트 발생
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  // 사용자가 설정한 타이머값을 가져와, 해당 시간이 되면 브라우저 알림을 보낸다.
  // 현재 카운트도 가져온다.

  // 현재 타이머의 실행 여부, count는 브라우저별로 동기화 될 필요 없으므로 storage.local을 사용한다.
  const resLocal = await chrome.storage.local.get(["isRunning", "count"]);
  const isRunning = resLocal.isRunning ?? false; // 기본값 타이머 실행 안함
  const count = resLocal.count ?? 0; // 최초로 실행일 경우, count는 존재하지 않아 0으로 설정한다.

  // 타이머가 중지 상태라면, 리턴시킨다.
  if (!isRunning) {
    // 팝업의 뱃지를 업데이트 해준다.
    chrome.action.setBadgeText({
      text: `${count}`,
    });

    return;
  }

  // count를 1 높여준다. (1초가 지났으므로)
  await chrome.storage.local.set({
    count: count + 1,
  });

  // 팝업의 뱃지를 업데이트 해준다.
  chrome.action.setBadgeText({
    text: `${count + 1}`,
  });

  // 옵션에서 설정한 타이머값을 가져온다
  const resSync = await chrome.storage.sync.get(["notificationTime"]);
  notificationTime = resSync.notificationTime ?? 1000; // 1000초 기본값

  // count와 notificationTime을 비교하여 notificationTime마다 브라우저 알림을 보내준다.
  if (count % Number(notificationTime) == 0) {
    const options = {
      type: "basic",
      iconUrl: "./../images/icon/icon32.png",
      title: "Extension Timer",
      message: `${notificationTime} seconds has passed!!`,
    };
    await chrome.notifications.create(options);
    console.log("send notification");

    // service worker의 this는 window가 아닌 ServiceWorkerRegistration 임!! 중요!
    // this.registration.showNotification("Extension Timer", {
    //   body: `${notificationTime} seconds has passed!!`,
    //   icon: "./../images/icon/icon32.png",
    // });
  }
});
