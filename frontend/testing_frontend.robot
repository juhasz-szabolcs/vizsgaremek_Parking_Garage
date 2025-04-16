*** Settings ***
Library           Selenium2Library

*** Variables ***
${URL}           ${EMPTY}
${VALID_EMAIL}   ${EMPTY}
${INVALID_EMAIL} ${EMPTY}
${PASSWORD}      ${EMPTY}

*** Test Cases ***
Login with valid credentials
    Open Browser    ${URL}    Firefox
    Wait For Condition    return document.readyState == "complete"
    Click Element    //*[@id="login-link"]
    Wait Until Location Contains    /login    timeout=10s
    Input Text    //*[@id="email"]    ${VALID_EMAIL}
    Input Text    //*[@id="password"]    ${PASSWORD}
    Click Button    //*[@id="login-button"]
    Get Selenium Implicit Wait
    Sleep    4
    Page Should Contain    juhaszszabolcs90

    # Szöveg kijelölése JavaScript segítségével
    ${selection_script}=    Catenate    SEPARATOR=\n
    ...    function selectText() {
    ...        const xpath = "/html/body/div/main/div/div[1]/p[2]";
    ...        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    ...        
    ...        if (element) {
    ...            const selection = window.getSelection();
    ...            const range = document.createRange();
    ...            range.selectNodeContents(element);
    ...            selection.removeAllRanges();
    ...            selection.addRange(range);
    ...            return true;
    ...        }
    ...        return false;
    ...    }
    ...    return selectText();
    
    Execute JavaScript    ${selection_script}
    Sleep    2s
    Close Browser


Login with invalid email
    Open Browser    ${URL}    Firefox
    Wait For Condition    return document.readyState == "complete"
    Click Element    //*[@id="login-link"]
    Wait Until Location Contains    /login    timeout=10s
    Input Text    //*[@id="email"]    ${INVALID_EMAIL}
    Input Text    //*[@id="password"]    ${PASSWORD}
    Click Button    //*[@id="login-button"]
    Get Selenium Implicit Wait
    Sleep    4
    Page Should Contain    Invalid email or password.
    Sleep    2s
    Close Browser


Show cars
    Open Browser    ${URL}    Firefox
    Wait For Condition    return document.readyState == "complete"
    Click Element    //*[@id="login-link"]
    Wait Until Location Contains    /login    timeout=10s
    Input Text    //*[@id="email"]    ${VALID_EMAIL}
    Input Text    //*[@id="password"]    ${PASSWORD}
    Click Button    //*[@id="login-button"]
    Get Selenium Implicit Wait
    Sleep    4
    Click Element   //*[@id="cars-link"]
    Sleep    3
    Click Element   //*[@id="car_3"]
    Sleep    3
    Click Element   //*[@id="spot-1"]
    Click Element   //*[@id="confirm-button"]
    Sleep 3