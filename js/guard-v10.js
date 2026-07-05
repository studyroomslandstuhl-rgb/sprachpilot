import { requireLogin, renderAccountStrip, logout } from "/js/auth.js";
window.logout = logout;
const user = requireLogin();
const path = location.pathname;
if (user) document.addEventListener("DOMContentLoaded", () => { try { renderAccountStrip(); } catch (e) {} });
import("/js/global-sync.js?v=1").then(m => m.startGlobalSync()).then(() => { try { renderAccountStrip(); } catch (e) {} }).catch(() => {});
window.addEventListener("SP_PROFILE_SYNCED", () => { try { renderAccountStrip(); } catch (e) {} });
import("/js/progress.js?v=6").catch(() => {});
import("/js/activity-tracker.js?v=1").catch(() => {});
import("/js/scoring.js?v=4").catch(() => {});
import("/js/release-helper.js?v=10").catch(() => {});
import("/js/sp-help-flow.js?v=1").catch(() => {});
if (path.includes("/wortschatz/")) import("/js/topic-progress-sync.js?v=3").catch(() => {});
if (path.includes("/fragen-A1/") || path.includes("/fragen/")) import("/js/fragen-progress-sync.js?v=1").catch(() => {});
if (path === "/wortschatz/" || path === "/wortschatz/index.html") import("/wortschatz/index-release-lock.js?v=12").catch(() => {});
if (path.includes("/verben-A1/")) {
  import("/verben-A1/js/release-bridge.js?v=8").catch(() => {});
  import("/verben-A1/js/scoring-bridge.js?v=5").catch(() => {});
}
if (path.includes("/fragen-A1/") || path.includes("/fragen/")) import("/fragen-A1/scoring-bridge.js?v=2").catch(() => {});
