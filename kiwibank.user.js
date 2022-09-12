// ==UserScript==
// @name         Kiwibank Accounts Refresher
// @namespace    paulwratt.kiwibank
// @version      1.0.5
// @description  auto-refresh and auto-"Still ALive" click
// @author       paul.wratt@gmail.com
// @icon         data:image/gif;base64,R0lGODlhEAAQAPMAACWHTyWFUiWHUiaIUxfkgBnigBnkgBnlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAgALAAAAAAQABAAAAQ3EMl5iLn4Tmmz34UnbuSGSUFpaoGgTtgguC+CAXNtXzP9Yj0dMFcb+lRGIa/HbE6aUCIiCp1EAAA7
// @homepage     https://paulwratt.github.io/kiwibank-pwtools/
// @include      https://www.ib.kiwibank.co.nz/accounts/
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';

  // control basic settings
  // (you can change this)
  var m=1; // number of minutes

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Utilities
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  var pwt_tornCSS = '';
  var pwt_Code = '';

  /**
   * Creates  the Torn-style background, so we know when script is running
   * @return {null}
   */

  function pw_KBaddStyles(){
    pwt_tornCSS=(<><![CDATA[
body { background: #121212 url(https://paulwratt.github.io/torn-city-pwtools/imgs/bg_regular_dark.jpg) top left repeat !important; }
]]></>).toString();

// workaround for various GreaseMonkey engines
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(pwt_tornCSS);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(pwt_tornCSS);
} else if (typeof addStyle != "undefined") {
	addStyle(pwt_tornCSS);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(pwt_tornCSS));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
  }

  /**
   * Creates  script tag with "StillAlive" finder
   * @return {null}
   */

  function pw_KBwriteStillAliveFinder() {
    pwt_Code = (<><![CDATA[

  /**
   * Creates  negates input value {v} RND(10)%3 percent of the time
   * @return {v} or {-v}
   */
  
  function pw_uAdjust(v) {
    if ( (Math.floor(Math.random() * 10)) % 3 == 0 ) {
      return (v * -1);
    } else {
      return (v);
    }
  }

  /**
   * Creates  timed lookup for "Are you still here" modal dialog
   * @return {v} or {-v}
   */
  
  function pw_KBfindStillAlive() {
    var m_id=document.getElementById('timeout_warning');
    if (m_id !== 'undefined') {
      if (m_id.style.display !== 'none') {
        m_id.getElementsByClassName('modal_button')[0].click();
      }
    }
    setTimeout('pw_KBfindStillAlive();',(3*60000)+(pw_uAdjust(Math.floor(Math.random() * 1000) + 1)));
  }


  /**
   * Creates  timed click on "Refresh" JSON button
   * @return {v} or {-v}
   */
  
  function pw_KBrefreshAccounts(m=1) {
    document.getElementById("ctl00_c_RefreshBalance").click();
    setTimeout('pw_KBrefreshAccounts('+m+');',(m*60000)+(pw_uAdjust(Math.floor(Math.random() * 1000) + 1)));
  }

]]></>).toString();
    var pwScript = document.createElement('script');
    pwScript.appendChild(document.createTextNode(pwt_Code));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(pwScript);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(pwScript);
	}

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Main
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  var currentPage = window.location.href;

  if (currentPage == 'https://www.ib.kiwibank.co.nz/accounts/') {
    m=(m<1?1:m);
    pw_KBaddStyles();
    pw_KBwriteStillAliveFinder();
    // (value)+(Math.floor(Math.random() * 1000) + 1) = randomized "click", debunks "programatic use" algorythims
    setTimeout('pw_KBfindStillAlive()',(3*60000)+(Math.floor(Math.random() * 1000) + 1));
//  setTimeout('location.reload();',(m*60000)); // dont need to "full page refresh" every time, just click() for in-page JSON instead ..
    setTimeout('pw_KBrefreshAccounts('+m+');',(m*60000)+(Math.floor(Math.random() * 1000) + 1));
//  setInterval('document.getElementById("ctl00_c_RefreshBalance").click();',(m*60000)+(Math.floor(Math.random() * 1000) + 1));
  }

})();