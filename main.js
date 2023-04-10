//DOM elements
var domRandomMessageBtn = document.querySelector(".receiveMessage");
var domGoToFavorites = document.querySelector(".viewFavoriteButton");
var domGoToHome = document.querySelector(".homeButton");
var domAffirmationCheck = document.querySelector("#affirmation");
var domMantraCheck = document.querySelector("#mantra");
var domMessageDisplay = document.querySelector(".displayMessage");
var domMeditateIcon = document.querySelector(".meditateIcon");
var domHomeView = document.querySelector(".homeView");
var domFavoritesView = document.querySelector(".favoritesView");
var domFavoriteMessageBtn = document.querySelector(".favoriteMessage");
var domGroupAffirmations = document.querySelector(".groupAffirmations");
var domGroupMantras = document.querySelector(".groupMantras");
var domFavoriteSection = document.querySelector(".favoriteSection");
var domBody = document.querySelector("body");

// variables used as data sources
var currentMessage;
var favoriteMessages = [];


// event listeners
domRandomMessageBtn.addEventListener("click", displayRandomMessage);
domGoToFavorites.addEventListener("click", showFavoritesView);
domGoToHome.addEventListener("click", showHomeView);
domFavoriteMessageBtn.addEventListener("click", addToFavorites);
domFavoriteSection.addEventListener("click", function() {
    deleteFavoriteMessage(event);
})
domFavoriteSection.addEventListener("mouseover", function() {
    enlargeFavoriteMessage(event);
})
domFavoriteSection.addEventListener("mouseout", function() {
    shrinkFavoriteMessage(event);
})
domFavoriteSection.addEventListener("mouseover", function() {
    focusDeleteButton(event);
})
domFavoriteSection.addEventListener("mouseout", function() {
    defocusDeleteButton(event);
})
domBody.addEventListener("mouseover", function() {
    colorButton(event);
})
domBody.addEventListener("mouseout", function() {
    decolorButton(event);
})
domBody.addEventListener("mousedown", function() {
    boldButton(event);
})
domBody.addEventListener("mouseup", function() {
    unboldButton(event);
})

//functions
function getRandomIndex(array) {
    return Math.floor(Math.random()*array.length);
} 

function hideDomElement(element) {
    element.classList.add("hidden");
}

function showDomElement(element) {
    element.classList.remove("hidden");
}

function addNotificationStyling() {
    domMessageDisplay.classList.add("notification");
}

function removeNotificationStyling() {
    domMessageDisplay.classList.remove("notification");
    
}

function checkMessageType() {
    var typeOfMessages;
    if (domAffirmationCheck.checked) {
        typeOfMessages = "affirmations";
    } else if (domMantraCheck.checked) {
        typeOfMessages = "mantras";
    }
    return typeOfMessages;
}

function removeMessageFromArray(array, index) {
    array.splice(index, 1);
}

function refillClonedArrays() {
    if (checkMessageType() === "affirmations") {
        clonedAffirmations = [...safeAffirmations];
    } else if (checkMessageType() === "mantras") {
        clonedMantras = [...safeMantras];
    }
}

function notifyRepeatMessages() {
    addNotificationStyling();
    if (checkMessageType() === "mantras") {
        return `You will now see repeated Mantras...`;
    } else if (checkMessageType() === "affirmations") {
        return `You will now see repeated Affirmations...`;
    }
}

function reassignCurrentMessage() {
    if (checkMessageType() === "affirmations") {
        manipulateDisplayDom(clonedAffirmations);
        fetchRelevantMessage(clonedAffirmations);
    } else if (checkMessageType() === "mantras") {
        manipulateDisplayDom(clonedMantras);
        fetchRelevantMessage(clonedMantras);
    }
}

function fetchRelevantMessage(activeArray) {
    if (activeArray.length) {
        var workingIndex = getRandomIndex(activeArray);
        currentMessage = activeArray[workingIndex];
        removeMessageFromArray(activeArray, workingIndex);
    } else {
        currentMessage = notifyRepeatMessages();
        refillClonedArrays();
    }
    return currentMessage;
}

function manipulateDisplayDom(activeArray) {
    hideDomElement(domMeditateIcon);
    showDomElement(domMessageDisplay);

    if (activeArray.length) {
        if (domMessageDisplay.classList.contains("notification")) {
            removeNotificationStyling();
            showDomElement(domFavoriteMessageBtn);
        }
    } else {
        hideDomElement(domFavoriteMessageBtn);
    }
}

function renderCurrentMessage() {
    domMessageDisplay.innerText = currentMessage;
}


function displayRandomMessage() {
    reassignCurrentMessage();
    renderCurrentMessage();
}    

function showFavoritesView() {
    hideDomElement(domHomeView);
    showDomElement(domFavoritesView);
    renderFavorites();
}

function showHomeView() {
    hideDomElement(domFavoritesView);
    showDomElement(domHomeView);
}

function checkFavoriteDuplicates(inputMessage) {
    for (var i = 0; i < favoriteMessages.length; i++) {
        if (favoriteMessages[i].message === inputMessage) {
            return true;
        }
    }
    return false;
}

function createFavoriteObject(message) {
    var messageObject = {
        message: message,
        id: Date.now(),
        messageType: checkMessageType()
    }
    return messageObject;
}

function addToFavorites() {
    if (!checkFavoriteDuplicates(currentMessage)){
        favoriteMessages.push(createFavoriteObject(currentMessage));
    }
}

function createHTML(inputMessageType) {
    var htmlCode = '';

    for(var i = 0; i < favoriteMessages.length; i++) {
        if (favoriteMessages[i].messageType === inputMessageType) {
            htmlCode += `
            <section class="singleQuote" 
            id="${favoriteMessages[i].id}">
            "${favoriteMessages[i].message}"
            <button type="button" class="deleteButton">Delete</button>
            </section> 
        `;
        }
    }
    return htmlCode;
}

function renderFavorites() {
    domGroupMantras.innerHTML = createHTML("mantras");
    domGroupAffirmations.innerHTML = createHTML("affirmations");
}

function deleteFavoriteMessage(event) {
    console.log(event.target.closest(".singleQuoteAlt"));
    if (event.target.classList.contains("deleteButtonAlt")) {
        var targetID = event.target.closest(".singleQuoteAlt").id;
        for(var i = 0; i < favoriteMessages.length; i++) {
            if (favoriteMessages[i].id.toString() === targetID) {
                favoriteMessages.splice(i,1);
            }
        }
    }
    renderFavorites();
}

function enlargeFavoriteMessage(event) {
    if (event.target.classList.contains("singleQuote")) {
        event.target.classList.add("singleQuoteAlt");
    }   
    if (event.target.classList.contains("deleteButton")) {
        event.target.closest(".singleQuote").classList.add("singleQuoteAlt");
    }
}

function shrinkFavoriteMessage(event) {
    if (event.target.classList.contains("singleQuote")) {
        event.target.classList.remove("singleQuoteAlt");
    }
    if (event.target.classList.contains("deleteButton")) {
        event.target.closest(".singleQuoteAlt").classList.remove("singleQuoteAlt");
    }
}

function focusDeleteButton(event) {
    if (event.target.classList.contains("deleteButton")) {
        event.target.classList.add("deleteButtonAlt");
    }
}

function defocusDeleteButton(event) {
    if (event.target.classList.contains("deleteButton")) {
        event.target.classList.remove("deleteButtonAlt");
    }
}

function colorButton(event) {
    if(event.target.classList.contains("button")) {
        event.target.classList.add("buttonAlt");
    }
}

function decolorButton(event) {
    if(event.target.classList.contains("buttonAlt")) {
        event.target.classList.remove("buttonAlt");
    }
}

function boldButton(event) {
    if(event.target.classList.contains("buttonAlt")) {
        event.target.classList.add("buttonBold");
    }
}

function unboldButton(event) {
    if(event.target.classList.contains("buttonBold")) {
        event.target.classList.remove("buttonBold");
    }
}