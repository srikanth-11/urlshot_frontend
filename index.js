let myurl = "https://urlshortner-12.herokuapp.com";

// fetch all url details to display in table
let fetchAllUrlDetails = async () => {
  try {
    let urlDetails = await fetch(`${myurl}/url-data`);
    let urlDetailsJson = await urlDetails.json();
    return urlDetailsJson;
  } catch (err) {
    console.error(err);
  }
};

// show the loader
let showLoader = () => {
  document.getElementById('loader').style.display = 'block';
}

//hide the loader
let hideLoader = () => {
  document.getElementById('loader').style.display = 'none';
}

let displayUrlDetails = async () => {
   showLoader();
  let urlDetailsJson = await fetchAllUrlDetails();
   hideLoader();
  createDomForUrlDetails(urlDetailsJson);
};
displayUrlDetails();

// fetch the redirect url and redirect in a new tab
let redirectToOriginalUrl = async (shortUrl) => {
  let urlDetails = await fetchRedirectUrl(shortUrl);
  displayUrlDetails();
  window.open(`${urlDetails.data.url}`, "_blank");
};

// makes an api call to fetch the redirect url data
let fetchRedirectUrl = async (shortUrl) => {
  try {
    let urlData = await fetch(`${myurl}/redirect-url/${shortUrl}`);
    let urlDataJson = await urlData.json();
    return urlDataJson;
  } catch (err) {
    console.error(err);
  }
};

//creating table for the url details fetched
let createDomForUrlDetails = (urlDetailsJson) => {
  let urlDetails = urlDetailsJson.data;

  var tbody = document.getElementById("content");
  tbody.innerHTML = "";
  urlDetails.forEach((element, index) => {
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    td1.innerHTML = `${index + 1}`;
    var td2 = document.createElement("td");
    td2.innerHTML = `<a href="${element.url}" target="_blank">${element.url}</a>`;
    var td3 = document.createElement("td");
    td3.innerHTML = `${element.shortUrl}`;
    td3.classList.add("column-data", "short-url");
    td3.onclick = () => {
      redirectToOriginalUrl(element.shortUrl);
    };
    var td4 = document.createElement("td");
    td4.innerHTML = `${element.clicks}`;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tbody.appendChild(tr);
  });
};

let shortenUrl = async () => {
  try {
   
    let url = document.getElementById("shrink-text").value;
    let shortenUrl = await fetch(`${myurl}/shorten-url`, {
      // Adding method type
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify({
        url,
      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json",
      },
    });
    let shortenUrlDetails = await shortenUrl.json();
    document.getElementById("shrink-text").value = "";
    displayMsgModal(shortenUrlDetails.message);
    displayUrlDetails();
   
  } catch (err) {
    console.log(err);
  }
};

// create a modal to display appropriate msg and disappear in 4 secs
let displayMsgModal = (msg) => {
  let msgModalContainer = document.createElement("div");
  msgModalContainer.classList.add("msg-modal-container");
  msgModalContainer.id = "msg-modal-container";

  let msgModalContent = document.createElement("div");
  msgModalContent.classList.add("msg-modal-content");
  msgModalContent.innerHTML = msg;

  let modalCloseBtn = document.createElement("div");
  modalCloseBtn.classList.add("modal-close-btn");
  modalCloseBtn.innerHTML = "close";

  msgModalContent.append(modalCloseBtn);

  msgModalContainer.append(msgModalContent);
  document.body.append(msgModalContainer);

  modalCloseBtn.onclick = () => {
    msgModalContainer.style.display = "none";
  };
  setTimeout(() => {
    msgModalContainer.remove();
  }, 4000);
};

document.getElementById("shortenUrl").addEventListener("click", () => {
  console.log("clicked");
  shortenUrl();
});
