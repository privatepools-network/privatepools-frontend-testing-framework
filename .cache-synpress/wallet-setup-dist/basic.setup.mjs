/// ######## BANNER WITH FIXES START ########

// ---- DYNAMIC_REQUIRE_FS_FIX ----
var require = (await import("node:module")).createRequire(import.meta.url);
var __filename = (await import("node:url")).fileURLToPath(import.meta.url);
var __dirname = (await import("node:path")).dirname(__filename);
// ---- DYNAMIC_REQUIRE_FS_FIX ----

/// ######## BANNER WITH FIXES END ########


// test/wallet-setup/basic.setup.mjs
import { defineWalletSetup } from "@synthetixio/synpress";
import { getExtensionId, MetaMask } from "@synthetixio/synpress/playwright";
import "dotenv/config";
import { createPool, createAnvil } from "@viem/anvil";
var PRIVATE_KEY = process.env.PRIVATE_KEY;
var SEED_PHRASE = process.env.SEED_PHRASE;
var PASSWORD = "123123123";
var basic_setup_default = defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, "MetaMask");
  console.log({ extensionId });
  console.log(process.env.RANDOM_PARAMETER);
  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId);
  await metamask.importWallet(SEED_PHRASE);
  await metamask.importWalletFromPrivateKey(PRIVATE_KEY);
  await metamask.switchAccount("Account 2");
  await metamask.openSettings();
  const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus;
  await metamask.openSidebarMenu(SidebarMenus.Advanced);
  await metamask.toggleDismissSecretRecoveryPhraseReminder();
});
export {
  basic_setup_default as default
};
