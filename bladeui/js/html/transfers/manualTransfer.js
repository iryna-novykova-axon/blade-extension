/* eslint-disable max-len */

"use strict";

const headerNavbar = require("../common/headerNavbar");
const backButtonWithTitle = require("../common/backButtonWithTitle");
const input = require("../common/input");

const html = `
<div class="manual-transfers-view flex-column">
  ${headerNavbar("transfers")}
  <div class="content">
    ${backButtonWithTitle("Make a Manual Transfer")}
    <form>
      ${input({
        label: "Public Wallet Address",
        input: {
          type: "text",
          id: "wallet-address",
          iconClass: "icon icon-wallet",
          iconId: "",
          errorId: "wallet-error",
          required: true
        }
      })}
      ${input({
        label: "Confirm Public Wallet Address",
        input: {
          type: "text",
          id: "confirm-wallet-address",
          iconClass: "icon icon-wallet",
          iconId: "",
          errorId: "confirm-wallet-error",
          required: true,
          withTooltip: `You are responsible for ensuring the accuracy of your wallet address.
          There is no way to reverse a transfer to a wrong address.`
        }
      })}
      ${input({
        label: "Blade Password",
        input: {
          type: "password",
          id: "password",
          iconClass: "icon ion-md-eye-off",
          iconId: "password-eye",
          errorId: "password-error",
          required: true
        }
      })}
    </form>
  </div>
  <button class="main-action-button" id="send-button">SEND</button>
</div>
`;

module.exports = html;
