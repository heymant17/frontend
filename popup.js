const server_url = "http://localhost:8000/";
let activeTabUrl = "";

function handleFakeReviews() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    activeTabUrl = activeTab.url;

    const fakeReviewUrl = `${server_url}fake_review?url=${encodeURIComponent(
      activeTabUrl
    )}`;

    fetch(fakeReviewUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.isFake) {
          reportFakeReview(activeTabUrl, "Fake review detected");
        }
      })
      .catch((error) => console.log(error));
  });
}

function reportFakeReview(url, reason) {
  const reportUrl = `${server_url}report_fake_review`;

  const reportData = {
    url: url,
    reason: reason,
  };

  fetch(reportUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.log(error));
}

let checkbox = document.getElementById("toggleCheckBox");
let checkboxState = localStorage.getItem("checkboxState");

if (checkboxState === "checked") {
  checkbox.checked = true;
}

checkbox.addEventListener("change", function () {
  if (checkbox.checked) {
    localStorage.setItem("checkboxState", "checked");
  } else {
    localStorage.setItem("checkboxState", "unchecked");
  }
  chrome.runtime.sendMessage({ checkboxState: checkboxState });
});

handleFakeReviews();
