if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then(() => console.log("worker registered"))
    .catch((e) => console.log("error registering worker", e));
}

let batteryIsCharging = false;

navigator.getBattery().then((battery) => {
  batteryIsCharging = battery.charging;

  battery.addEventListener("chargingchange", () => {
    batteryIsCharging = battery.charging;

    sendEventToWorker(batteryIsCharging);
  });

  sendEventToWorker(batteryIsCharging);
});

const sendEventToWorker = (isCharging) => {
  navigator.serviceWorker.ready.then((registration) => {
    registration.active.postMessage({
      payload: {
        action: "charge",
        isCharging,
      },
    });
  });
};