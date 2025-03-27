// VARIABLE
var button = document.getElementById("uiActionButton");
var clicked = false;
var count = 6;
var outputS = "";
var currentReader = null;
var secondsLeft = 5;
var addNumber = 1;

function action(api, toMarkdown) {
    outputS = "";

    // GET VALUE
    const messageID = getValue("uiMessageID");
    const p1 = getValue("uiP1");
    const p2 = getValue("uiP2");
    const p3 = getValue("uiP3");
    const p4 = getValue("uiP4");
    const p5 = getValue("uiP5");
    const option1 = getValue("uiOption1");
    const option2 = getValue("uiOption2");
    const option3 = getValue("uiOption3");

    // RESET VALIDATION
    resetValidation("uiP1");
    resetValidation("uiP2");
    resetValidation("uiP3");
    resetValidation("uiP4");
    resetValidation("uiP5");

    if (document.getElementById("uiExecuteMaxLength") != null) {
        document.getElementById("uiExecuteMaxLength").style.display = "none";
    }
    if (document.getElementById("uiExecuteServerDown") != null) {
        document.getElementById("uiExecuteServerDown").style.display = "none";
    }

    // VALIDATION
    var isValid = true;
    if (p1 == "" && document.getElementById('uiP1Required') != null) {
        isValid = false;
        document.getElementById('uiP1Required').style.display = "inline";
    }
    if (p2 == "" && document.getElementById('uiP2Required') != null) {
        isValid = false;
        document.getElementById('uiP2Required').style.display = "inline";
    }
    if (p3 == "" && document.getElementById('uiP3Required') != null) {
        isValid = false;
        document.getElementById('uiP3Required').style.display = "inline";
    }
    if (p4 == "" && document.getElementById('uiP4Required') != null) {
        isValid = false;
        document.getElementById('uiP4Required').style.display = "inline";
    }
    if (p5 == "" && document.getElementById('uiP5Required') != null) {
        isValid = false;
        document.getElementById('uiP5Required').style.display = "inline";
    }
    if (isValid && document.getElementById('uiP1MinLength') != null && p1.length < 10) {
        isValid = false;
        document.getElementById('uiP1MinLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiP2MinLength') != null && p2.length < 10) {
        isValid = false;
        document.getElementById('uiP2MinLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiP3MinLength') != null && p3.length < 10) {
        isValid = false;
        document.getElementById('uiP3MinLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiP4MinLength') != null && p4.length < 10) {
        isValid = false;
        document.getElementById('uiP4MinLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiP5MinLength') != null && p5.length < 10) {
        isValid = false;
        document.getElementById('uiP5MinLength').style.display = "inline";
    }

    var maxLength = isAuthenticated != null && isAuthenticated == true ? 20000 : 10000;

    if (isValid && document.getElementById('uiExecuteMaxLength') != null && p1.length > maxLength) {
        isValid = false;
        document.getElementById('uiExecuteMaxLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiExecuteMaxLength') != null && p2.length > maxLength) {
        isValid = false;
        document.getElementById('uiExecuteMaxLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiExecuteMaxLength') != null && p3.length > maxLength) {
        isValid = false;
        document.getElementById('uiExecuteMaxLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiExecuteMaxLength') != null && p4.length > maxLength) {
        isValid = false;
        document.getElementById('uiExecuteMaxLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiExecuteMaxLength') != null && p5.length > maxLength) {
        isValid = false;
        document.getElementById('uiExecuteMaxLength').style.display = "inline";
    }

    if (!isValid) {
        return false;
    }

    // DISABLE the execute button
    disableExecuteButton();

    // CHECK for blocker
    var carbonText = document.getElementsByClassName("carbon-text");
    var hasBlocker = carbonText.length != 1 || !isVisible(carbonText[0]);

    // SHOW add
    // showAdd();

    // scrollToOutput();

    // SET stream value
    const url = new URL('/api/tools/' + api, window.location.origin);
    const payload = {
        id: messageID,
        p1: p1,
        p2: p2,
        p3: p3,
        p4: p4,
        p5: p5,
        option1: option1,
        option2: option2,
        option3: option3,
        hasBlocker: hasBlocker
    };

    fetchStream(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        },
        (chunk) => {
            data = chunk;

            if (data === 'zzz_completed_zzz') {
                // CLOSE the stream if completed
                // source.close();
            }
            else if (data.startsWith("zzzredirectmessageidzzz:")) {
                var messageID = data.replace("zzzredirectmessageidzzz:", "").trim();
                var currentURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.location.href = currentURL + "?id=" + messageID;
            }
            else if (data.startsWith("zzzmessageidzzz:")) {
                var messageID = data.replace("zzzmessageidzzz:", "").trim();

                // UPDATE share link
                updateShareThisUrl(messageID);
            }
            else if (data.startsWith("zzzexecutemaxlengthzzz"))
            {
                document.getElementById('uiExecuteMaxLength').style.display = "inline";
            }
            else {
                var sdata = data;

                // REPLACE newline
                sdata = sdata.replace(/zzznewlinezzz/g, "\r\n");

                // APPEND current text
                outputS += sdata;

                // CONVERT markdown to html
                var html = toMarkdown == true ? outputS : convertMarkdownToHtml(outputS);

                // ADD copy code button
                var html = addCopyCodeButton(html);

                // SET outputHTML
                document.getElementById('uiOutputHtml').innerHTML = html;

                // HIGHLIGHT code
                highlightCode();
            }
        }
    ).catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function chatAction(api) {
    outputS = "";

    // GET VALUE
    const p1 = getValue("uiP1");
    const p2 = getValue("uiP2");
    const p3 = getValue("uiP3");
    const p4 = getValue("uiP4");
    const p5 = getValue("uiP5");
    const option1 = getValue("uiOption1");
    const option2 = getValue("uiOption2");
    const option3 = getValue("uiOption3");

    // RESET VALIDATION
    resetValidation("uiP1");
    resetValidation("uiP2");
    resetValidation("uiP3");
    resetValidation("uiP4");
    resetValidation("uiP5");

    if (document.getElementById("uiExecuteServerDown") != null) {
        document.getElementById("uiExecuteServerDown").style.display = "none";
    }

    // VALIDATION
    var isValid = true;
    if (p1 == "" && document.getElementById('uiP1Required') != null) {
        isValid = false;
        document.getElementById('uiP1Required').style.display = "inline";
    }
    if (p2 == "" && document.getElementById('uiP2Required') != null) {
        isValid = false;
        document.getElementById('uiP2Required').style.display = "inline";
    }
    if (p3 == "" && document.getElementById('uiP3Required') != null) {
        isValid = false;
        document.getElementById('uiP3Required').style.display = "inline";
    }
    if (p4 == "" && document.getElementById('uiP4Required') != null) {
        isValid = false;
        document.getElementById('uiP4Required').style.display = "inline";
    }
    if (p5 == "" && document.getElementById('uiP5Required') != null) {
        isValid = false;
        document.getElementById('uiP5Required').style.display = "inline";
    }
    if (isValid && document.getElementById('uiP1MinLength') != null && p1.length < 10) {
        isValid = false;
        document.getElementById('uiP1MinLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiP2MinLength') != null && p2.length < 10) {
        isValid = false;
        document.getElementById('uiP2MinLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiP3MinLength') != null && p3.length < 10) {
        isValid = false;
        document.getElementById('uiP3MinLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiP4MinLength') != null && p4.length < 10) {
        isValid = false;
        document.getElementById('uiP4MinLength').style.display = "inline";
    }
    if (isValid && document.getElementById('uiP5MinLength') != null && p5.length < 10) {
        isValid = false;
        document.getElementById('uiP5MinLength').style.display = "inline";
    }

    if (!isValid) {
        return false;
    }

    // DISABLE the execute button
    disableExecuteButton();

    addChatUserText(p3);

    setValue("uiP3", "");

    // SET stream value
    const url = new URL('/api/tools/' + api, window.location.origin);
    const payload = {
        p1: p1,
        p2: p2,
        p3: p3,
        p4: p4,
        p5: p5,
        option1: option1,
        option2: option2,
        option3: option3
    };

    fetchStream(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        },
        (chunk) => {
            data = chunk;
            if (data === 'zzz_completed_zzz') {
                // CLOSE the stream if completed
                // source.close();
            }
            else if (data.startsWith("zzzmessageidzzz:")) {
                var messageID = data.replace("zzzmessageidzzz:", "").trim();

                // UPDATE messageID
                document.getElementById("uiP1").value = messageID;
        
                //document.getElementById("uiShareLink").innerHTML = "https://zzzcode.ai/dapper/chat?id=" + messageID;

                // ADD assitantBox
                addChatAssistantAnswerBox(messageID);

                // SCROLL to bottom
                window.scrollTo(0, document.body.scrollHeight);
            }
            else {
                var sdata = data;

                // REPLACE newline
                sdata = sdata.replace(/zzznewlinezzz/g, "\r\n");

                // APPEND current text
                outputS += sdata;

                // CONVERT markdown to html
                var html = convertMarkdownToHtml(outputS);

                // ADD copy code button
                var html = addCopyCodeButton(html);

                // SET outputHTML
                const p1 = document.getElementById('uiP1') != null && document.getElementById('uiP1').value.trim() != "" ? document.getElementById('uiP1').value : "none";
                document.getElementById(p1).innerHTML = html;

                // HIGHLIGHT code
                highlightCode();

                // SCROLL to bottom
                window.scrollTo(0, document.body.scrollHeight);
            }
        }
    ).catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function firstVote(id, value) {
    const url = new URL('/api/tools/first-vote', window.location.origin);
    const payload = {
        id: id,
        p1: value,
    };

    console.log(payload);

    fetch(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }
    ).catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function firstComment(id, value) {
    const url = new URL('/api/tools/first-comment', window.location.origin);
    const payload = {
        id: id,
        p1: value,
    };

    console.log(payload);

    fetch(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }
    ).catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

async function fetchStream(url, options, onChunk) {
    if (currentReader) {
        currentReader.cancel();
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        document.getElementById('uiExecuteServerDown').style.display = "inline";
    }
    if (!response.body) {
        throw new Error('ReadableStream not yet supported in this browser.');
    }

    const reader = response.body.getReader();
    currentReader = reader;
    const decoder = new TextDecoder('utf-8');
    let data = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            data += decoder.decode(value, { stream: true });
            let dataIndex = 0;

            while ((dataIndex = data.indexOf('\n')) !== -1) {
                const line = data.slice(0, dataIndex);
                data = data.slice(dataIndex + 1);

                const match = /^data:\s*(.*)\s*$/.exec(line);
                if (match) {
                    const chunkData = JSON.parse(match[1]);
                    onChunk(typeof chunkData === 'string' ? chunkData : JSON.stringify(chunkData));
                }
            }
        }
    } finally {
        if (currentReader === reader) {
            currentReader = null;
        }
        reader.releaseLock();
    }
}

function addChatUserText(html) {
    const parentDiv = document.getElementById("chat");

    // Create a new div element
    const newDiv = document.createElement("div");
    const newDivInner = document.createElement("div");

    // Set the text content for the new div
    newDiv.classList.add("chat-user");
    newDivInner.classList.add("container");
    newDivInner.textContent = html;

    // Append the new div to the parent div
    newDiv.appendChild(newDivInner);
    parentDiv.appendChild(newDiv);
}
function addChatAssistantAnswerBox(messageID) {
    const parentDiv = document.getElementById("chat");

    // Create a new div element
    const newDiv = document.createElement("div");
    const newDivInner = document.createElement("div");

    // Set the text content for the new div
    newDiv.classList.add("chat-chat");
    newDivInner.id = messageID;
    newDivInner.classList.add("container");
    newDivInner.textContent = "";

    // Append the new div to the parent div
    newDiv.appendChild(newDivInner);
    parentDiv.appendChild(newDiv);
}

function addCopyCodeButton(html) {
    // CREATE a copy button, message, and checkmark
    var runButton = '<button class="run-button" language="[language]">Run code</button>';
    var copyButton = '<button class="copy-button"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg> Copy code</button>';
    var copiedButton = '<button class=copied-button" style="display: none;"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!</button>';
    var preHeader = '<div class="pre-header d-flex justify-content-between"><div>language</div><div>[runcode]' + copyButton + copiedButton + '</div></div>';
    var preBody = '<div class="pre-body"><code></code></div>';
    var bgBlackContainer = '<div class="bg-black">' + preHeader + preBody + '</div>';

    // Modify the output string to include the copy container and background color for each <pre> tag
    html = html.replace(/(<pre><code\s+class=['"]([^'"]+)['"]>)([\s\S]*?)(<\/code><\/pre>)/g, function (match, p1, p2, p3, p4) {
        var languageClass = p2.split(' ')[0];
        var language = languageClass;
        var matches = p2.match(/(^|\s)class-(\S+)/);
        if (matches) {
            language = matches[2];
        }
        p3 = p3.replace(/\$/g, "$$$$"); // fix special character in replace

        var runLanguage = "";
        var runText = "";

        if (language == "language-python") {
            runLanguage = "python"
            console.log(language);
        }

        //if (language != "") {
        //    runText = runButton.replace("[language]", runLanguage);
        //}

        bgBlackContainer = bgBlackContainer.replace("[runcode]", runText);

        return '<pre>' + bgBlackContainer.replace('<div>language</div>', '<div>' + language + '</div>').replace('<code></code>', '<code class="' + p2 + '">' + p3 + '</code>') + '</pre>';
    });

    return html;
}

function convertMarkdownToHtml(markdown) {
    const md = new markdownit();
    return md.render(markdown);
}

function disableExecuteButton() {
    if (button != null && !clicked) {
        clicked = true;
        button.disabled = true;
        var intervalId = setInterval(function () {
            count--;
            button.innerText = "Wait " + count + " seconds...";
            if (count === 0) {
                clearInterval(intervalId);
                button.disabled = false;
                button.innerText = "Submit";
                count = 5;
                clicked = false;
            }
        }, 1000);
    }
}

function highlightCode() {
    hljs.highlightAll();
}

function isVisible(e) {
    return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}

function getValue(id) {
    const element = document.getElementById(id);
    const p1 = element && element.value.trim() !== "" ? element.value : "";
    return p1;
}

function setValue(id, value) {
    const element = document.getElementById(id);

    if (element != null) {
        element.value = value;
    }
}

function resetValidation(id) {
    if (document.getElementById(id + "Required") != null) {
        document.getElementById(id + "Required").style.display = "none";
    }
    if (document.getElementById(id + "MinLength") != null) {
        document.getElementById(id + "MinLength").style.display = "none";
    }
}

function scrollToOutput() {
    var element = document.getElementById("uiOutputHtml");
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function selectOption(id, value) {
    if (document.getElementById(id) != null) {
        for (i = 0; i < document.getElementById(id).length; ++i) {
            if (document.getElementById(id).options[i].value == value) {
                document.getElementById(id).value = value;
            }
        }
    }
}

function showAdd() {
    var modal = new bootstrap.Modal(document.getElementById('uiModalAdd'));

    secondsLeft = 4; 

    modal.show();
    updateAddCountdown();

    /*
    var addId = "bsa-zone_1696409680922-1_123456_" + addNumber;
    var addDivs = document.getElementsByClassName("bsa-zone_1696409680922-1_123456_AddNumber");   
    if (addDivs != null && addDivs.length == 1) {
        var addDiv = addDivs[0];
        addDiv.id = addId;

        window.optimize = window.optimize || { queue: [] };
        window.optimize.queue.push(function () {
            window.optimize.push(addId);
        });
    }
    addNumber++;
    */

    setTimeout(function () {
        modal.hide();
    }, 5000); 
}

function updateAddCountdown() {
    var countdownElement = document.getElementById('uiModelAddCountdown');
    countdownElement.textContent = secondsLeft;
    if (secondsLeft > 0) {
        secondsLeft--;
        setTimeout(updateAddCountdown, 1000);
    }
}

function showMessage(messageId) {
    document.getElementById("uiShareLink").innerHTML = shareLink + "?id=" + messageId;

    var html = document.getElementById("uiOutputContent").value;
    html = convertMarkdownToHtml(html.trim());
    html = addCopyCodeButton(html);

    document.getElementById('uiOutputHtml').innerHTML = html;
    highlightCode();
    // scrollToOutput();
}

function updateShareThisUrl(messageID) {
    const newUrl = shareLink + "?id=" + messageID
    //document.getElementById("uiShareLinkGroup").style.display = "";

    if (document.getElementById("uiShareLink") != null) {
        document.getElementById("uiShareLink").innerHTML = shareLink + "?id=" + messageID;
        const buttons = document.querySelector('.sharethis-inline-share-buttons')
        buttons.setAttribute('data-url', newUrl)
    }

    if (document.getElementById("uiShareLinkGroup") != null) {
        document.getElementById("uiShareLinkGroup").style.display = "";
    }
}

function ensureAdd() {
    setTimeout(function () {
        let e = document.getElementById("support-zzzcode")
        let t = document.getElementById("carbonads");

        if (e && t === null && document.getElementById("support-carbon") != null) {
            document.getElementById("support-carbon").style.display = "none";
            e.style.display = "";
        }
    }, 1000)
}

document.addEventListener('click', function (event) {
    // ADD a click event listener to the copy button
    if (event.target.matches('.copy-button')) {
        var copyContainer = event.target;

        // Copy the code to the clipboard
        var code = event.target.parentElement.parentElement.nextElementSibling.textContent;
        var dummy = document.createElement('textarea');
        dummy.value = code;
        document.body.appendChild(dummy);
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);

        // Show the "Copied" message and checkmark
        var copiedContainer = event.target.nextElementSibling;

        copyContainer.style.display = 'none';
        copiedContainer.style.display = 'inline-block';
        setTimeout(function () {
            copiedContainer.style.display = 'none';
            copyContainer.style.display = 'inline-block';
        }, 2000);
    }

    if (event.target.matches('.run-button')) {
        var code = event.target.parentElement.parentElement.nextElementSibling.textContent;       
        var language = event.target.getAttribute("language");

        var encodedCode = encodeURIComponent(code);
        var encodedLanguage = encodeURIComponent(language);

        var url = "/code-compiler";
        url = url + "?p1=" + encodedLanguage + "&p2=" + encodedCode;

        window.open(url, '_blank');

        console.log(code);
        console.log(language);
    }
});

ensureAdd();