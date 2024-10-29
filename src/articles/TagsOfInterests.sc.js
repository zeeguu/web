import styled from "styled-components";
import {
  zeeguuOrange,
  lightGrey,
  zeeguuTransparentLightOrange,
  darkGrey,
  veryDarkGrey,
  zeeguuSalmonOrange,
  veryLightGrey,
  alertGreen,
  blue200,
  blue500,
  blue800,
} from "../components/colors";

const TagsOfInterests = styled.div`
  .clickable {
    cursor: pointer;
  }
  .tagsOfInterests,
  .tagsWithFilters {
    position: absolute; 
    background: white;
    border: 0.25rem solid ${zeeguuSalmonOrange};
    box-shadow: 3px 3px 1px rgb(68 68 68 / 25%);
    margin-top: 10px;
    border-radius: 1em;
    display: flex;
    width: 40%;
    padding: 1.5rem 1rem;
    text-align: center;
    overflow: auto;
    animation: fadeIn ease 0.5s;
    @media (max-width: 768px) {
      width: 80%;
    }
  }

  .interestsSettings {
    margin-top: 3rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: -1rem;

  }

  .addInterestButton,
  .addNonInterestButton {
    box-shadow: none;
    all: unset;
    border-radius: 100%;
    font-size: 1em
    width: 1.5em;
    height: 1.5em;
    margin-top: 0.1em;
    -webkit-text-fill-color: ${zeeguuOrange};
    color: ${zeeguuOrange};
    background-color: white;
  }

  .addInterestButton:hover,
  .addNonInterestButton:hover {
    -webkit-text-fill-color: white;
    color: white;
    background-color: ${zeeguuOrange};
  }

  .closeTagsOfInterests,
  .closeTagsOfNonInterests {
    box-shadow: none;
    all: unset;
    cursor: pointer;
    border: 0.07em solid ${zeeguuOrange};
    border-radius: 1em;
    padding: 0.2em 1em;
    margin-left: 0.2rem;
    background-color: ${zeeguuOrange};
    -webkit-text-fill-color: white;
    color: white;
    font-size: 1em;
    font-family: Montserrat;
    font-weight: 300;
    text-align: center;
    min-width: 2em;
    height: 1.2em;
    margin-bottom: 0.2em;
    line-height: 0.5em;
  }

  .closeTagsOfInterests:active,
  .closeTagsOfNonInterests:active {
    border: 0.07em solid ${zeeguuOrange} !important;
  }

  .interests,
  .noninterest {
    box-shadow: none;
    all: unset;
    border-radius: 1em;
    padding: 0.5em 0.5em;
    font-size: 0.85em;
    font-family: Montserrat;
    font-weight: 400;
    text-align: center;
    min-width: 4em;
    margin-bottom: 0.2em;
    margin-top: 0.2em;
    margin-left: 0.2em;
    margin-right: 0.2em;
    float: left;
  }

  .searches {
    box-shadow: none;
    all: unset;
    cursor: pointer;
    border-radius: 1em;
    padding: 0.5em 0.5em;
    font-size: 0.85em;
    font-family: Montserrat;
    font-weight: 400;
    text-align: center;
    min-width: 4em;
    margin-bottom: 0.2em;
    margin-top: 0.2em;
    margin-left: 0.2em;
    margin-right: 0.2em;
    float: left;
    border: 1.5px solid ${blue500};
    background-color: ${blue200};
    color: ${blue800};
  }

  .interests {
    background-color: ${zeeguuOrange};
    color: white;
    -webkit-text-fill-color: white;
  }

  .interests.unsubscribed {
    background-color: white;
    color: ${zeeguuOrange};
    -webkit-text-fill-color: ${zeeguuOrange};
  }

  .noninterest {
    background-color: white;
    color: ${zeeguuOrange};
    -webkit-text-fill-color: ${zeeguuOrange};
  }

  .noninterest.subscribed {
    background-color: ${zeeguuOrange};
    color: white;
    -webkit-text-fill-color: white;
  }

  body.stop-scrolling {
    height: 100%;
    overflow: hidden;
  }

  .sweet-overlay {
    background-color: black;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: none;
    z-index: 10000;
  }

  .sweet-alert {
    background-color: white;
    font-family: Montserrat;
    width: 478px;
    padding: 17px;
    border-radius: 5px;
    text-align: center;
    position: fixed;
    margin-left: -256px;
    margin-top: -200px;
    overflow: hidden;
    display: none;
    z-index: 99999;
  }
  @media all and (max-width: 540px) {
    .sweet-alert {
      width: auto;
      margin-left: 0;
      margin-right: 0;
      left: 15px;
      right: 15px;
    }
  }
  .sweet-alert h2 {
    color: ${veryDarkGrey};
    font-size: 30px;
    text-align: center;
    font-family: Montserrat;
    font-weight: 300;
    text-transform: none;
    position: relative;

    margin: 25px 0;
    padding: 0;
    line-height: 40px;
    display: block;
  }
  .sweet-alert p {
    color: ${darkGrey};
    font-family: Montserrat;
    font-size: 16px;
    text-align: center;
    font-weight: 300;
    position: relative;
    text-align: inherit;
    float: none;
    margin: 0;
    padding: 0;
    line-height: normal;
  }
  .sweet-alert fieldset {
    border: none;
    position: relative;
  }
  .sweet-alert .sa-error-container {
    background-color: ${veryLightGrey};
    margin-left: -17px;
    margin-right: -17px;
    overflow: hidden;
    padding: 0 10px;
    max-height: 0;
    transition:
      padding 0.15s,
      max-height 0.15s;
  }
  .sweet-alert .sa-error-container.show {
    padding: 10px 0;
    max-height: 100px;
    transition:
      padding 0.25s,
      max-height 0.25s;
  }
  .sweet-alert .sa-error-container .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: white;
    line-height: 24px;
    text-align: center;
    margin-right: 3px;
  }
  .sweet-alert .sa-error-container p {
    display: inline-block;
  }
  .sweet-alert .sa-input-error {
    position: absolute;
    top: 29px;
    right: 26px;
    width: 20px;
    height: 20px;
    opacity: 0;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-transition: all 0.1s;
    transition: all 0.1s;
  }
  .sweet-alert .sa-input-error::before,
  .sweet-alert .sa-input-error::after {
    content: "";
    width: 20px;
    height: 6px;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    left: 50%;
    margin-left: -9px;
  }
  .sweet-alert .sa-input-error::before {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .sweet-alert .sa-input-error::after {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .sweet-alert .sa-input-error.show {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  .sweet-alert input {
    width: 100%;
    box-sizing: border-box;
    border-radius: 3px;
    border: 1px solid ${lightGrey};
    font-family: Montserrat;
    height: 43px;
    margin-top: 10px;
    margin-bottom: 17px;
    font-size: 18px;
    box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.06);
    padding: 0 12px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  .sweet-alert input:focus {
    outline: none;
    box-shadow: 0px 0px 3px ${zeeguuOrange};
    border: 1px solid ${zeeguuOrange};
  }
  .sweet-alert input:focus::-moz-placeholder {
    transition: opacity 0.3s 0.03s ease;
    opacity: 0.5;
  }
  .sweet-alert input:focus:-ms-input-placeholder {
    transition: opacity 0.3s 0.03s ease;
    opacity: 0.5;
  }
  .sweet-alert input:focus::-webkit-input-placeholder {
    transition: opacity 0.3s 0.03s ease;
    opacity: 0.5;
  }
  .sweet-alert input::-moz-placeholder {
    color: ${lightGrey};
  }
  .sweet-alert input::-ms-clear {
    display: none;
  }
  .sweet-alert input:-ms-input-placeholder {
    color: ${lightGrey};
  }
  .sweet-alert input::-webkit-input-placeholder {
    color: ${lightGrey};
  }
  .sweet-alert.show-input input {
    display: block;
  }
  .sweet-alert .sa-confirm-button-container {
    display: inline-block;
    position: relative;
  }
  .sweet-alert .la-ball-fall {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -27px;
    margin-top: 4px;
    opacity: 0;
    visibility: hidden;
  }
  .sweet-alert a {
    background-color: ${zeeguuOrange};
    font-family: Montserrat;
    color: white;
    width: 120px;
    border: none;
    box-shadow: none;
    font-size: 17px;
    font-weight: 500;
    -webkit-border-radius: 25px;
    border-radius: 25px;
    padding: 10px 32px;
    margin: 26px 5px 0 5px;
    cursor: pointer;
  }
  .sweet-alert button:focus {
    outline: none;
  }
  .sweet-alert button:hover {
    background-color: ${zeeguuOrange};
  }
  .sweet-alert button:active {
    background-color: ${zeeguuOrange};
  }
  .sweet-alert a.cancel {
    background-color: ${lightGrey};
  }
  .sweet-alert button.cancel:hover {
    background-color: ${lightGrey};
  }
  .sweet-alert button.cancel:active {
    background-color: ${lightGrey};
  }
  .sweet-alert button.cancel:focus {
    box-shadow:
      ${lightGrey} 0px 0px 2px,
      white 0px 0px 0px 1px inset !important;
  }
  .sweet-alert button[disabled] {
    opacity: 0.6;
    cursor: default;
  }
  .sweet-alert button.confirm[disabled] {
    color: transparent;
  }
  .sweet-alert button.confirm[disabled] ~ .la-ball-fall {
    opacity: 1;
    visibility: visible;
    transition-delay: 0s;
  }
  .sweet-alert button::-moz-focus-inner {
    border: 0;
  }
  .sweet-alert[data-has-cancel-button="false"] button {
    box-shadow: none !important;
  }
  .sweet-alert[data-has-confirm-button="false"][data-has-cancel-button="false"] {
    padding-bottom: 40px;
  }
  .sweet-alert .sa-icon {
    width: 80px;
    height: 80px;
    border: 4px solid ${darkGrey};
    -webkit-border-radius: 40px;
    border-radius: 40px;
    border-radius: 50%;
    margin: 20px auto;
    padding: 0;
    position: relative;
    box-sizing: content-box;
  }
  .sweet-alert .sa-icon.sa-error {
  }
  .sweet-alert .sa-icon.sa-error .sa-x-mark {
    position: relative;
    display: block;
  }
  .sweet-alert .sa-icon.sa-error .sa-line {
    position: absolute;
    height: 5px;
    width: 47px;
    display: block;
    top: 37px;
    border-radius: 2px;
  }
  .sweet-alert .sa-icon.sa-error .sa-line.sa-left {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    left: 17px;
  }
  .sweet-alert .sa-icon.sa-error .sa-line.sa-right {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    right: 16px;
  }
  .sweet-alert .sa-icon.sa-warning {
    border-color: ${zeeguuSalmonOrange};
  }
  .sweet-alert .sa-icon.sa-warning .sa-body {
    position: absolute;
    width: 5px;
    height: 47px;
    left: 50%;
    top: 10px;
    -webkit-border-radius: 2px;
    border-radius: 2px;
    margin-left: -2px;
    background-color: ${zeeguuSalmonOrange};
  }
  .sweet-alert .sa-icon.sa-warning .sa-dot {
    position: absolute;
    width: 7px;
    height: 7px;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    margin-left: -3px;
    left: 50%;
    bottom: 10px;
    background-color: ${zeeguuSalmonOrange};
  }
  .sweet-alert .sa-icon.sa-info {
    border-color: ${lightGrey};
  }
  .sweet-alert .sa-icon.sa-info::before {
    content: "";
    position: absolute;
    width: 5px;
    height: 29px;
    left: 50%;
    bottom: 17px;
    border-radius: 2px;
    margin-left: -2px;
    background-color: ${lightGrey};
  }
  .sweet-alert .sa-icon.sa-info::after {
    content: "";
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-left: -3px;
    top: 19px;
    background-color: ${lightGrey};
    left: 50%;
  }
  .sweet-alert .sa-icon.sa-success {
    border-color: ${alertGreen};
  }
  .sweet-alert .sa-icon.sa-success::before,
  .sweet-alert .sa-icon.sa-success::after {
    content: "";
    -webkit-border-radius: 40px;
    border-radius: 40px;
    border-radius: 50%;
    position: absolute;
    width: 60px;
    height: 120px;
    background: white;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .sweet-alert .sa-icon.sa-success::before {
    -webkit-border-radius: 120px 0 0 120px;
    border-radius: 120px 0 0 120px;
    top: -7px;
    left: -33px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transform-origin: 60px 60px;
    transform-origin: 60px 60px;
  }
  .sweet-alert .sa-icon.sa-success::after {
    -webkit-border-radius: 0 120px 120px 0;
    border-radius: 0 120px 120px 0;
    top: -11px;
    left: 30px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transform-origin: 0px 60px;
    transform-origin: 0px 60px;
  }
  .sweet-alert .sa-icon.sa-success .sa-placeholder {
    width: 80px;
    height: 80px;
    border: 4px solid ${alertGreen};
    -webkit-border-radius: 40px;
    border-radius: 40px;
    border-radius: 50%;
    box-sizing: content-box;
    position: absolute;
    left: -4px;
    top: -4px;
    z-index: 2;
  }
  .sweet-alert .sa-icon.sa-success .sa-fix {
    width: 5px;
    height: 90px;
    background-color: white;
    position: absolute;
    left: 28px;
    top: 8px;
    z-index: 1;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .sweet-alert .sa-icon.sa-success .sa-line {
    height: 5px;
    background-color: ${alertGreen};
    display: block;
    border-radius: 2px;
    position: absolute;
    z-index: 2;
  }
  .sweet-alert .sa-icon.sa-success .sa-line.sa-tip {
    width: 25px;
    left: 14px;
    top: 46px;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .sweet-alert .sa-icon.sa-success .sa-line.sa-long {
    width: 47px;
    right: 8px;
    top: 38px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .sweet-alert .sa-icon.sa-custom {
    background-size: contain;
    border-radius: 0;
    border: none;
    background-position: center center;
    background-repeat: no-repeat;
  }
`;

export { TagsOfInterests };
