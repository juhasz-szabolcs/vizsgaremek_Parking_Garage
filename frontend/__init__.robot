*** Settings ***
Library      env_library.py

*** Variables ***
${URL}           ${EMPTY}
${VALID_EMAIL}   ${EMPTY}
${INVALID_EMAIL} ${EMPTY}
${PASSWORD}      ${EMPTY}

*** Keywords ***
Get Environment Variables
    ${variables}=    Get Environment Variables
    Set Global Variable    ${URL}    ${variables}[URL]
    Set Global Variable    ${VALID_EMAIL}    ${variables}[VALID_EMAIL]
    Set Global Variable    ${INVALID_EMAIL}    ${variables}[INVALID_EMAIL]
    Set Global Variable    ${PASSWORD}    ${variables}[PASSWORD]