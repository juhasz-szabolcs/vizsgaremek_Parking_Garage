*** Settings ***
Library           RequestsLibrary
Library           Collections

*** Variables ***
${BASE_URL}       https://parkinggarageapibackend.onrender.com
${VALID_EMAIL}    juhaszszabolcs90@gmail.com
${VALID_PASSWORD}    Audi

*** Test Cases ***
Test Login Endpoint Success
    Create Session    parking_api    ${BASE_URL}    verify=${False}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${data}=    Create Dictionary    email=${VALID_EMAIL}    password=${VALID_PASSWORD}
    ${response}=    POST On Session    parking_api    /api/users/login    json=${data}    headers=${headers}
    Log    Response Status: ${response.status_code}
    Log    Response Body: ${response.text}
    Status Should Be    200    ${response}
    ${response_json}=    Set Variable    ${response.json()}
    Dictionary Should Contain Key    ${response_json}    userId
    Dictionary Should Contain Key    ${response_json}    message
    Should Be Equal    ${response_json['message']}    Login successful.
    ${user_id}=    Get From Dictionary    ${response_json}    userId
    Set Global Variable    ${USER_ID}    ${user_id}

Test Login Endpoint Invalid Credentials
    Create Session    parking_api    ${BASE_URL}    verify=${False}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${data}=    Create Dictionary    email=invalid@email.com    password=wrongpass
    ${response}=    POST On Session    parking_api    /api/users/login    json=${data}    headers=${headers}    expected_status=401
    Should Be Equal As Strings    ${response.text}    Invalid email or password.

Test Get Cars Endpoint
    [Setup]    Login And Get UserId
    Create Session    parking_api    ${BASE_URL}    verify=${False}
    ${headers}=    Create Dictionary    Authorization=Bearer ${USER_ID}
    ${response}=    GET On Session    parking_api    /api/cars    headers=${headers}
    Status Should Be    200    ${response}
    ${cars}=    Get From Dictionary    ${response.json()}    cars
    Length Should Be    ${cars}    3

*** Keywords ***
Login And Get UserId
    Create Session    parking_api    ${BASE_URL}    verify=${False}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${data}=    Create Dictionary    email=${VALID_EMAIL}    password=${VALID_PASSWORD}
    ${response}=    POST On Session    parking_api    /api/users/login    json=${data}    headers=${headers}
    ${user_id}=    Get From Dictionary    ${response.json()}    userId
    Set Global Variable    ${USER_ID}    ${user_id}
