const server_url = "http://localhost:8000/";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "review_check",
    title: "Check Review Authenticity",
    contexts: ["selection"],
  });
  console.log("Context menu created.");
});

chrome.contextMenus.onClicked.addListener((clickData) => {
  if (clickData.menuItemId == "review_check" && clickData.selectionText) {
    let review = clickData.selectionText;
    const review_url = `${server_url}review`;

    let reviewData = {
      review: `${review}`,
    };

    fetch(review_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.prediction);

        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Review Validation",
          message: data.prediction
            ? "The review is likely fake (take it with a grain of salt)"
            : "The review is authentic",
          priority: 1,
        });
      })
      .catch((error) => console.log(error));
  }
});
