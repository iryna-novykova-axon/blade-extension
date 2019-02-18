"use strict";

/* eslint-disable max-len, no-console */

const headerNavbar = require("./common/headerNavbar");
const settingsTabGroup = require("./common/settingsTabGroup");
const menuList = require("./common/menuList");
const infoTooltip = require("./common/informationTooltip");
const switcher = require("./common/switcher.js");
const AUTO_TRANSFER_TOOLTIP = "When your ADB reward reaches the<br>transfer threshold, <span id=\"threshold-amount\">1000 ADB</span>, it will<br>automatically transfer to a wallet<br>address of your choosing. If automatic<br>transfers are disabled, you will be<br>notified of the threshold and asked to<br>make a transfer.";

const html = `
${menuList("settings")}
<div class="transfers-view flex-column"">
  ${headerNavbar("transfers")}
  ${settingsTabGroup("transfers")}
  <div class="content">
    <div class="enable-automatic-transfers" id="enable-automatic-transfers">
      <p class="enable-automatic-transfers-text">Enable Automatic Transfers ${infoTooltip(AUTO_TRANSFER_TOOLTIP)}</p>
      ${switcher(false)}
    </div>
    <div id="wallet-action-area"></div>
    <button class="main-action-button" id="save-wallet">SAVE WALLET</button>
  </div>
</div>
`;

module.exports = html;
