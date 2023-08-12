self.addEventListener("message", (event) => {
  if (event.data.payload.action == "charge") {
    const isCharging = event.data.payload.isCharging;

    fetch("http://localhost:8000/charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isCharging: isCharging,
      }),
    })
      .then((response) => response.json())
      .then()
      .catch((e) => console.log("error", e));
  }
});
