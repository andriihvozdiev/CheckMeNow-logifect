/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
var phoneNumberRegex = /[0-9]{5,}/;
var codeRegex = /[0-9]{6,6}/;
var nameRegex = /[A-Za-z][a-zA-Z]{2,20}/;
var questionAnswerRegex = /^.{3,30}$/;
const postCodeRegEx = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;

///^(([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2}$/gi;

export const isEmailValid = (email) => {
  return emailRegex.test(email);
};

export const isPasswordValid = (password) => {
  return passwordRegex.test(password);
};

export const isPhoneNumberValid = (phoneNumber) => {
  return phoneNumberRegex.test(phoneNumber);
};

export const isCodeValid = (code) => {
  return codeRegex.test(code);
};

export const isNameValid = (legalName) => {
  return nameRegex.test(legalName);
};

export const isPostCodeValid = (postCode) => {
  return postCodeRegEx.test(postCode);
};

export const isQuestionAnswerValid = (answer) => {
  return questionAnswerRegex.test(answer)
}