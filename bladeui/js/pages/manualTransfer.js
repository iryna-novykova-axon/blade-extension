"use strict";

/* eslint-disable */

const BaseClass = require("./baseClass");
const request = require("../utils/request");
const {isAddress} = require("ethereum-address");
const {MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH,  MIN_PASSWORD_ERROR,
  MAX_PASSWORD_ERROR,VALID_WALLET_ADDRESS_LENGTH} = require("../utils/constants");
const loader = require("../html/common/loader");

class ManualTransfer extends BaseClass
{
  constructor(props)
  {
    super(props);
    this.walletAddress = "";
    this.walletConfirmAddress = "";
  }

  initListeners()
  {
    const backButton = document.getElementById("back-button");

    const passwordEye = document.getElementById("password-eye");
    this.passwordField = document.getElementById("password");
    this.passwordFieldError = document.getElementById("password-error");

    this.walletField = document.getElementById("wallet-address");
    this.walletErrorField = document.getElementById("wallet-error");

    this.walletConfirmField = document.getElementById("confirm-wallet-address");
    this.walletConfirmErrorField = document.getElementById("confirm-wallet-error");

    this.sendButton = document.getElementById("send-button");

    // browser.storage.sync.get(null, (data) =>
    // {
    //   this.bearerToken = data.bladeUserData.token;
    // });

    this.walletField.addEventListener("change", this.handleWalletInputChange.bind(this));
    this.walletField.addEventListener("focus", this.handleWalletInputFocus.bind(this));
    this.walletField.addEventListener("blur", this.handleWalletInputBlur.bind(this));

    this.walletConfirmField.addEventListener("change", this.handleConfirmWalletInputChange.bind(this));
    this.walletConfirmField.addEventListener("focus", this.handleWalletConfirmInputFocus.bind(this));
    this.walletConfirmField.addEventListener("blur", this.handleWalletInputBlur.bind(this));

    passwordEye.addEventListener("click", this.handleShowHidePassword.bind(this));
    this.passwordField.addEventListener("change", this.handlePasswordFieldChange.bind(this));

    backButton.addEventListener("click", this.handleChangeView.bind(this));

    this.sendButton.addEventListener("click", this.handleSubmitButton.bind(this));
  }

  handleChangeView()
  {
    super.handleChangeView("transfersListView")
  }

  handleWalletInputFocus(e)
  {
    e.target.value = this.walletAddress;
  }

  handleWalletConfirmInputFocus(e)
  {
    e.target.value = this.walletConfirmAddress;
  }

  handleWalletInputBlur(e)
  {
    if (e.target.value.length > VALID_WALLET_ADDRESS_LENGTH)
    {
      e.target.value = e.target.value.slice(0, VALID_WALLET_ADDRESS_LENGTH) + "...";
      console.log(e.target.value);
    }
  }

  handleWalletInputChange(e)
  {
    this.walletAddress = e.target.value;

    this.unhighlightErrors(e.target, this.walletErrorField);

    this.checkWallet(e.target, this.walletAddress, this.walletErrorField);
  }

  handleConfirmWalletInputChange(e)
  {
    this.walletConfirmAddress = e.target.value;

    this.unhighlightErrors(e.target, this.walletConfirmErrorField);

    this.checkWallet(e.target, this.walletConfirmAddress, this.walletConfirmErrorField);
  }

  checkWallet(walletField, walletAddress, walletErrorField)
  {
    if (walletAddress.length > VALID_WALLET_ADDRESS_LENGTH)
    {
      walletField.value = walletAddress.slice(0, VALID_WALLET_ADDRESS_LENGTH) + "...";
    }

    if (!isAddress(walletAddress))
    {
      this.highlightErrors(walletErrorField, walletField);
    }

    if (this.walletAddress && this.walletConfirmAddress && this.walletAddress !== this.walletConfirmAddress)
    {
      this.highlightErrors(this.walletConfirmErrorField, this.walletConfirmField, "Addresses need to match");
    }
  }

  unhighlightErrors(inputField, errorField)
  {
    this.sendButton.classList.remove("disabled");
    inputField.classList.remove("input-invalid");
    errorField.innerHTML = "";
  }

  highlightErrors(errorField, inputField, error = "Please enter a ERC20 compatible wallet")
  {
    this.sendButton.classList.add("disabled");
    if (errorField) errorField.innerHTML = error;
    if (inputField) inputField.classList.add("input-invalid");
  }

  handleShowHidePassword(e)
  {
    const icon = e.target;
    const shownIconClassname = "ion-md-eye";
    const hiddenIconClassname = "ion-md-eye-off";

    if (icon.classList.contains(hiddenIconClassname))
    {
      icon.classList.remove(hiddenIconClassname);
      icon.classList.add(shownIconClassname);
      this.passwordField.type = "text";
    }
    else
    {
      icon.classList.add(hiddenIconClassname);
      icon.classList.remove(shownIconClassname);
      this.passwordField.type = "password";
    }
  }

  handlePasswordFieldChange(e)
  {
    this.unhighlightErrors(this.passwordField, this.passwordFieldError);
    const password = e.target.value;

    if (password.length < MIN_PASSWORD_LENGTH)
    {
      this.highlightErrors(this.passwordFieldError, this.passwordField, MIN_PASSWORD_ERROR)
    }
    if (password.length > MAX_PASSWORD_LENGTH)
    {
      this.highlightErrors(this.passwordFieldError, this.passwordField, MAX_PASSWORD_ERROR)
    }
  }

  handleSubmitButton()
  {
    const data = {
      user_wallet: this.walletAddress,
      password: this.passwordField.value
    };

    if (isAddress(this.walletAddress) && isAddress(this.walletConfirmAddress) 
      && this.passwordField.value.length > MIN_PASSWORD_LENGTH &&
      this.passwordField.value.length < MAX_PASSWORD_LENGTH)
    {
      this.sendRequest(data);
      this.sendButton.innerHTML = loader(true);
    }
    else
    {
      this.highlightErrors();
    }
  }

  sendRequest(data)
  {
    request({
      method: "post",
      url: "/jwt/transfer",
      data,
      headers: {
        Authorization: `Bearer ${this.bearerToken}`
      }
    })
    .then(() => {
      this.sendButton.innerHTML = loader(true);
    })
    .catch(errorInfo => {
      console.log(errorInfo);
      this.highlightErrors(this.passwordFieldError, null, errorInfo.error);
      this.sendButton.innerHTML = "SEND";
    });
  }
}

module.exports = ManualTransfer;
