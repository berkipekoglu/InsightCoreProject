"use strict";
var InsightCore = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a2, b2) => (typeof require !== "undefined" ? require : a2)[b2]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/ua-parser-js/src/ua-parser.js
  var require_ua_parser = __commonJS({
    "node_modules/ua-parser-js/src/ua-parser.js"(exports, module2) {
      (function(window2, undefined2) {
        "use strict";
        var LIBVERSION = "1.0.41", EMPTY = "", UNKNOWN = "?", FUNC_TYPE = "function", UNDEF_TYPE = "undefined", OBJ_TYPE = "object", STR_TYPE = "string", MAJOR = "major", MODEL = "model", NAME = "name", TYPE = "type", VENDOR = "vendor", VERSION = "version", ARCHITECTURE = "architecture", CONSOLE = "console", MOBILE = "mobile", TABLET = "tablet", SMARTTV = "smarttv", WEARABLE = "wearable", EMBEDDED = "embedded", UA_MAX_LENGTH = 500;
        var AMAZON = "Amazon", APPLE = "Apple", ASUS = "ASUS", BLACKBERRY = "BlackBerry", BROWSER = "Browser", CHROME = "Chrome", EDGE = "Edge", FIREFOX = "Firefox", GOOGLE = "Google", HONOR = "Honor", HUAWEI = "Huawei", LENOVO = "Lenovo", LG = "LG", MICROSOFT = "Microsoft", MOTOROLA = "Motorola", NVIDIA = "Nvidia", ONEPLUS = "OnePlus", OPERA = "Opera", OPPO = "OPPO", SAMSUNG = "Samsung", SHARP = "Sharp", SONY = "Sony", XIAOMI = "Xiaomi", ZEBRA = "Zebra", FACEBOOK = "Facebook", CHROMIUM_OS = "Chromium OS", MAC_OS = "Mac OS", SUFFIX_BROWSER = " Browser";
        var extend = function(regexes2, extensions) {
          var mergedRegexes = {};
          for (var i2 in regexes2) {
            if (extensions[i2] && extensions[i2].length % 2 === 0) {
              mergedRegexes[i2] = extensions[i2].concat(regexes2[i2]);
            } else {
              mergedRegexes[i2] = regexes2[i2];
            }
          }
          return mergedRegexes;
        }, enumerize = function(arr) {
          var enums = {};
          for (var i2 = 0; i2 < arr.length; i2++) {
            enums[arr[i2].toUpperCase()] = arr[i2];
          }
          return enums;
        }, has = function(str1, str2) {
          return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
        }, lowerize = function(str) {
          return str.toLowerCase();
        }, majorize = function(version) {
          return typeof version === STR_TYPE ? version.replace(/[^\d\.]/g, EMPTY).split(".")[0] : undefined2;
        }, trim = function(str, len) {
          if (typeof str === STR_TYPE) {
            str = str.replace(/^\s\s*/, EMPTY);
            return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
          }
        };
        var rgxMapper = function(ua, arrays) {
          var i2 = 0, j, k, p2, q, matches, match;
          while (i2 < arrays.length && !matches) {
            var regex = arrays[i2], props = arrays[i2 + 1];
            j = k = 0;
            while (j < regex.length && !matches) {
              if (!regex[j]) {
                break;
              }
              matches = regex[j++].exec(ua);
              if (!!matches) {
                for (p2 = 0; p2 < props.length; p2++) {
                  match = matches[++k];
                  q = props[p2];
                  if (typeof q === OBJ_TYPE && q.length > 0) {
                    if (q.length === 2) {
                      if (typeof q[1] == FUNC_TYPE) {
                        this[q[0]] = q[1].call(this, match);
                      } else {
                        this[q[0]] = q[1];
                      }
                    } else if (q.length === 3) {
                      if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined2;
                      } else {
                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined2;
                      }
                    } else if (q.length === 4) {
                      this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined2;
                    }
                  } else {
                    this[q] = match ? match : undefined2;
                  }
                }
              }
            }
            i2 += 2;
          }
        }, strMapper = function(str, map) {
          for (var i2 in map) {
            if (typeof map[i2] === OBJ_TYPE && map[i2].length > 0) {
              for (var j = 0; j < map[i2].length; j++) {
                if (has(map[i2][j], str)) {
                  return i2 === UNKNOWN ? undefined2 : i2;
                }
              }
            } else if (has(map[i2], str)) {
              return i2 === UNKNOWN ? undefined2 : i2;
            }
          }
          return map.hasOwnProperty("*") ? map["*"] : str;
        };
        var oldSafariMap = {
          "1.0": "/8",
          "1.2": "/1",
          "1.3": "/3",
          "2.0": "/412",
          "2.0.2": "/416",
          "2.0.3": "/417",
          "2.0.4": "/419",
          "?": "/"
        }, windowsVersionMap = {
          "ME": "4.90",
          "NT 3.11": "NT3.51",
          "NT 4.0": "NT4.0",
          "2000": "NT 5.0",
          "XP": ["NT 5.1", "NT 5.2"],
          "Vista": "NT 6.0",
          "7": "NT 6.1",
          "8": "NT 6.2",
          "8.1": "NT 6.3",
          "10": ["NT 6.4", "NT 10.0"],
          "RT": "ARM"
        };
        var regexes = {
          browser: [
            [
              /\b(?:crmo|crios)\/([\w\.]+)/i
              // Chrome for Android/iOS
            ],
            [VERSION, [NAME, "Chrome"]],
            [
              /edg(?:e|ios|a)?\/([\w\.]+)/i
              // Microsoft Edge
            ],
            [VERSION, [NAME, "Edge"]],
            [
              // Presto based
              /(opera mini)\/([-\w\.]+)/i,
              // Opera Mini
              /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
              // Opera Mobi/Tablet
              /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
              // Opera
            ],
            [NAME, VERSION],
            [
              /opios[\/ ]+([\w\.]+)/i
              // Opera mini on iphone >= 8.0
            ],
            [VERSION, [NAME, OPERA + " Mini"]],
            [
              /\bop(?:rg)?x\/([\w\.]+)/i
              // Opera GX
            ],
            [VERSION, [NAME, OPERA + " GX"]],
            [
              /\bopr\/([\w\.]+)/i
              // Opera Webkit
            ],
            [VERSION, [NAME, OPERA]],
            [
              // Mixed
              /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
              // Baidu
            ],
            [VERSION, [NAME, "Baidu"]],
            [
              /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
              // Maxthon
            ],
            [VERSION, [NAME, "Maxthon"]],
            [
              /(kindle)\/([\w\.]+)/i,
              // Kindle
              /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,
              // Lunascape/Maxthon/Netfront/Jasmine/Blazer/Sleipnir
              // Trident based
              /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,
              // Avant/IEMobile/SlimBrowser/SlimBoat/Slimjet
              /(?:ms|\()(ie) ([\w\.]+)/i,
              // Internet Explorer
              // Blink/Webkit/KHTML based                                         // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
              /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon)\/([-\w\.]+)/i,
              // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ//Vivaldi/DuckDuckGo/Klar/Helio/Dragon
              /(heytap|ovi|115)browser\/([\d\.]+)/i,
              // HeyTap/Ovi/115
              /(weibo)__([\d\.]+)/i
              // Weibo
            ],
            [NAME, VERSION],
            [
              /quark(?:pc)?\/([-\w\.]+)/i
              // Quark
            ],
            [VERSION, [NAME, "Quark"]],
            [
              /\bddg\/([\w\.]+)/i
              // DuckDuckGo
            ],
            [VERSION, [NAME, "DuckDuckGo"]],
            [
              /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
              // UCBrowser
            ],
            [VERSION, [NAME, "UC" + BROWSER]],
            [
              /microm.+\bqbcore\/([\w\.]+)/i,
              // WeChat Desktop for Windows Built-in Browser
              /\bqbcore\/([\w\.]+).+microm/i,
              /micromessenger\/([\w\.]+)/i
              // WeChat
            ],
            [VERSION, [NAME, "WeChat"]],
            [
              /konqueror\/([\w\.]+)/i
              // Konqueror
            ],
            [VERSION, [NAME, "Konqueror"]],
            [
              /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
              // IE11
            ],
            [VERSION, [NAME, "IE"]],
            [
              /ya(?:search)?browser\/([\w\.]+)/i
              // Yandex
            ],
            [VERSION, [NAME, "Yandex"]],
            [
              /slbrowser\/([\w\.]+)/i
              // Smart Lenovo Browser
            ],
            [VERSION, [NAME, "Smart Lenovo " + BROWSER]],
            [
              /(avast|avg)\/([\w\.]+)/i
              // Avast/AVG Secure Browser
            ],
            [[NAME, /(.+)/, "$1 Secure " + BROWSER], VERSION],
            [
              /\bfocus\/([\w\.]+)/i
              // Firefox Focus
            ],
            [VERSION, [NAME, FIREFOX + " Focus"]],
            [
              /\bopt\/([\w\.]+)/i
              // Opera Touch
            ],
            [VERSION, [NAME, OPERA + " Touch"]],
            [
              /coc_coc\w+\/([\w\.]+)/i
              // Coc Coc Browser
            ],
            [VERSION, [NAME, "Coc Coc"]],
            [
              /dolfin\/([\w\.]+)/i
              // Dolphin
            ],
            [VERSION, [NAME, "Dolphin"]],
            [
              /coast\/([\w\.]+)/i
              // Opera Coast
            ],
            [VERSION, [NAME, OPERA + " Coast"]],
            [
              /miuibrowser\/([\w\.]+)/i
              // MIUI Browser
            ],
            [VERSION, [NAME, "MIUI" + SUFFIX_BROWSER]],
            [
              /fxios\/([\w\.-]+)/i
              // Firefox for iOS
            ],
            [VERSION, [NAME, FIREFOX]],
            [
              /\bqihoobrowser\/?([\w\.]*)/i
              // 360
            ],
            [VERSION, [NAME, "360"]],
            [
              /\b(qq)\/([\w\.]+)/i
              // QQ
            ],
            [[NAME, /(.+)/, "$1Browser"], VERSION],
            [
              /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
            ],
            [[NAME, /(.+)/, "$1" + SUFFIX_BROWSER], VERSION],
            [
              // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
              /samsungbrowser\/([\w\.]+)/i
              // Samsung Internet
            ],
            [VERSION, [NAME, SAMSUNG + " Internet"]],
            [
              /metasr[\/ ]?([\d\.]+)/i
              // Sogou Explorer
            ],
            [VERSION, [NAME, "Sogou Explorer"]],
            [
              /(sogou)mo\w+\/([\d\.]+)/i
              // Sogou Mobile
            ],
            [[NAME, "Sogou Mobile"], VERSION],
            [
              /(electron)\/([\w\.]+) safari/i,
              // Electron-based App
              /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
              // Tesla
              /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
              // QQ/2345
            ],
            [NAME, VERSION],
            [
              /(lbbrowser|rekonq)/i,
              // LieBao Browser/Rekonq
              /\[(linkedin)app\]/i
              // LinkedIn App for iOS & Android
            ],
            [NAME],
            [
              /ome\/([\w\.]+) \w* ?(iron) saf/i,
              // Iron
              /ome\/([\w\.]+).+qihu (360)[es]e/i
              // 360
            ],
            [VERSION, NAME],
            [
              // WebView
              /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
              // Facebook App for iOS & Android
            ],
            [[NAME, FACEBOOK], VERSION],
            [
              /(Klarna)\/([\w\.]+)/i,
              // Klarna Shopping Browser for iOS & Android
              /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
              // Kakao App
              /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
              // Naver InApp
              /(daum)apps[\/ ]([\w\.]+)/i,
              // Daum App
              /safari (line)\/([\w\.]+)/i,
              // Line App for iOS
              /\b(line)\/([\w\.]+)\/iab/i,
              // Line App for Android
              /(alipay)client\/([\w\.]+)/i,
              // Alipay
              /(twitter)(?:and| f.+e\/([\w\.]+))/i,
              // Twitter
              /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i
              // Chromium/Instagram/Snapchat
            ],
            [NAME, VERSION],
            [
              /\bgsa\/([\w\.]+) .*safari\//i
              // Google Search Appliance on iOS
            ],
            [VERSION, [NAME, "GSA"]],
            [
              /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
              // TikTok
            ],
            [VERSION, [NAME, "TikTok"]],
            [
              /headlesschrome(?:\/([\w\.]+)| )/i
              // Chrome Headless
            ],
            [VERSION, [NAME, CHROME + " Headless"]],
            [
              / wv\).+(chrome)\/([\w\.]+)/i
              // Chrome WebView
            ],
            [[NAME, CHROME + " WebView"], VERSION],
            [
              /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
              // Android Browser
            ],
            [VERSION, [NAME, "Android " + BROWSER]],
            [
              /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
              // Chrome/OmniWeb/Arora/Tizen/Nokia
            ],
            [NAME, VERSION],
            [
              /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i
              // Mobile Safari
            ],
            [VERSION, [NAME, "Mobile Safari"]],
            [
              /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i
              // Safari & Safari Mobile
            ],
            [VERSION, NAME],
            [
              /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
              // Safari < 3.0
            ],
            [NAME, [VERSION, strMapper, oldSafariMap]],
            [
              /(webkit|khtml)\/([\w\.]+)/i
            ],
            [NAME, VERSION],
            [
              // Gecko based
              /(navigator|netscape\d?)\/([-\w\.]+)/i
              // Netscape
            ],
            [[NAME, "Netscape"], VERSION],
            [
              /(wolvic|librewolf)\/([\w\.]+)/i
              // Wolvic/LibreWolf
            ],
            [NAME, VERSION],
            [
              /mobile vr; rv:([\w\.]+)\).+firefox/i
              // Firefox Reality
            ],
            [VERSION, [NAME, FIREFOX + " Reality"]],
            [
              /ekiohf.+(flow)\/([\w\.]+)/i,
              // Flow
              /(swiftfox)/i,
              // Swiftfox
              /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
              // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
              /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
              // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
              /(firefox)\/([\w\.]+)/i,
              // Other Firefox-based
              /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
              // Mozilla
              // Other
              /(amaya|dillo|doris|icab|ladybird|lynx|mosaic|netsurf|obigo|polaris|w3m|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
              // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Obigo/Mosaic/Go/ICE/UP.Browser/Ladybird
              /\b(links) \(([\w\.]+)/i
              // Links
            ],
            [NAME, [VERSION, /_/g, "."]],
            [
              /(cobalt)\/([\w\.]+)/i
              // Cobalt
            ],
            [NAME, [VERSION, /master.|lts./, ""]]
          ],
          cpu: [
            [
              /\b((amd|x|x86[-_]?|wow|win)64)\b/i
              // AMD64 (x64)
            ],
            [[ARCHITECTURE, "amd64"]],
            [
              /(ia32(?=;))/i,
              // IA32 (quicktime)
              /\b((i[346]|x)86)(pc)?\b/i
              // IA32 (x86)
            ],
            [[ARCHITECTURE, "ia32"]],
            [
              /\b(aarch64|arm(v?[89]e?l?|_?64))\b/i
              // ARM64
            ],
            [[ARCHITECTURE, "arm64"]],
            [
              /\b(arm(v[67])?ht?n?[fl]p?)\b/i
              // ARMHF
            ],
            [[ARCHITECTURE, "armhf"]],
            [
              // PocketPC mistakenly identified as PowerPC
              /( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i
            ],
            [[ARCHITECTURE, "arm"]],
            [
              /((ppc|powerpc)(64)?)( mac|;|\))/i
              // PowerPC
            ],
            [[ARCHITECTURE, /ower/, EMPTY, lowerize]],
            [
              / sun4\w[;\)]/i
              // SPARC
            ],
            [[ARCHITECTURE, "sparc"]],
            [
              /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
              // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ],
            [[ARCHITECTURE, lowerize]]
          ],
          device: [
            [
              //////////////////////////
              // MOBILES & TABLETS
              /////////////////////////
              // Samsung
              /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
            ],
            [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]],
            [
              /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
              /samsung[- ]((?!sm-[lr])[-\w]+)/i,
              /sec-(sgh\w+)/i
            ],
            [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]],
            [
              // Apple
              /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
              // iPod/iPhone
            ],
            [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]],
            [
              /\((ipad);[-\w\),; ]+apple/i,
              // iPad
              /applecoremedia\/[\w\.]+ \((ipad)/i,
              /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ],
            [MODEL, [VENDOR, APPLE], [TYPE, TABLET]],
            [
              /(macintosh);/i
            ],
            [MODEL, [VENDOR, APPLE]],
            [
              // Sharp
              /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
            ],
            [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]],
            [
              // Honor
              /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
            ],
            [MODEL, [VENDOR, HONOR], [TYPE, TABLET]],
            [
              /honor([-\w ]+)[;\)]/i
            ],
            [MODEL, [VENDOR, HONOR], [TYPE, MOBILE]],
            [
              // Huawei
              /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
            ],
            [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]],
            [
              /(?:huawei)([-\w ]+)[;\)]/i,
              /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
            ],
            [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]],
            [
              // Xiaomi
              /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
              /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
              // Mi Pad tablets
            ],
            [[MODEL, /_/g, " "], [VENDOR, XIAOMI], [TYPE, TABLET]],
            [
              /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
              // Xiaomi POCO
              /\b; (\w+) build\/hm\1/i,
              // Xiaomi Hongmi 'numeric' models
              /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
              // Xiaomi Hongmi
              /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
              // Xiaomi Redmi
              /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,
              // Xiaomi Redmi 'numeric' models
              /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i,
              // Xiaomi Mi
              / ([\w ]+) miui\/v?\d/i
            ],
            [[MODEL, /_/g, " "], [VENDOR, XIAOMI], [TYPE, MOBILE]],
            [
              // OPPO
              /; (\w+) bui.+ oppo/i,
              /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ],
            [MODEL, [VENDOR, OPPO], [TYPE, MOBILE]],
            [
              /\b(opd2(\d{3}a?))(?: bui|\))/i
            ],
            [MODEL, [VENDOR, strMapper, { "OnePlus": ["304", "403", "203"], "*": OPPO }], [TYPE, TABLET]],
            [
              // Vivo
              /vivo (\w+)(?: bui|\))/i,
              /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
            ],
            [MODEL, [VENDOR, "Vivo"], [TYPE, MOBILE]],
            [
              // Realme
              /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
            ],
            [MODEL, [VENDOR, "Realme"], [TYPE, MOBILE]],
            [
              // Motorola
              /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
              /\bmot(?:orola)?[- ](\w*)/i,
              /((?:moto(?! 360)[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ],
            [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]],
            [
              /\b(mz60\d|xoom[2 ]{0,2}) build\//i
            ],
            [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]],
            [
              // LG
              /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
            ],
            [MODEL, [VENDOR, LG], [TYPE, TABLET]],
            [
              /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
              /\blg[-e;\/ ]+((?!browser|netcast|android tv|watch)\w+)/i,
              /\blg-?([\d\w]+) bui/i
            ],
            [MODEL, [VENDOR, LG], [TYPE, MOBILE]],
            [
              // Lenovo
              /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
              /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
            ],
            [MODEL, [VENDOR, LENOVO], [TYPE, TABLET]],
            [
              // Nokia
              /(nokia) (t[12][01])/i
            ],
            [VENDOR, MODEL, [TYPE, TABLET]],
            [
              /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
              /nokia[-_ ]?(([-\w\. ]*))/i
            ],
            [[MODEL, /_/g, " "], [TYPE, MOBILE], [VENDOR, "Nokia"]],
            [
              // Google
              /(pixel (c|tablet))\b/i
              // Google Pixel C/Tablet
            ],
            [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]],
            [
              /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
              // Google Pixel
            ],
            [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]],
            [
              // Sony
              /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ],
            [MODEL, [VENDOR, SONY], [TYPE, MOBILE]],
            [
              /sony tablet [ps]/i,
              /\b(?:sony)?sgp\w+(?: bui|\))/i
            ],
            [[MODEL, "Xperia Tablet"], [VENDOR, SONY], [TYPE, TABLET]],
            [
              // OnePlus
              / (kb2005|in20[12]5|be20[12][59])\b/i,
              /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
            ],
            [MODEL, [VENDOR, ONEPLUS], [TYPE, MOBILE]],
            [
              // Amazon
              /(alexa)webm/i,
              /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
              // Kindle Fire without Silk / Echo Show
              /(kf[a-z]+)( bui|\)).+silk\//i
              // Kindle Fire HD
            ],
            [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]],
            [
              /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
              // Fire Phone
            ],
            [[MODEL, /(.+)/g, "Fire Phone $1"], [VENDOR, AMAZON], [TYPE, MOBILE]],
            [
              // BlackBerry
              /(playbook);[-\w\),; ]+(rim)/i
              // BlackBerry PlayBook
            ],
            [MODEL, VENDOR, [TYPE, TABLET]],
            [
              /\b((?:bb[a-f]|st[hv])100-\d)/i,
              /\(bb10; (\w+)/i
              // BlackBerry 10
            ],
            [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]],
            [
              // Asus
              /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
            ],
            [MODEL, [VENDOR, ASUS], [TYPE, TABLET]],
            [
              / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
            ],
            [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]],
            [
              // HTC
              /(nexus 9)/i
              // HTC Nexus 9
            ],
            [MODEL, [VENDOR, "HTC"], [TYPE, TABLET]],
            [
              /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
              // HTC
              // ZTE
              /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
              /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
              // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ],
            [VENDOR, [MODEL, /_/g, " "], [TYPE, MOBILE]],
            [
              // TCL
              /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])\w*(\)| bui)/i
            ],
            [MODEL, [VENDOR, "TCL"], [TYPE, TABLET]],
            [
              // itel
              /(itel) ((\w+))/i
            ],
            [[VENDOR, lowerize], MODEL, [TYPE, strMapper, { "tablet": ["p10001l", "w7001"], "*": "mobile" }]],
            [
              // Acer
              /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
            ],
            [MODEL, [VENDOR, "Acer"], [TYPE, TABLET]],
            [
              // Meizu
              /droid.+; (m[1-5] note) bui/i,
              /\bmz-([-\w]{2,})/i
            ],
            [MODEL, [VENDOR, "Meizu"], [TYPE, MOBILE]],
            [
              // Ulefone
              /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
            ],
            [MODEL, [VENDOR, "Ulefone"], [TYPE, MOBILE]],
            [
              // Energizer
              /; (energy ?\w+)(?: bui|\))/i,
              /; energizer ([\w ]+)(?: bui|\))/i
            ],
            [MODEL, [VENDOR, "Energizer"], [TYPE, MOBILE]],
            [
              // Cat
              /; cat (b35);/i,
              /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
            ],
            [MODEL, [VENDOR, "Cat"], [TYPE, MOBILE]],
            [
              // Smartfren
              /((?:new )?andromax[\w- ]+)(?: bui|\))/i
            ],
            [MODEL, [VENDOR, "Smartfren"], [TYPE, MOBILE]],
            [
              // Nothing
              /droid.+; (a(?:015|06[35]|142p?))/i
            ],
            [MODEL, [VENDOR, "Nothing"], [TYPE, MOBILE]],
            [
              // Archos
              /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
              /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i
            ],
            [MODEL, [VENDOR, "Archos"], [TYPE, TABLET]],
            [
              /archos ([\w ]+)( b|\))/i,
              /; (ac[3-6]\d\w{2,8})( b|\))/i
            ],
            [MODEL, [VENDOR, "Archos"], [TYPE, MOBILE]],
            [
              // MIXED
              /(imo) (tab \w+)/i,
              // IMO
              /(infinix) (x1101b?)/i
              // Infinix XPad
            ],
            [VENDOR, MODEL, [TYPE, TABLET]],
            [
              /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus(?! zenw)|dell|jolla|meizu|motorola|polytron|infinix|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
              // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron/Infinix/Tecno/Micromax/Advan
              /; (hmd|imo) ([\w ]+?)(?: bui|\))/i,
              // HMD/IMO
              /(hp) ([\w ]+\w)/i,
              // HP iPAQ
              /(microsoft); (lumia[\w ]+)/i,
              // Microsoft Lumia
              /(lenovo)[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i,
              // Lenovo
              /(oppo) ?([\w ]+) bui/i
              // OPPO
            ],
            [VENDOR, MODEL, [TYPE, MOBILE]],
            [
              /(kobo)\s(ereader|touch)/i,
              // Kobo
              /(hp).+(touchpad(?!.+tablet)|tablet)/i,
              // HP TouchPad
              /(kindle)\/([\w\.]+)/i,
              // Kindle
              /(nook)[\w ]+build\/(\w+)/i,
              // Nook
              /(dell) (strea[kpr\d ]*[\dko])/i,
              // Dell Streak
              /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
              // Le Pan Tablets
              /(trinity)[- ]*(t\d{3}) bui/i,
              // Trinity Tablets
              /(gigaset)[- ]+(q\w{1,9}) bui/i,
              // Gigaset Tablets
              /(vodafone) ([\w ]+)(?:\)| bui)/i
              // Vodafone
            ],
            [VENDOR, MODEL, [TYPE, TABLET]],
            [
              /(surface duo)/i
              // Surface Duo
            ],
            [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]],
            [
              /droid [\d\.]+; (fp\du?)(?: b|\))/i
              // Fairphone
            ],
            [MODEL, [VENDOR, "Fairphone"], [TYPE, MOBILE]],
            [
              /(u304aa)/i
              // AT&T
            ],
            [MODEL, [VENDOR, "AT&T"], [TYPE, MOBILE]],
            [
              /\bsie-(\w*)/i
              // Siemens
            ],
            [MODEL, [VENDOR, "Siemens"], [TYPE, MOBILE]],
            [
              /\b(rct\w+) b/i
              // RCA Tablets
            ],
            [MODEL, [VENDOR, "RCA"], [TYPE, TABLET]],
            [
              /\b(venue[\d ]{2,7}) b/i
              // Dell Venue Tablets
            ],
            [MODEL, [VENDOR, "Dell"], [TYPE, TABLET]],
            [
              /\b(q(?:mv|ta)\w+) b/i
              // Verizon Tablet
            ],
            [MODEL, [VENDOR, "Verizon"], [TYPE, TABLET]],
            [
              /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
              // Barnes & Noble Tablet
            ],
            [MODEL, [VENDOR, "Barnes & Noble"], [TYPE, TABLET]],
            [
              /\b(tm\d{3}\w+) b/i
            ],
            [MODEL, [VENDOR, "NuVision"], [TYPE, TABLET]],
            [
              /\b(k88) b/i
              // ZTE K Series Tablet
            ],
            [MODEL, [VENDOR, "ZTE"], [TYPE, TABLET]],
            [
              /\b(nx\d{3}j) b/i
              // ZTE Nubia
            ],
            [MODEL, [VENDOR, "ZTE"], [TYPE, MOBILE]],
            [
              /\b(gen\d{3}) b.+49h/i
              // Swiss GEN Mobile
            ],
            [MODEL, [VENDOR, "Swiss"], [TYPE, MOBILE]],
            [
              /\b(zur\d{3}) b/i
              // Swiss ZUR Tablet
            ],
            [MODEL, [VENDOR, "Swiss"], [TYPE, TABLET]],
            [
              /\b((zeki)?tb.*\b) b/i
              // Zeki Tablets
            ],
            [MODEL, [VENDOR, "Zeki"], [TYPE, TABLET]],
            [
              /\b([yr]\d{2}) b/i,
              /\b(dragon[- ]+touch |dt)(\w{5}) b/i
              // Dragon Touch Tablet
            ],
            [[VENDOR, "Dragon Touch"], MODEL, [TYPE, TABLET]],
            [
              /\b(ns-?\w{0,9}) b/i
              // Insignia Tablets
            ],
            [MODEL, [VENDOR, "Insignia"], [TYPE, TABLET]],
            [
              /\b((nxa|next)-?\w{0,9}) b/i
              // NextBook Tablets
            ],
            [MODEL, [VENDOR, "NextBook"], [TYPE, TABLET]],
            [
              /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
              // Voice Xtreme Phones
            ],
            [[VENDOR, "Voice"], MODEL, [TYPE, MOBILE]],
            [
              /\b(lvtel\-)?(v1[12]) b/i
              // LvTel Phones
            ],
            [[VENDOR, "LvTel"], MODEL, [TYPE, MOBILE]],
            [
              /\b(ph-1) /i
              // Essential PH-1
            ],
            [MODEL, [VENDOR, "Essential"], [TYPE, MOBILE]],
            [
              /\b(v(100md|700na|7011|917g).*\b) b/i
              // Envizen Tablets
            ],
            [MODEL, [VENDOR, "Envizen"], [TYPE, TABLET]],
            [
              /\b(trio[-\w\. ]+) b/i
              // MachSpeed Tablets
            ],
            [MODEL, [VENDOR, "MachSpeed"], [TYPE, TABLET]],
            [
              /\btu_(1491) b/i
              // Rotor Tablets
            ],
            [MODEL, [VENDOR, "Rotor"], [TYPE, TABLET]],
            [
              /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
              // Nvidia Tablets
            ],
            [MODEL, [VENDOR, NVIDIA], [TYPE, TABLET]],
            [
              /(sprint) (\w+)/i
              // Sprint Phones
            ],
            [VENDOR, MODEL, [TYPE, MOBILE]],
            [
              /(kin\.[onetw]{3})/i
              // Microsoft Kin
            ],
            [[MODEL, /\./g, " "], [VENDOR, MICROSOFT], [TYPE, MOBILE]],
            [
              /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
              // Zebra
            ],
            [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]],
            [
              /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
            ],
            [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]],
            [
              ///////////////////
              // SMARTTVS
              ///////////////////
              /smart-tv.+(samsung)/i
              // Samsung
            ],
            [VENDOR, [TYPE, SMARTTV]],
            [
              /hbbtv.+maple;(\d+)/i
            ],
            [[MODEL, /^/, "SmartTV"], [VENDOR, SAMSUNG], [TYPE, SMARTTV]],
            [
              /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
              // LG SmartTV
            ],
            [[VENDOR, LG], [TYPE, SMARTTV]],
            [
              /(apple) ?tv/i
              // Apple TV
            ],
            [VENDOR, [MODEL, APPLE + " TV"], [TYPE, SMARTTV]],
            [
              /crkey/i
              // Google Chromecast
            ],
            [[MODEL, CHROME + "cast"], [VENDOR, GOOGLE], [TYPE, SMARTTV]],
            [
              /droid.+aft(\w+)( bui|\))/i
              // Fire TV
            ],
            [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]],
            [
              /(shield \w+ tv)/i
              // Nvidia Shield TV
            ],
            [MODEL, [VENDOR, NVIDIA], [TYPE, SMARTTV]],
            [
              /\(dtv[\);].+(aquos)/i,
              /(aquos-tv[\w ]+)\)/i
              // Sharp
            ],
            [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],
            [
              /(bravia[\w ]+)( bui|\))/i
              // Sony
            ],
            [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]],
            [
              /(mi(tv|box)-?\w+) bui/i
              // Xiaomi
            ],
            [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]],
            [
              /Hbbtv.*(technisat) (.*);/i
              // TechniSAT
            ],
            [VENDOR, MODEL, [TYPE, SMARTTV]],
            [
              /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
              // Roku
              /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
              // HbbTV devices
            ],
            [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]],
            [
              // SmartTV from Unidentified Vendors
              /droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i
            ],
            [MODEL, [TYPE, SMARTTV]],
            [
              /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
            ],
            [[TYPE, SMARTTV]],
            [
              ///////////////////
              // CONSOLES
              ///////////////////
              /(ouya)/i,
              // Ouya
              /(nintendo) ([wids3utch]+)/i
              // Nintendo
            ],
            [VENDOR, MODEL, [TYPE, CONSOLE]],
            [
              /droid.+; (shield)( bui|\))/i
              // Nvidia Portable
            ],
            [MODEL, [VENDOR, NVIDIA], [TYPE, CONSOLE]],
            [
              /(playstation \w+)/i
              // Playstation
            ],
            [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]],
            [
              /\b(xbox(?: one)?(?!; xbox))[\); ]/i
              // Microsoft Xbox
            ],
            [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]],
            [
              ///////////////////
              // WEARABLES
              ///////////////////
              /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
              // Samsung Galaxy Watch
            ],
            [MODEL, [VENDOR, SAMSUNG], [TYPE, WEARABLE]],
            [
              /((pebble))app/i,
              // Pebble
              /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
              // Asus ZenWatch / LG Watch / Pixel Watch
            ],
            [VENDOR, MODEL, [TYPE, WEARABLE]],
            [
              /(ow(?:19|20)?we?[1-3]{1,3})/i
              // Oppo Watch
            ],
            [MODEL, [VENDOR, OPPO], [TYPE, WEARABLE]],
            [
              /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
              // Apple Watch
            ],
            [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]],
            [
              /(opwwe\d{3})/i
              // OnePlus Watch
            ],
            [MODEL, [VENDOR, ONEPLUS], [TYPE, WEARABLE]],
            [
              /(moto 360)/i
              // Motorola 360
            ],
            [MODEL, [VENDOR, MOTOROLA], [TYPE, WEARABLE]],
            [
              /(smartwatch 3)/i
              // Sony SmartWatch
            ],
            [MODEL, [VENDOR, SONY], [TYPE, WEARABLE]],
            [
              /(g watch r)/i
              // LG G Watch R
            ],
            [MODEL, [VENDOR, LG], [TYPE, WEARABLE]],
            [
              /droid.+; (wt63?0{2,3})\)/i
            ],
            [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]],
            [
              ///////////////////
              // XR
              ///////////////////
              /droid.+; (glass) \d/i
              // Google Glass
            ],
            [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]],
            [
              /(pico) (4|neo3(?: link|pro)?)/i
              // Pico
            ],
            [VENDOR, MODEL, [TYPE, WEARABLE]],
            [
              /; (quest( \d| pro)?)/i
              // Oculus Quest
            ],
            [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]],
            [
              ///////////////////
              // EMBEDDED
              ///////////////////
              /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
              // Tesla
            ],
            [VENDOR, [TYPE, EMBEDDED]],
            [
              /(aeobc)\b/i
              // Echo Dot
            ],
            [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]],
            [
              /(homepod).+mac os/i
              // Apple HomePod
            ],
            [MODEL, [VENDOR, APPLE], [TYPE, EMBEDDED]],
            [
              /windows iot/i
            ],
            [[TYPE, EMBEDDED]],
            [
              ////////////////////
              // MIXED (GENERIC)
              ///////////////////
              /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i
              // Android Phones from Unidentified Vendors
            ],
            [MODEL, [TYPE, MOBILE]],
            [
              /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
              // Android Tablets from Unidentified Vendors
            ],
            [MODEL, [TYPE, TABLET]],
            [
              /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
              // Unidentifiable Tablet
            ],
            [[TYPE, TABLET]],
            [
              /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
              // Unidentifiable Mobile
            ],
            [[TYPE, MOBILE]],
            [
              /droid .+?; ([\w\. -]+)( bui|\))/i
              // Generic Android Device
            ],
            [MODEL, [VENDOR, "Generic"]]
          ],
          engine: [
            [
              /windows.+ edge\/([\w\.]+)/i
              // EdgeHTML
            ],
            [VERSION, [NAME, EDGE + "HTML"]],
            [
              /(arkweb)\/([\w\.]+)/i
              // ArkWeb
            ],
            [NAME, VERSION],
            [
              /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
              // Blink
            ],
            [VERSION, [NAME, "Blink"]],
            [
              /(presto)\/([\w\.]+)/i,
              // Presto
              /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i,
              // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna/Servo
              /ekioh(flow)\/([\w\.]+)/i,
              // Flow
              /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
              // KHTML/Tasman/Links
              /(icab)[\/ ]([23]\.[\d\.]+)/i,
              // iCab
              /\b(libweb)/i
              // LibWeb
            ],
            [NAME, VERSION],
            [
              /ladybird\//i
            ],
            [[NAME, "LibWeb"]],
            [
              /rv\:([\w\.]{1,9})\b.+(gecko)/i
              // Gecko
            ],
            [VERSION, NAME]
          ],
          os: [
            [
              // Windows
              /microsoft (windows) (vista|xp)/i
              // Windows (iTunes)
            ],
            [NAME, VERSION],
            [
              /(windows (?:phone(?: os)?|mobile|iot))[\/ ]?([\d\.\w ]*)/i
              // Windows Phone
            ],
            [NAME, [VERSION, strMapper, windowsVersionMap]],
            [
              /windows nt 6\.2; (arm)/i,
              // Windows RT
              /windows[\/ ]([ntce\d\. ]+\w)(?!.+xbox)/i,
              /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ],
            [[VERSION, strMapper, windowsVersionMap], [NAME, "Windows"]],
            [
              // iOS/macOS
              /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
              // iOS
              /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
              /cfnetwork\/.+darwin/i
            ],
            [[VERSION, /_/g, "."], [NAME, "iOS"]],
            [
              /(mac os x) ?([\w\. ]*)/i,
              /(macintosh|mac_powerpc\b)(?!.+haiku)/i
              // Mac OS
            ],
            [[NAME, MAC_OS], [VERSION, /_/g, "."]],
            [
              // Mobile OSes
              /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i
              // Android-x86/HarmonyOS
            ],
            [VERSION, NAME],
            [
              /(ubuntu) ([\w\.]+) like android/i
              // Ubuntu Touch
            ],
            [[NAME, /(.+)/, "$1 Touch"], VERSION],
            [
              // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
              /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen|webos)\w*[-\/; ]?([\d\.]*)/i
            ],
            [NAME, VERSION],
            [
              /\(bb(10);/i
              // BlackBerry 10
            ],
            [VERSION, [NAME, BLACKBERRY]],
            [
              /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
              // Symbian
            ],
            [VERSION, [NAME, "Symbian"]],
            [
              /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
              // Firefox OS
            ],
            [VERSION, [NAME, FIREFOX + " OS"]],
            [
              /web0s;.+rt(tv)/i,
              /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
              // WebOS
            ],
            [VERSION, [NAME, "webOS"]],
            [
              /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
              // watchOS
            ],
            [VERSION, [NAME, "watchOS"]],
            [
              // Google Chromecast
              /crkey\/([\d\.]+)/i
              // Google Chromecast
            ],
            [VERSION, [NAME, CHROME + "cast"]],
            [
              /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
              // Chromium OS
            ],
            [[NAME, CHROMIUM_OS], VERSION],
            [
              // Smart TVs
              /panasonic;(viera)/i,
              // Panasonic Viera
              /(netrange)mmh/i,
              // Netrange
              /(nettv)\/(\d+\.[\w\.]+)/i,
              // NetTV
              // Console
              /(nintendo|playstation) ([wids345portablevuch]+)/i,
              // Nintendo/Playstation
              /(xbox); +xbox ([^\);]+)/i,
              // Microsoft Xbox (360, One, X, S, Series X, Series S)
              // Other
              /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
              // Joli/Palm
              /(mint)[\/\(\) ]?(\w*)/i,
              // Mint
              /(mageia|vectorlinux)[; ]/i,
              // Mageia/VectorLinux
              /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
              // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
              /(hurd|linux)(?: arm\w*| x86\w*| ?)([\w\.]*)/i,
              // Hurd/Linux
              /(gnu) ?([\w\.]*)/i,
              // GNU
              /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
              // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
              /(haiku) (\w+)/i
              // Haiku
            ],
            [NAME, VERSION],
            [
              /(sunos) ?([\w\.\d]*)/i
              // Solaris
            ],
            [[NAME, "Solaris"], VERSION],
            [
              /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
              // Solaris
              /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
              // AIX
              /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
              // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
              /(unix) ?([\w\.]*)/i
              // UNIX
            ],
            [NAME, VERSION]
          ]
        };
        var UAParser2 = function(ua, extensions) {
          if (typeof ua === OBJ_TYPE) {
            extensions = ua;
            ua = undefined2;
          }
          if (!(this instanceof UAParser2)) {
            return new UAParser2(ua, extensions).getResult();
          }
          var _navigator = typeof window2 !== UNDEF_TYPE && window2.navigator ? window2.navigator : undefined2;
          var _ua = ua || (_navigator && _navigator.userAgent ? _navigator.userAgent : EMPTY);
          var _uach = _navigator && _navigator.userAgentData ? _navigator.userAgentData : undefined2;
          var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
          var _isSelfNav = _navigator && _navigator.userAgent == _ua;
          this.getBrowser = function() {
            var _browser = {};
            _browser[NAME] = undefined2;
            _browser[VERSION] = undefined2;
            rgxMapper.call(_browser, _ua, _rgxmap.browser);
            _browser[MAJOR] = majorize(_browser[VERSION]);
            if (_isSelfNav && _navigator && _navigator.brave && typeof _navigator.brave.isBrave == FUNC_TYPE) {
              _browser[NAME] = "Brave";
            }
            return _browser;
          };
          this.getCPU = function() {
            var _cpu = {};
            _cpu[ARCHITECTURE] = undefined2;
            rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
            return _cpu;
          };
          this.getDevice = function() {
            var _device = {};
            _device[VENDOR] = undefined2;
            _device[MODEL] = undefined2;
            _device[TYPE] = undefined2;
            rgxMapper.call(_device, _ua, _rgxmap.device);
            if (_isSelfNav && !_device[TYPE] && _uach && _uach.mobile) {
              _device[TYPE] = MOBILE;
            }
            if (_isSelfNav && _device[MODEL] == "Macintosh" && _navigator && typeof _navigator.standalone !== UNDEF_TYPE && _navigator.maxTouchPoints && _navigator.maxTouchPoints > 2) {
              _device[MODEL] = "iPad";
              _device[TYPE] = TABLET;
            }
            return _device;
          };
          this.getEngine = function() {
            var _engine = {};
            _engine[NAME] = undefined2;
            _engine[VERSION] = undefined2;
            rgxMapper.call(_engine, _ua, _rgxmap.engine);
            return _engine;
          };
          this.getOS = function() {
            var _os = {};
            _os[NAME] = undefined2;
            _os[VERSION] = undefined2;
            rgxMapper.call(_os, _ua, _rgxmap.os);
            if (_isSelfNav && !_os[NAME] && _uach && _uach.platform && _uach.platform != "Unknown") {
              _os[NAME] = _uach.platform.replace(/chrome os/i, CHROMIUM_OS).replace(/macos/i, MAC_OS);
            }
            return _os;
          };
          this.getResult = function() {
            return {
              ua: this.getUA(),
              browser: this.getBrowser(),
              engine: this.getEngine(),
              os: this.getOS(),
              device: this.getDevice(),
              cpu: this.getCPU()
            };
          };
          this.getUA = function() {
            return _ua;
          };
          this.setUA = function(ua2) {
            _ua = typeof ua2 === STR_TYPE && ua2.length > UA_MAX_LENGTH ? trim(ua2, UA_MAX_LENGTH) : ua2;
            return this;
          };
          this.setUA(_ua);
          return this;
        };
        UAParser2.VERSION = LIBVERSION;
        UAParser2.BROWSER = enumerize([NAME, VERSION, MAJOR]);
        UAParser2.CPU = enumerize([ARCHITECTURE]);
        UAParser2.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
        UAParser2.ENGINE = UAParser2.OS = enumerize([NAME, VERSION]);
        if (typeof exports !== UNDEF_TYPE) {
          if (typeof module2 !== UNDEF_TYPE && module2.exports) {
            exports = module2.exports = UAParser2;
          }
          exports.UAParser = UAParser2;
        } else {
          if (typeof define === FUNC_TYPE && define.amd) {
            define(function() {
              return UAParser2;
            });
          } else if (typeof window2 !== UNDEF_TYPE) {
            window2.UAParser = UAParser2;
          }
        }
        var $2 = typeof window2 !== UNDEF_TYPE && (window2.jQuery || window2.Zepto);
        if ($2 && !$2.ua) {
          var parser = new UAParser2();
          $2.ua = parser.getResult();
          $2.ua.get = function() {
            return parser.getUA();
          };
          $2.ua.set = function(ua) {
            parser.setUA(ua);
            var result = parser.getResult();
            for (var prop in result) {
              $2.ua[prop] = result[prop];
            }
          };
        }
      })(typeof window === "object" ? window : exports);
    }
  });

  // node_modules/rrweb/es/rrweb/packages/rrweb-snapshot/es/rrweb-snapshot.js
  var NodeType;
  (function(NodeType2) {
    NodeType2[NodeType2["Document"] = 0] = "Document";
    NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
    NodeType2[NodeType2["Element"] = 2] = "Element";
    NodeType2[NodeType2["Text"] = 3] = "Text";
    NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
    NodeType2[NodeType2["Comment"] = 5] = "Comment";
  })(NodeType || (NodeType = {}));
  function isElement(n2) {
    return n2.nodeType === n2.ELEMENT_NODE;
  }
  function isShadowRoot(n2) {
    var host = n2 === null || n2 === void 0 ? void 0 : n2.host;
    return Boolean((host === null || host === void 0 ? void 0 : host.shadowRoot) === n2);
  }
  function isNativeShadowDom(shadowRoot) {
    return Object.prototype.toString.call(shadowRoot) === "[object ShadowRoot]";
  }
  function fixBrowserCompatibilityIssuesInCSS(cssText) {
    if (cssText.includes(" background-clip: text;") && !cssText.includes(" -webkit-background-clip: text;")) {
      cssText = cssText.replace(" background-clip: text;", " -webkit-background-clip: text; background-clip: text;");
    }
    return cssText;
  }
  function getCssRulesString(s2) {
    try {
      var rules = s2.rules || s2.cssRules;
      return rules ? fixBrowserCompatibilityIssuesInCSS(Array.from(rules).map(getCssRuleString).join("")) : null;
    } catch (error) {
      return null;
    }
  }
  function getCssRuleString(rule) {
    var cssStringified = rule.cssText;
    if (isCSSImportRule(rule)) {
      try {
        cssStringified = getCssRulesString(rule.styleSheet) || cssStringified;
      } catch (_a) {
      }
    }
    return cssStringified;
  }
  function isCSSImportRule(rule) {
    return "styleSheet" in rule;
  }
  var Mirror = function() {
    function Mirror2() {
      this.idNodeMap = /* @__PURE__ */ new Map();
      this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
    }
    Mirror2.prototype.getId = function(n2) {
      var _a;
      if (!n2)
        return -1;
      var id = (_a = this.getMeta(n2)) === null || _a === void 0 ? void 0 : _a.id;
      return id !== null && id !== void 0 ? id : -1;
    };
    Mirror2.prototype.getNode = function(id) {
      return this.idNodeMap.get(id) || null;
    };
    Mirror2.prototype.getIds = function() {
      return Array.from(this.idNodeMap.keys());
    };
    Mirror2.prototype.getMeta = function(n2) {
      return this.nodeMetaMap.get(n2) || null;
    };
    Mirror2.prototype.removeNodeFromMap = function(n2) {
      var _this = this;
      var id = this.getId(n2);
      this.idNodeMap["delete"](id);
      if (n2.childNodes) {
        n2.childNodes.forEach(function(childNode) {
          return _this.removeNodeFromMap(childNode);
        });
      }
    };
    Mirror2.prototype.has = function(id) {
      return this.idNodeMap.has(id);
    };
    Mirror2.prototype.hasNode = function(node) {
      return this.nodeMetaMap.has(node);
    };
    Mirror2.prototype.add = function(n2, meta) {
      var id = meta.id;
      this.idNodeMap.set(id, n2);
      this.nodeMetaMap.set(n2, meta);
    };
    Mirror2.prototype.replace = function(id, n2) {
      var oldNode = this.getNode(id);
      if (oldNode) {
        var meta = this.nodeMetaMap.get(oldNode);
        if (meta)
          this.nodeMetaMap.set(n2, meta);
      }
      this.idNodeMap.set(id, n2);
    };
    Mirror2.prototype.reset = function() {
      this.idNodeMap = /* @__PURE__ */ new Map();
      this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
    };
    return Mirror2;
  }();
  function createMirror() {
    return new Mirror();
  }
  function maskInputValue(_a) {
    var maskInputOptions = _a.maskInputOptions, tagName = _a.tagName, type = _a.type, value = _a.value, maskInputFn = _a.maskInputFn;
    var text = value || "";
    if (maskInputOptions[tagName.toLowerCase()] || maskInputOptions[type]) {
      if (maskInputFn) {
        text = maskInputFn(text);
      } else {
        text = "*".repeat(text.length);
      }
    }
    return text;
  }
  var ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
  function is2DCanvasBlank(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx)
      return true;
    var chunkSize = 50;
    for (var x = 0; x < canvas.width; x += chunkSize) {
      for (var y2 = 0; y2 < canvas.height; y2 += chunkSize) {
        var getImageData = ctx.getImageData;
        var originalGetImageData = ORIGINAL_ATTRIBUTE_NAME in getImageData ? getImageData[ORIGINAL_ATTRIBUTE_NAME] : getImageData;
        var pixelBuffer = new Uint32Array(originalGetImageData.call(ctx, x, y2, Math.min(chunkSize, canvas.width - x), Math.min(chunkSize, canvas.height - y2)).data.buffer);
        if (pixelBuffer.some(function(pixel) {
          return pixel !== 0;
        }))
          return false;
      }
    }
    return true;
  }
  var _id = 1;
  var tagNameRegex = new RegExp("[^a-z0-9-_:]");
  var IGNORED_NODE = -2;
  function genId() {
    return _id++;
  }
  function getValidTagName(element) {
    if (element instanceof HTMLFormElement) {
      return "form";
    }
    var processedTagName = element.tagName.toLowerCase().trim();
    if (tagNameRegex.test(processedTagName)) {
      return "div";
    }
    return processedTagName;
  }
  function stringifyStyleSheet(sheet) {
    return sheet.cssRules ? Array.from(sheet.cssRules).map(function(rule) {
      return rule.cssText || "";
    }).join("") : "";
  }
  function extractOrigin(url) {
    var origin = "";
    if (url.indexOf("//") > -1) {
      origin = url.split("/").slice(0, 3).join("/");
    } else {
      origin = url.split("/")[0];
    }
    origin = origin.split("?")[0];
    return origin;
  }
  var canvasService;
  var canvasCtx;
  var URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm;
  var RELATIVE_PATH = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/|#).*/;
  var DATA_URI = /^(data:)([^,]*),(.*)/i;
  function absoluteToStylesheet(cssText, href) {
    return (cssText || "").replace(URL_IN_CSS_REF, function(origin, quote1, path1, quote2, path2, path3) {
      var filePath = path1 || path2 || path3;
      var maybeQuote = quote1 || quote2 || "";
      if (!filePath) {
        return origin;
      }
      if (!RELATIVE_PATH.test(filePath)) {
        return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
      }
      if (DATA_URI.test(filePath)) {
        return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
      }
      if (filePath[0] === "/") {
        return "url(".concat(maybeQuote).concat(extractOrigin(href) + filePath).concat(maybeQuote, ")");
      }
      var stack = href.split("/");
      var parts = filePath.split("/");
      stack.pop();
      for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        if (part === ".") {
          continue;
        } else if (part === "..") {
          stack.pop();
        } else {
          stack.push(part);
        }
      }
      return "url(".concat(maybeQuote).concat(stack.join("/")).concat(maybeQuote, ")");
    });
  }
  var SRCSET_NOT_SPACES = /^[^ \t\n\r\u000c]+/;
  var SRCSET_COMMAS_OR_SPACES = /^[, \t\n\r\u000c]+/;
  function getAbsoluteSrcsetString(doc, attributeValue) {
    if (attributeValue.trim() === "") {
      return attributeValue;
    }
    var pos = 0;
    function collectCharacters(regEx) {
      var chars2;
      var match = regEx.exec(attributeValue.substring(pos));
      if (match) {
        chars2 = match[0];
        pos += chars2.length;
        return chars2;
      }
      return "";
    }
    var output = [];
    while (true) {
      collectCharacters(SRCSET_COMMAS_OR_SPACES);
      if (pos >= attributeValue.length) {
        break;
      }
      var url = collectCharacters(SRCSET_NOT_SPACES);
      if (url.slice(-1) === ",") {
        url = absoluteToDoc(doc, url.substring(0, url.length - 1));
        output.push(url);
      } else {
        var descriptorsStr = "";
        url = absoluteToDoc(doc, url);
        var inParens = false;
        while (true) {
          var c2 = attributeValue.charAt(pos);
          if (c2 === "") {
            output.push((url + descriptorsStr).trim());
            break;
          } else if (!inParens) {
            if (c2 === ",") {
              pos += 1;
              output.push((url + descriptorsStr).trim());
              break;
            } else if (c2 === "(") {
              inParens = true;
            }
          } else {
            if (c2 === ")") {
              inParens = false;
            }
          }
          descriptorsStr += c2;
          pos += 1;
        }
      }
    }
    return output.join(", ");
  }
  function absoluteToDoc(doc, attributeValue) {
    if (!attributeValue || attributeValue.trim() === "") {
      return attributeValue;
    }
    var a2 = doc.createElement("a");
    a2.href = attributeValue;
    return a2.href;
  }
  function isSVGElement(el) {
    return Boolean(el.tagName === "svg" || el.ownerSVGElement);
  }
  function getHref() {
    var a2 = document.createElement("a");
    a2.href = "";
    return a2.href;
  }
  function transformAttribute(doc, tagName, name, value) {
    if (name === "src" || name === "href" && value && !(tagName === "use" && value[0] === "#")) {
      return absoluteToDoc(doc, value);
    } else if (name === "xlink:href" && value && value[0] !== "#") {
      return absoluteToDoc(doc, value);
    } else if (name === "background" && value && (tagName === "table" || tagName === "td" || tagName === "th")) {
      return absoluteToDoc(doc, value);
    } else if (name === "srcset" && value) {
      return getAbsoluteSrcsetString(doc, value);
    } else if (name === "style" && value) {
      return absoluteToStylesheet(value, getHref());
    } else if (tagName === "object" && name === "data" && value) {
      return absoluteToDoc(doc, value);
    } else {
      return value;
    }
  }
  function _isBlockedElement(element, blockClass, blockSelector) {
    if (typeof blockClass === "string") {
      if (element.classList.contains(blockClass)) {
        return true;
      }
    } else {
      for (var eIndex = element.classList.length; eIndex--; ) {
        var className = element.classList[eIndex];
        if (blockClass.test(className)) {
          return true;
        }
      }
    }
    if (blockSelector) {
      return element.matches(blockSelector);
    }
    return false;
  }
  function classMatchesRegex(node, regex, checkAncestors) {
    if (!node)
      return false;
    if (node.nodeType !== node.ELEMENT_NODE) {
      if (!checkAncestors)
        return false;
      return classMatchesRegex(node.parentNode, regex, checkAncestors);
    }
    for (var eIndex = node.classList.length; eIndex--; ) {
      var className = node.classList[eIndex];
      if (regex.test(className)) {
        return true;
      }
    }
    if (!checkAncestors)
      return false;
    return classMatchesRegex(node.parentNode, regex, checkAncestors);
  }
  function needMaskingText(node, maskTextClass, maskTextSelector) {
    var el = node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
    if (el === null)
      return false;
    if (typeof maskTextClass === "string") {
      if (el.classList.contains(maskTextClass))
        return true;
      if (el.closest(".".concat(maskTextClass)))
        return true;
    } else {
      if (classMatchesRegex(el, maskTextClass, true))
        return true;
    }
    if (maskTextSelector) {
      if (el.matches(maskTextSelector))
        return true;
      if (el.closest(maskTextSelector))
        return true;
    }
    return false;
  }
  function onceIframeLoaded(iframeEl, listener, iframeLoadTimeout) {
    var win = iframeEl.contentWindow;
    if (!win) {
      return;
    }
    var fired = false;
    var readyState;
    try {
      readyState = win.document.readyState;
    } catch (error) {
      return;
    }
    if (readyState !== "complete") {
      var timer_1 = setTimeout(function() {
        if (!fired) {
          listener();
          fired = true;
        }
      }, iframeLoadTimeout);
      iframeEl.addEventListener("load", function() {
        clearTimeout(timer_1);
        fired = true;
        listener();
      });
      return;
    }
    var blankUrl = "about:blank";
    if (win.location.href !== blankUrl || iframeEl.src === blankUrl || iframeEl.src === "") {
      setTimeout(listener, 0);
      return iframeEl.addEventListener("load", listener);
    }
    iframeEl.addEventListener("load", listener);
  }
  function onceStylesheetLoaded(link, listener, styleSheetLoadTimeout) {
    var fired = false;
    var styleSheetLoaded;
    try {
      styleSheetLoaded = link.sheet;
    } catch (error) {
      return;
    }
    if (styleSheetLoaded)
      return;
    var timer = setTimeout(function() {
      if (!fired) {
        listener();
        fired = true;
      }
    }, styleSheetLoadTimeout);
    link.addEventListener("load", function() {
      clearTimeout(timer);
      fired = true;
      listener();
    });
  }
  function serializeNode(n2, options) {
    var doc = options.doc, mirror2 = options.mirror, blockClass = options.blockClass, blockSelector = options.blockSelector, maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, inlineStylesheet = options.inlineStylesheet, _a = options.maskInputOptions, maskInputOptions = _a === void 0 ? {} : _a, maskTextFn = options.maskTextFn, maskInputFn = options.maskInputFn, _b = options.dataURLOptions, dataURLOptions = _b === void 0 ? {} : _b, inlineImages = options.inlineImages, recordCanvas = options.recordCanvas, keepIframeSrcFn = options.keepIframeSrcFn, _c = options.newlyAddedElement, newlyAddedElement = _c === void 0 ? false : _c;
    var rootId = getRootId(doc, mirror2);
    switch (n2.nodeType) {
      case n2.DOCUMENT_NODE:
        if (n2.compatMode !== "CSS1Compat") {
          return {
            type: NodeType.Document,
            childNodes: [],
            compatMode: n2.compatMode
          };
        } else {
          return {
            type: NodeType.Document,
            childNodes: []
          };
        }
      case n2.DOCUMENT_TYPE_NODE:
        return {
          type: NodeType.DocumentType,
          name: n2.name,
          publicId: n2.publicId,
          systemId: n2.systemId,
          rootId
        };
      case n2.ELEMENT_NODE:
        return serializeElementNode(n2, {
          doc,
          blockClass,
          blockSelector,
          inlineStylesheet,
          maskInputOptions,
          maskInputFn,
          dataURLOptions,
          inlineImages,
          recordCanvas,
          keepIframeSrcFn,
          newlyAddedElement,
          rootId
        });
      case n2.TEXT_NODE:
        return serializeTextNode(n2, {
          maskTextClass,
          maskTextSelector,
          maskTextFn,
          rootId
        });
      case n2.CDATA_SECTION_NODE:
        return {
          type: NodeType.CDATA,
          textContent: "",
          rootId
        };
      case n2.COMMENT_NODE:
        return {
          type: NodeType.Comment,
          textContent: n2.textContent || "",
          rootId
        };
      default:
        return false;
    }
  }
  function getRootId(doc, mirror2) {
    if (!mirror2.hasNode(doc))
      return void 0;
    var docId = mirror2.getId(doc);
    return docId === 1 ? void 0 : docId;
  }
  function serializeTextNode(n2, options) {
    var _a;
    var maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, maskTextFn = options.maskTextFn, rootId = options.rootId;
    var parentTagName = n2.parentNode && n2.parentNode.tagName;
    var textContent = n2.textContent;
    var isStyle = parentTagName === "STYLE" ? true : void 0;
    var isScript = parentTagName === "SCRIPT" ? true : void 0;
    if (isStyle && textContent) {
      try {
        if (n2.nextSibling || n2.previousSibling) {
        } else if ((_a = n2.parentNode.sheet) === null || _a === void 0 ? void 0 : _a.cssRules) {
          textContent = stringifyStyleSheet(n2.parentNode.sheet);
        }
      } catch (err) {
        console.warn("Cannot get CSS styles from text's parentNode. Error: ".concat(err), n2);
      }
      textContent = absoluteToStylesheet(textContent, getHref());
    }
    if (isScript) {
      textContent = "SCRIPT_PLACEHOLDER";
    }
    if (!isStyle && !isScript && textContent && needMaskingText(n2, maskTextClass, maskTextSelector)) {
      textContent = maskTextFn ? maskTextFn(textContent) : textContent.replace(/[\S]/g, "*");
    }
    return {
      type: NodeType.Text,
      textContent: textContent || "",
      isStyle,
      rootId
    };
  }
  function serializeElementNode(n2, options) {
    var doc = options.doc, blockClass = options.blockClass, blockSelector = options.blockSelector, inlineStylesheet = options.inlineStylesheet, _a = options.maskInputOptions, maskInputOptions = _a === void 0 ? {} : _a, maskInputFn = options.maskInputFn, _b = options.dataURLOptions, dataURLOptions = _b === void 0 ? {} : _b, inlineImages = options.inlineImages, recordCanvas = options.recordCanvas, keepIframeSrcFn = options.keepIframeSrcFn, _c = options.newlyAddedElement, newlyAddedElement = _c === void 0 ? false : _c, rootId = options.rootId;
    var needBlock = _isBlockedElement(n2, blockClass, blockSelector);
    var tagName = getValidTagName(n2);
    var attributes = {};
    var len = n2.attributes.length;
    for (var i2 = 0; i2 < len; i2++) {
      var attr = n2.attributes[i2];
      attributes[attr.name] = transformAttribute(doc, tagName, attr.name, attr.value);
    }
    if (tagName === "link" && inlineStylesheet) {
      var stylesheet = Array.from(doc.styleSheets).find(function(s2) {
        return s2.href === n2.href;
      });
      var cssText = null;
      if (stylesheet) {
        cssText = getCssRulesString(stylesheet);
      }
      if (cssText) {
        delete attributes.rel;
        delete attributes.href;
        attributes._cssText = absoluteToStylesheet(cssText, stylesheet.href);
      }
    }
    if (tagName === "style" && n2.sheet && !(n2.innerText || n2.textContent || "").trim().length) {
      var cssText = getCssRulesString(n2.sheet);
      if (cssText) {
        attributes._cssText = absoluteToStylesheet(cssText, getHref());
      }
    }
    if (tagName === "input" || tagName === "textarea" || tagName === "select") {
      var value = n2.value;
      var checked = n2.checked;
      if (attributes.type !== "radio" && attributes.type !== "checkbox" && attributes.type !== "submit" && attributes.type !== "button" && value) {
        attributes.value = maskInputValue({
          type: attributes.type,
          tagName,
          value,
          maskInputOptions,
          maskInputFn
        });
      } else if (checked) {
        attributes.checked = checked;
      }
    }
    if (tagName === "option") {
      if (n2.selected && !maskInputOptions["select"]) {
        attributes.selected = true;
      } else {
        delete attributes.selected;
      }
    }
    if (tagName === "canvas" && recordCanvas) {
      if (n2.__context === "2d") {
        if (!is2DCanvasBlank(n2)) {
          attributes.rr_dataURL = n2.toDataURL(dataURLOptions.type, dataURLOptions.quality);
        }
      } else if (!("__context" in n2)) {
        var canvasDataURL = n2.toDataURL(dataURLOptions.type, dataURLOptions.quality);
        var blankCanvas = document.createElement("canvas");
        blankCanvas.width = n2.width;
        blankCanvas.height = n2.height;
        var blankCanvasDataURL = blankCanvas.toDataURL(dataURLOptions.type, dataURLOptions.quality);
        if (canvasDataURL !== blankCanvasDataURL) {
          attributes.rr_dataURL = canvasDataURL;
        }
      }
    }
    if (tagName === "img" && inlineImages) {
      if (!canvasService) {
        canvasService = doc.createElement("canvas");
        canvasCtx = canvasService.getContext("2d");
      }
      var image_1 = n2;
      var oldValue_1 = image_1.crossOrigin;
      image_1.crossOrigin = "anonymous";
      var recordInlineImage = function() {
        try {
          canvasService.width = image_1.naturalWidth;
          canvasService.height = image_1.naturalHeight;
          canvasCtx.drawImage(image_1, 0, 0);
          attributes.rr_dataURL = canvasService.toDataURL(dataURLOptions.type, dataURLOptions.quality);
        } catch (err) {
          console.warn("Cannot inline img src=".concat(image_1.currentSrc, "! Error: ").concat(err));
        }
        oldValue_1 ? attributes.crossOrigin = oldValue_1 : image_1.removeAttribute("crossorigin");
      };
      if (image_1.complete && image_1.naturalWidth !== 0)
        recordInlineImage();
      else
        image_1.onload = recordInlineImage;
    }
    if (tagName === "audio" || tagName === "video") {
      attributes.rr_mediaState = n2.paused ? "paused" : "played";
      attributes.rr_mediaCurrentTime = n2.currentTime;
    }
    if (!newlyAddedElement) {
      if (n2.scrollLeft) {
        attributes.rr_scrollLeft = n2.scrollLeft;
      }
      if (n2.scrollTop) {
        attributes.rr_scrollTop = n2.scrollTop;
      }
    }
    if (needBlock) {
      var _d = n2.getBoundingClientRect(), width = _d.width, height = _d.height;
      attributes = {
        "class": attributes["class"],
        rr_width: "".concat(width, "px"),
        rr_height: "".concat(height, "px")
      };
    }
    if (tagName === "iframe" && !keepIframeSrcFn(attributes.src)) {
      if (!n2.contentDocument) {
        attributes.rr_src = attributes.src;
      }
      delete attributes.src;
    }
    return {
      type: NodeType.Element,
      tagName,
      attributes,
      childNodes: [],
      isSVG: isSVGElement(n2) || void 0,
      needBlock,
      rootId
    };
  }
  function lowerIfExists(maybeAttr) {
    if (maybeAttr === void 0) {
      return "";
    } else {
      return maybeAttr.toLowerCase();
    }
  }
  function slimDOMExcluded(sn, slimDOMOptions) {
    if (slimDOMOptions.comment && sn.type === NodeType.Comment) {
      return true;
    } else if (sn.type === NodeType.Element) {
      if (slimDOMOptions.script && (sn.tagName === "script" || sn.tagName === "link" && sn.attributes.rel === "preload" && sn.attributes.as === "script" || sn.tagName === "link" && sn.attributes.rel === "prefetch" && typeof sn.attributes.href === "string" && sn.attributes.href.endsWith(".js"))) {
        return true;
      } else if (slimDOMOptions.headFavicon && (sn.tagName === "link" && sn.attributes.rel === "shortcut icon" || sn.tagName === "meta" && (lowerIfExists(sn.attributes.name).match(/^msapplication-tile(image|color)$/) || lowerIfExists(sn.attributes.name) === "application-name" || lowerIfExists(sn.attributes.rel) === "icon" || lowerIfExists(sn.attributes.rel) === "apple-touch-icon" || lowerIfExists(sn.attributes.rel) === "shortcut icon"))) {
        return true;
      } else if (sn.tagName === "meta") {
        if (slimDOMOptions.headMetaDescKeywords && lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) {
          return true;
        } else if (slimDOMOptions.headMetaSocial && (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) || lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) || lowerIfExists(sn.attributes.name) === "pinterest")) {
          return true;
        } else if (slimDOMOptions.headMetaRobots && (lowerIfExists(sn.attributes.name) === "robots" || lowerIfExists(sn.attributes.name) === "googlebot" || lowerIfExists(sn.attributes.name) === "bingbot")) {
          return true;
        } else if (slimDOMOptions.headMetaHttpEquiv && sn.attributes["http-equiv"] !== void 0) {
          return true;
        } else if (slimDOMOptions.headMetaAuthorship && (lowerIfExists(sn.attributes.name) === "author" || lowerIfExists(sn.attributes.name) === "generator" || lowerIfExists(sn.attributes.name) === "framework" || lowerIfExists(sn.attributes.name) === "publisher" || lowerIfExists(sn.attributes.name) === "progid" || lowerIfExists(sn.attributes.property).match(/^article:/) || lowerIfExists(sn.attributes.property).match(/^product:/))) {
          return true;
        } else if (slimDOMOptions.headMetaVerification && (lowerIfExists(sn.attributes.name) === "google-site-verification" || lowerIfExists(sn.attributes.name) === "yandex-verification" || lowerIfExists(sn.attributes.name) === "csrf-token" || lowerIfExists(sn.attributes.name) === "p:domain_verify" || lowerIfExists(sn.attributes.name) === "verify-v1" || lowerIfExists(sn.attributes.name) === "verification" || lowerIfExists(sn.attributes.name) === "shopify-checkout-api-token")) {
          return true;
        }
      }
    }
    return false;
  }
  function serializeNodeWithId(n2, options) {
    var doc = options.doc, mirror2 = options.mirror, blockClass = options.blockClass, blockSelector = options.blockSelector, maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, _a = options.skipChild, skipChild = _a === void 0 ? false : _a, _b = options.inlineStylesheet, inlineStylesheet = _b === void 0 ? true : _b, _c = options.maskInputOptions, maskInputOptions = _c === void 0 ? {} : _c, maskTextFn = options.maskTextFn, maskInputFn = options.maskInputFn, slimDOMOptions = options.slimDOMOptions, _d = options.dataURLOptions, dataURLOptions = _d === void 0 ? {} : _d, _e = options.inlineImages, inlineImages = _e === void 0 ? false : _e, _f = options.recordCanvas, recordCanvas = _f === void 0 ? false : _f, onSerialize = options.onSerialize, onIframeLoad = options.onIframeLoad, _g = options.iframeLoadTimeout, iframeLoadTimeout = _g === void 0 ? 5e3 : _g, onStylesheetLoad = options.onStylesheetLoad, _h = options.stylesheetLoadTimeout, stylesheetLoadTimeout = _h === void 0 ? 5e3 : _h, _j = options.keepIframeSrcFn, keepIframeSrcFn = _j === void 0 ? function() {
      return false;
    } : _j, _k = options.newlyAddedElement, newlyAddedElement = _k === void 0 ? false : _k;
    var _l = options.preserveWhiteSpace, preserveWhiteSpace = _l === void 0 ? true : _l;
    var _serializedNode = serializeNode(n2, {
      doc,
      mirror: mirror2,
      blockClass,
      blockSelector,
      maskTextClass,
      maskTextSelector,
      inlineStylesheet,
      maskInputOptions,
      maskTextFn,
      maskInputFn,
      dataURLOptions,
      inlineImages,
      recordCanvas,
      keepIframeSrcFn,
      newlyAddedElement
    });
    if (!_serializedNode) {
      console.warn(n2, "not serialized");
      return null;
    }
    var id;
    if (mirror2.hasNode(n2)) {
      id = mirror2.getId(n2);
    } else if (slimDOMExcluded(_serializedNode, slimDOMOptions) || !preserveWhiteSpace && _serializedNode.type === NodeType.Text && !_serializedNode.isStyle && !_serializedNode.textContent.replace(/^\s+|\s+$/gm, "").length) {
      id = IGNORED_NODE;
    } else {
      id = genId();
    }
    var serializedNode = Object.assign(_serializedNode, { id });
    mirror2.add(n2, serializedNode);
    if (id === IGNORED_NODE) {
      return null;
    }
    if (onSerialize) {
      onSerialize(n2);
    }
    var recordChild = !skipChild;
    if (serializedNode.type === NodeType.Element) {
      recordChild = recordChild && !serializedNode.needBlock;
      delete serializedNode.needBlock;
      var shadowRoot = n2.shadowRoot;
      if (shadowRoot && isNativeShadowDom(shadowRoot))
        serializedNode.isShadowHost = true;
    }
    if ((serializedNode.type === NodeType.Document || serializedNode.type === NodeType.Element) && recordChild) {
      if (slimDOMOptions.headWhitespace && serializedNode.type === NodeType.Element && serializedNode.tagName === "head") {
        preserveWhiteSpace = false;
      }
      var bypassOptions = {
        doc,
        mirror: mirror2,
        blockClass,
        blockSelector,
        maskTextClass,
        maskTextSelector,
        skipChild,
        inlineStylesheet,
        maskInputOptions,
        maskTextFn,
        maskInputFn,
        slimDOMOptions,
        dataURLOptions,
        inlineImages,
        recordCanvas,
        preserveWhiteSpace,
        onSerialize,
        onIframeLoad,
        iframeLoadTimeout,
        onStylesheetLoad,
        stylesheetLoadTimeout,
        keepIframeSrcFn
      };
      for (var _i = 0, _m = Array.from(n2.childNodes); _i < _m.length; _i++) {
        var childN = _m[_i];
        var serializedChildNode = serializeNodeWithId(childN, bypassOptions);
        if (serializedChildNode) {
          serializedNode.childNodes.push(serializedChildNode);
        }
      }
      if (isElement(n2) && n2.shadowRoot) {
        for (var _o = 0, _p = Array.from(n2.shadowRoot.childNodes); _o < _p.length; _o++) {
          var childN = _p[_o];
          var serializedChildNode = serializeNodeWithId(childN, bypassOptions);
          if (serializedChildNode) {
            isNativeShadowDom(n2.shadowRoot) && (serializedChildNode.isShadow = true);
            serializedNode.childNodes.push(serializedChildNode);
          }
        }
      }
    }
    if (n2.parentNode && isShadowRoot(n2.parentNode) && isNativeShadowDom(n2.parentNode)) {
      serializedNode.isShadow = true;
    }
    if (serializedNode.type === NodeType.Element && serializedNode.tagName === "iframe") {
      onceIframeLoaded(n2, function() {
        var iframeDoc = n2.contentDocument;
        if (iframeDoc && onIframeLoad) {
          var serializedIframeNode = serializeNodeWithId(iframeDoc, {
            doc: iframeDoc,
            mirror: mirror2,
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            skipChild: false,
            inlineStylesheet,
            maskInputOptions,
            maskTextFn,
            maskInputFn,
            slimDOMOptions,
            dataURLOptions,
            inlineImages,
            recordCanvas,
            preserveWhiteSpace,
            onSerialize,
            onIframeLoad,
            iframeLoadTimeout,
            onStylesheetLoad,
            stylesheetLoadTimeout,
            keepIframeSrcFn
          });
          if (serializedIframeNode) {
            onIframeLoad(n2, serializedIframeNode);
          }
        }
      }, iframeLoadTimeout);
    }
    if (serializedNode.type === NodeType.Element && serializedNode.tagName === "link" && serializedNode.attributes.rel === "stylesheet") {
      onceStylesheetLoaded(n2, function() {
        if (onStylesheetLoad) {
          var serializedLinkNode = serializeNodeWithId(n2, {
            doc,
            mirror: mirror2,
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            skipChild: false,
            inlineStylesheet,
            maskInputOptions,
            maskTextFn,
            maskInputFn,
            slimDOMOptions,
            dataURLOptions,
            inlineImages,
            recordCanvas,
            preserveWhiteSpace,
            onSerialize,
            onIframeLoad,
            iframeLoadTimeout,
            onStylesheetLoad,
            stylesheetLoadTimeout,
            keepIframeSrcFn
          });
          if (serializedLinkNode) {
            onStylesheetLoad(n2, serializedLinkNode);
          }
        }
      }, stylesheetLoadTimeout);
    }
    return serializedNode;
  }
  function snapshot(n2, options) {
    var _a = options || {}, _b = _a.mirror, mirror2 = _b === void 0 ? new Mirror() : _b, _c = _a.blockClass, blockClass = _c === void 0 ? "rr-block" : _c, _d = _a.blockSelector, blockSelector = _d === void 0 ? null : _d, _e = _a.maskTextClass, maskTextClass = _e === void 0 ? "rr-mask" : _e, _f = _a.maskTextSelector, maskTextSelector = _f === void 0 ? null : _f, _g = _a.inlineStylesheet, inlineStylesheet = _g === void 0 ? true : _g, _h = _a.inlineImages, inlineImages = _h === void 0 ? false : _h, _j = _a.recordCanvas, recordCanvas = _j === void 0 ? false : _j, _k = _a.maskAllInputs, maskAllInputs = _k === void 0 ? false : _k, maskTextFn = _a.maskTextFn, maskInputFn = _a.maskInputFn, _l = _a.slimDOM, slimDOM = _l === void 0 ? false : _l, dataURLOptions = _a.dataURLOptions, preserveWhiteSpace = _a.preserveWhiteSpace, onSerialize = _a.onSerialize, onIframeLoad = _a.onIframeLoad, iframeLoadTimeout = _a.iframeLoadTimeout, onStylesheetLoad = _a.onStylesheetLoad, stylesheetLoadTimeout = _a.stylesheetLoadTimeout, _m = _a.keepIframeSrcFn, keepIframeSrcFn = _m === void 0 ? function() {
      return false;
    } : _m;
    var maskInputOptions = maskAllInputs === true ? {
      color: true,
      date: true,
      "datetime-local": true,
      email: true,
      month: true,
      number: true,
      range: true,
      search: true,
      tel: true,
      text: true,
      time: true,
      url: true,
      week: true,
      textarea: true,
      select: true,
      password: true
    } : maskAllInputs === false ? {
      password: true
    } : maskAllInputs;
    var slimDOMOptions = slimDOM === true || slimDOM === "all" ? {
      script: true,
      comment: true,
      headFavicon: true,
      headWhitespace: true,
      headMetaDescKeywords: slimDOM === "all",
      headMetaSocial: true,
      headMetaRobots: true,
      headMetaHttpEquiv: true,
      headMetaAuthorship: true,
      headMetaVerification: true
    } : slimDOM === false ? {} : slimDOM;
    return serializeNodeWithId(n2, {
      doc: n2,
      mirror: mirror2,
      blockClass,
      blockSelector,
      maskTextClass,
      maskTextSelector,
      skipChild: false,
      inlineStylesheet,
      maskInputOptions,
      maskTextFn,
      maskInputFn,
      slimDOMOptions,
      dataURLOptions,
      inlineImages,
      recordCanvas,
      preserveWhiteSpace,
      onSerialize,
      onIframeLoad,
      iframeLoadTimeout,
      onStylesheetLoad,
      stylesheetLoadTimeout,
      keepIframeSrcFn,
      newlyAddedElement: false
    });
  }
  var HOVER_SELECTOR = /([^\\]):hover/;
  var HOVER_SELECTOR_GLOBAL = new RegExp(HOVER_SELECTOR.source, "g");

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/utils.js
  function on(type, fn, target = document) {
    const options = { capture: true, passive: true };
    target.addEventListener(type, fn, options);
    return () => target.removeEventListener(type, fn, options);
  }
  var DEPARTED_MIRROR_ACCESS_WARNING = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
  var _mirror = {
    map: {},
    getId() {
      console.error(DEPARTED_MIRROR_ACCESS_WARNING);
      return -1;
    },
    getNode() {
      console.error(DEPARTED_MIRROR_ACCESS_WARNING);
      return null;
    },
    removeNodeFromMap() {
      console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    },
    has() {
      console.error(DEPARTED_MIRROR_ACCESS_WARNING);
      return false;
    },
    reset() {
      console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    }
  };
  if (typeof window !== "undefined" && window.Proxy && window.Reflect) {
    _mirror = new Proxy(_mirror, {
      get(target, prop, receiver) {
        if (prop === "map") {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }
  function throttle(func, wait, options = {}) {
    let timeout = null;
    let previous = 0;
    return function(...args) {
      const now = Date.now();
      if (!previous && options.leading === false) {
        previous = now;
      }
      const remaining = wait - (now - previous);
      const context = this;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(() => {
          previous = options.leading === false ? 0 : Date.now();
          timeout = null;
          func.apply(context, args);
        }, remaining);
      }
    };
  }
  function hookSetter(target, key, d2, isRevoked, win = window) {
    const original = win.Object.getOwnPropertyDescriptor(target, key);
    win.Object.defineProperty(target, key, isRevoked ? d2 : {
      set(value) {
        setTimeout(() => {
          d2.set.call(this, value);
        }, 0);
        if (original && original.set) {
          original.set.call(this, value);
        }
      }
    });
    return () => hookSetter(target, key, original || {}, true);
  }
  function patch(source, name, replacement) {
    try {
      if (!(name in source)) {
        return () => {
        };
      }
      const original = source[name];
      const wrapped = replacement(original);
      if (typeof wrapped === "function") {
        wrapped.prototype = wrapped.prototype || {};
        Object.defineProperties(wrapped, {
          __rrweb_original__: {
            enumerable: false,
            value: original
          }
        });
      }
      source[name] = wrapped;
      return () => {
        source[name] = original;
      };
    } catch (_a) {
      return () => {
      };
    }
  }
  function getWindowHeight() {
    return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
  }
  function getWindowWidth() {
    return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
  }
  function isBlocked(node, blockClass, blockSelector, checkAncestors) {
    if (!node) {
      return false;
    }
    const el = node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
    if (!el)
      return false;
    if (typeof blockClass === "string") {
      if (el.classList.contains(blockClass))
        return true;
      if (checkAncestors && el.closest("." + blockClass) !== null)
        return true;
    } else {
      if (classMatchesRegex(el, blockClass, checkAncestors))
        return true;
    }
    if (blockSelector) {
      if (node.matches(blockSelector))
        return true;
      if (checkAncestors && el.closest(blockSelector) !== null)
        return true;
    }
    return false;
  }
  function isSerialized(n2, mirror2) {
    return mirror2.getId(n2) !== -1;
  }
  function isIgnored(n2, mirror2) {
    return mirror2.getId(n2) === IGNORED_NODE;
  }
  function isAncestorRemoved(target, mirror2) {
    if (isShadowRoot(target)) {
      return false;
    }
    const id = mirror2.getId(target);
    if (!mirror2.has(id)) {
      return true;
    }
    if (target.parentNode && target.parentNode.nodeType === target.DOCUMENT_NODE) {
      return false;
    }
    if (!target.parentNode) {
      return true;
    }
    return isAncestorRemoved(target.parentNode, mirror2);
  }
  function isTouchEvent(event) {
    return Boolean(event.changedTouches);
  }
  function polyfill(win = window) {
    if ("NodeList" in win && !win.NodeList.prototype.forEach) {
      win.NodeList.prototype.forEach = Array.prototype.forEach;
    }
    if ("DOMTokenList" in win && !win.DOMTokenList.prototype.forEach) {
      win.DOMTokenList.prototype.forEach = Array.prototype.forEach;
    }
    if (!Node.prototype.contains) {
      Node.prototype.contains = (...args) => {
        let node = args[0];
        if (!(0 in args)) {
          throw new TypeError("1 argument is required");
        }
        do {
          if (this === node) {
            return true;
          }
        } while (node = node && node.parentNode);
        return false;
      };
    }
  }
  function isSerializedIframe(n2, mirror2) {
    return Boolean(n2.nodeName === "IFRAME" && mirror2.getMeta(n2));
  }
  function isSerializedStylesheet(n2, mirror2) {
    return Boolean(n2.nodeName === "LINK" && n2.nodeType === n2.ELEMENT_NODE && n2.getAttribute && n2.getAttribute("rel") === "stylesheet" && mirror2.getMeta(n2));
  }
  function hasShadowRoot(n2) {
    return Boolean(n2 === null || n2 === void 0 ? void 0 : n2.shadowRoot);
  }
  var StyleSheetMirror = class {
    constructor() {
      this.id = 1;
      this.styleIDMap = /* @__PURE__ */ new WeakMap();
      this.idStyleMap = /* @__PURE__ */ new Map();
    }
    getId(stylesheet) {
      var _a;
      return (_a = this.styleIDMap.get(stylesheet)) !== null && _a !== void 0 ? _a : -1;
    }
    has(stylesheet) {
      return this.styleIDMap.has(stylesheet);
    }
    add(stylesheet, id) {
      if (this.has(stylesheet))
        return this.getId(stylesheet);
      let newId;
      if (id === void 0) {
        newId = this.id++;
      } else
        newId = id;
      this.styleIDMap.set(stylesheet, newId);
      this.idStyleMap.set(newId, stylesheet);
      return newId;
    }
    getStyle(id) {
      return this.idStyleMap.get(id) || null;
    }
    reset() {
      this.styleIDMap = /* @__PURE__ */ new WeakMap();
      this.idStyleMap = /* @__PURE__ */ new Map();
      this.id = 1;
    }
    generateId() {
      return this.id++;
    }
  };

  // node_modules/rrweb/es/rrweb/packages/types/dist/types.js
  var EventType = /* @__PURE__ */ ((EventType2) => {
    EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
    EventType2[EventType2["Load"] = 1] = "Load";
    EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
    EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
    EventType2[EventType2["Meta"] = 4] = "Meta";
    EventType2[EventType2["Custom"] = 5] = "Custom";
    EventType2[EventType2["Plugin"] = 6] = "Plugin";
    return EventType2;
  })(EventType || {});
  var IncrementalSource = /* @__PURE__ */ ((IncrementalSource2) => {
    IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
    IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
    IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
    IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
    IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
    IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
    IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
    IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
    IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
    IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
    IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
    IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
    IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
    IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
    IncrementalSource2[IncrementalSource2["Selection"] = 14] = "Selection";
    IncrementalSource2[IncrementalSource2["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
    return IncrementalSource2;
  })(IncrementalSource || {});
  var MouseInteractions = /* @__PURE__ */ ((MouseInteractions2) => {
    MouseInteractions2[MouseInteractions2["MouseUp"] = 0] = "MouseUp";
    MouseInteractions2[MouseInteractions2["MouseDown"] = 1] = "MouseDown";
    MouseInteractions2[MouseInteractions2["Click"] = 2] = "Click";
    MouseInteractions2[MouseInteractions2["ContextMenu"] = 3] = "ContextMenu";
    MouseInteractions2[MouseInteractions2["DblClick"] = 4] = "DblClick";
    MouseInteractions2[MouseInteractions2["Focus"] = 5] = "Focus";
    MouseInteractions2[MouseInteractions2["Blur"] = 6] = "Blur";
    MouseInteractions2[MouseInteractions2["TouchStart"] = 7] = "TouchStart";
    MouseInteractions2[MouseInteractions2["TouchMove_Departed"] = 8] = "TouchMove_Departed";
    MouseInteractions2[MouseInteractions2["TouchEnd"] = 9] = "TouchEnd";
    MouseInteractions2[MouseInteractions2["TouchCancel"] = 10] = "TouchCancel";
    return MouseInteractions2;
  })(MouseInteractions || {});
  var CanvasContext = /* @__PURE__ */ ((CanvasContext2) => {
    CanvasContext2[CanvasContext2["2D"] = 0] = "2D";
    CanvasContext2[CanvasContext2["WebGL"] = 1] = "WebGL";
    CanvasContext2[CanvasContext2["WebGL2"] = 2] = "WebGL2";
    return CanvasContext2;
  })(CanvasContext || {});

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/mutation.js
  function isNodeInLinkedList(n2) {
    return "__ln" in n2;
  }
  var DoubleLinkedList = class {
    constructor() {
      this.length = 0;
      this.head = null;
    }
    get(position) {
      if (position >= this.length) {
        throw new Error("Position outside of list range");
      }
      let current = this.head;
      for (let index = 0; index < position; index++) {
        current = (current === null || current === void 0 ? void 0 : current.next) || null;
      }
      return current;
    }
    addNode(n2) {
      const node = {
        value: n2,
        previous: null,
        next: null
      };
      n2.__ln = node;
      if (n2.previousSibling && isNodeInLinkedList(n2.previousSibling)) {
        const current = n2.previousSibling.__ln.next;
        node.next = current;
        node.previous = n2.previousSibling.__ln;
        n2.previousSibling.__ln.next = node;
        if (current) {
          current.previous = node;
        }
      } else if (n2.nextSibling && isNodeInLinkedList(n2.nextSibling) && n2.nextSibling.__ln.previous) {
        const current = n2.nextSibling.__ln.previous;
        node.previous = current;
        node.next = n2.nextSibling.__ln;
        n2.nextSibling.__ln.previous = node;
        if (current) {
          current.next = node;
        }
      } else {
        if (this.head) {
          this.head.previous = node;
        }
        node.next = this.head;
        this.head = node;
      }
      this.length++;
    }
    removeNode(n2) {
      const current = n2.__ln;
      if (!this.head) {
        return;
      }
      if (!current.previous) {
        this.head = current.next;
        if (this.head) {
          this.head.previous = null;
        }
      } else {
        current.previous.next = current.next;
        if (current.next) {
          current.next.previous = current.previous;
        }
      }
      if (n2.__ln) {
        delete n2.__ln;
      }
      this.length--;
    }
  };
  var moveKey = (id, parentId) => `${id}@${parentId}`;
  var MutationBuffer = class {
    constructor() {
      this.frozen = false;
      this.locked = false;
      this.texts = [];
      this.attributes = [];
      this.removes = [];
      this.mapRemoves = [];
      this.movedMap = {};
      this.addedSet = /* @__PURE__ */ new Set();
      this.movedSet = /* @__PURE__ */ new Set();
      this.droppedSet = /* @__PURE__ */ new Set();
      this.processMutations = (mutations) => {
        mutations.forEach(this.processMutation);
        this.emit();
      };
      this.emit = () => {
        if (this.frozen || this.locked) {
          return;
        }
        const adds = [];
        const addList = new DoubleLinkedList();
        const getNextId = (n2) => {
          let ns = n2;
          let nextId = IGNORED_NODE;
          while (nextId === IGNORED_NODE) {
            ns = ns && ns.nextSibling;
            nextId = ns && this.mirror.getId(ns);
          }
          return nextId;
        };
        const pushAdd = (n2) => {
          var _a, _b, _c, _d;
          let shadowHost = null;
          if (((_b = (_a = n2.getRootNode) === null || _a === void 0 ? void 0 : _a.call(n2)) === null || _b === void 0 ? void 0 : _b.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && n2.getRootNode().host)
            shadowHost = n2.getRootNode().host;
          let rootShadowHost = shadowHost;
          while (((_d = (_c = rootShadowHost === null || rootShadowHost === void 0 ? void 0 : rootShadowHost.getRootNode) === null || _c === void 0 ? void 0 : _c.call(rootShadowHost)) === null || _d === void 0 ? void 0 : _d.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && rootShadowHost.getRootNode().host)
            rootShadowHost = rootShadowHost.getRootNode().host;
          const notInDoc = !this.doc.contains(n2) && (!rootShadowHost || !this.doc.contains(rootShadowHost));
          if (!n2.parentNode || notInDoc) {
            return;
          }
          const parentId = isShadowRoot(n2.parentNode) ? this.mirror.getId(shadowHost) : this.mirror.getId(n2.parentNode);
          const nextId = getNextId(n2);
          if (parentId === -1 || nextId === -1) {
            return addList.addNode(n2);
          }
          const sn = serializeNodeWithId(n2, {
            doc: this.doc,
            mirror: this.mirror,
            blockClass: this.blockClass,
            blockSelector: this.blockSelector,
            maskTextClass: this.maskTextClass,
            maskTextSelector: this.maskTextSelector,
            skipChild: true,
            newlyAddedElement: true,
            inlineStylesheet: this.inlineStylesheet,
            maskInputOptions: this.maskInputOptions,
            maskTextFn: this.maskTextFn,
            maskInputFn: this.maskInputFn,
            slimDOMOptions: this.slimDOMOptions,
            dataURLOptions: this.dataURLOptions,
            recordCanvas: this.recordCanvas,
            inlineImages: this.inlineImages,
            onSerialize: (currentN) => {
              if (isSerializedIframe(currentN, this.mirror)) {
                this.iframeManager.addIframe(currentN);
              }
              if (isSerializedStylesheet(currentN, this.mirror)) {
                this.stylesheetManager.trackLinkElement(currentN);
              }
              if (hasShadowRoot(n2)) {
                this.shadowDomManager.addShadowRoot(n2.shadowRoot, this.doc);
              }
            },
            onIframeLoad: (iframe, childSn) => {
              this.iframeManager.attachIframe(iframe, childSn);
              this.shadowDomManager.observeAttachShadow(iframe);
            },
            onStylesheetLoad: (link, childSn) => {
              this.stylesheetManager.attachLinkElement(link, childSn);
            }
          });
          if (sn) {
            adds.push({
              parentId,
              nextId,
              node: sn
            });
          }
        };
        while (this.mapRemoves.length) {
          this.mirror.removeNodeFromMap(this.mapRemoves.shift());
        }
        for (const n2 of Array.from(this.movedSet.values())) {
          if (isParentRemoved(this.removes, n2, this.mirror) && !this.movedSet.has(n2.parentNode)) {
            continue;
          }
          pushAdd(n2);
        }
        for (const n2 of Array.from(this.addedSet.values())) {
          if (!isAncestorInSet(this.droppedSet, n2) && !isParentRemoved(this.removes, n2, this.mirror)) {
            pushAdd(n2);
          } else if (isAncestorInSet(this.movedSet, n2)) {
            pushAdd(n2);
          } else {
            this.droppedSet.add(n2);
          }
        }
        let candidate = null;
        while (addList.length) {
          let node = null;
          if (candidate) {
            const parentId = this.mirror.getId(candidate.value.parentNode);
            const nextId = getNextId(candidate.value);
            if (parentId !== -1 && nextId !== -1) {
              node = candidate;
            }
          }
          if (!node) {
            for (let index = addList.length - 1; index >= 0; index--) {
              const _node = addList.get(index);
              if (_node) {
                const parentId = this.mirror.getId(_node.value.parentNode);
                const nextId = getNextId(_node.value);
                if (nextId === -1)
                  continue;
                else if (parentId !== -1) {
                  node = _node;
                  break;
                } else {
                  const unhandledNode = _node.value;
                  if (unhandledNode.parentNode && unhandledNode.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    const shadowHost = unhandledNode.parentNode.host;
                    const parentId2 = this.mirror.getId(shadowHost);
                    if (parentId2 !== -1) {
                      node = _node;
                      break;
                    }
                  }
                }
              }
            }
          }
          if (!node) {
            while (addList.head) {
              addList.removeNode(addList.head.value);
            }
            break;
          }
          candidate = node.previous;
          addList.removeNode(node.value);
          pushAdd(node.value);
        }
        const payload = {
          texts: this.texts.map((text) => ({
            id: this.mirror.getId(text.node),
            value: text.value
          })).filter((text) => this.mirror.has(text.id)),
          attributes: this.attributes.map((attribute) => ({
            id: this.mirror.getId(attribute.node),
            attributes: attribute.attributes
          })).filter((attribute) => this.mirror.has(attribute.id)),
          removes: this.removes,
          adds
        };
        if (!payload.texts.length && !payload.attributes.length && !payload.removes.length && !payload.adds.length) {
          return;
        }
        this.texts = [];
        this.attributes = [];
        this.removes = [];
        this.addedSet = /* @__PURE__ */ new Set();
        this.movedSet = /* @__PURE__ */ new Set();
        this.droppedSet = /* @__PURE__ */ new Set();
        this.movedMap = {};
        this.mutationCb(payload);
      };
      this.processMutation = (m2) => {
        if (isIgnored(m2.target, this.mirror)) {
          return;
        }
        switch (m2.type) {
          case "characterData": {
            const value = m2.target.textContent;
            if (!isBlocked(m2.target, this.blockClass, this.blockSelector, false) && value !== m2.oldValue) {
              this.texts.push({
                value: needMaskingText(m2.target, this.maskTextClass, this.maskTextSelector) && value ? this.maskTextFn ? this.maskTextFn(value) : value.replace(/[\S]/g, "*") : value,
                node: m2.target
              });
            }
            break;
          }
          case "attributes": {
            const target = m2.target;
            let value = m2.target.getAttribute(m2.attributeName);
            if (m2.attributeName === "value") {
              value = maskInputValue({
                maskInputOptions: this.maskInputOptions,
                tagName: m2.target.tagName,
                type: m2.target.getAttribute("type"),
                value,
                maskInputFn: this.maskInputFn
              });
            }
            if (isBlocked(m2.target, this.blockClass, this.blockSelector, false) || value === m2.oldValue) {
              return;
            }
            let item = this.attributes.find((a2) => a2.node === m2.target);
            if (target.tagName === "IFRAME" && m2.attributeName === "src" && !this.keepIframeSrcFn(value)) {
              if (!target.contentDocument) {
                m2.attributeName = "rr_src";
              } else {
                return;
              }
            }
            if (!item) {
              item = {
                node: m2.target,
                attributes: {}
              };
              this.attributes.push(item);
            }
            if (m2.attributeName === "style") {
              const old = this.doc.createElement("span");
              if (m2.oldValue) {
                old.setAttribute("style", m2.oldValue);
              }
              if (item.attributes.style === void 0 || item.attributes.style === null) {
                item.attributes.style = {};
              }
              const styleObj = item.attributes.style;
              for (const pname of Array.from(target.style)) {
                const newValue = target.style.getPropertyValue(pname);
                const newPriority = target.style.getPropertyPriority(pname);
                if (newValue !== old.style.getPropertyValue(pname) || newPriority !== old.style.getPropertyPriority(pname)) {
                  if (newPriority === "") {
                    styleObj[pname] = newValue;
                  } else {
                    styleObj[pname] = [newValue, newPriority];
                  }
                }
              }
              for (const pname of Array.from(old.style)) {
                if (target.style.getPropertyValue(pname) === "") {
                  styleObj[pname] = false;
                }
              }
            } else {
              item.attributes[m2.attributeName] = transformAttribute(this.doc, target.tagName, m2.attributeName, value);
            }
            break;
          }
          case "childList": {
            if (isBlocked(m2.target, this.blockClass, this.blockSelector, true))
              return;
            m2.addedNodes.forEach((n2) => this.genAdds(n2, m2.target));
            m2.removedNodes.forEach((n2) => {
              const nodeId = this.mirror.getId(n2);
              const parentId = isShadowRoot(m2.target) ? this.mirror.getId(m2.target.host) : this.mirror.getId(m2.target);
              if (isBlocked(m2.target, this.blockClass, this.blockSelector, false) || isIgnored(n2, this.mirror) || !isSerialized(n2, this.mirror)) {
                return;
              }
              if (this.addedSet.has(n2)) {
                deepDelete(this.addedSet, n2);
                this.droppedSet.add(n2);
              } else if (this.addedSet.has(m2.target) && nodeId === -1) ;
              else if (isAncestorRemoved(m2.target, this.mirror)) ;
              else if (this.movedSet.has(n2) && this.movedMap[moveKey(nodeId, parentId)]) {
                deepDelete(this.movedSet, n2);
              } else {
                this.removes.push({
                  parentId,
                  id: nodeId,
                  isShadow: isShadowRoot(m2.target) && isNativeShadowDom(m2.target) ? true : void 0
                });
              }
              this.mapRemoves.push(n2);
            });
            break;
          }
        }
      };
      this.genAdds = (n2, target) => {
        if (this.mirror.hasNode(n2)) {
          if (isIgnored(n2, this.mirror)) {
            return;
          }
          this.movedSet.add(n2);
          let targetId = null;
          if (target && this.mirror.hasNode(target)) {
            targetId = this.mirror.getId(target);
          }
          if (targetId && targetId !== -1) {
            this.movedMap[moveKey(this.mirror.getId(n2), targetId)] = true;
          }
        } else {
          this.addedSet.add(n2);
          this.droppedSet.delete(n2);
        }
        if (!isBlocked(n2, this.blockClass, this.blockSelector, false))
          n2.childNodes.forEach((childN) => this.genAdds(childN));
      };
    }
    init(options) {
      [
        "mutationCb",
        "blockClass",
        "blockSelector",
        "maskTextClass",
        "maskTextSelector",
        "inlineStylesheet",
        "maskInputOptions",
        "maskTextFn",
        "maskInputFn",
        "keepIframeSrcFn",
        "recordCanvas",
        "inlineImages",
        "slimDOMOptions",
        "dataURLOptions",
        "doc",
        "mirror",
        "iframeManager",
        "stylesheetManager",
        "shadowDomManager",
        "canvasManager"
      ].forEach((key) => {
        this[key] = options[key];
      });
    }
    freeze() {
      this.frozen = true;
      this.canvasManager.freeze();
    }
    unfreeze() {
      this.frozen = false;
      this.canvasManager.unfreeze();
      this.emit();
    }
    isFrozen() {
      return this.frozen;
    }
    lock() {
      this.locked = true;
      this.canvasManager.lock();
    }
    unlock() {
      this.locked = false;
      this.canvasManager.unlock();
      this.emit();
    }
    reset() {
      this.shadowDomManager.reset();
      this.canvasManager.reset();
    }
  };
  function deepDelete(addsSet, n2) {
    addsSet.delete(n2);
    n2.childNodes.forEach((childN) => deepDelete(addsSet, childN));
  }
  function isParentRemoved(removes, n2, mirror2) {
    if (removes.length === 0)
      return false;
    return _isParentRemoved(removes, n2, mirror2);
  }
  function _isParentRemoved(removes, n2, mirror2) {
    const { parentNode } = n2;
    if (!parentNode) {
      return false;
    }
    const parentId = mirror2.getId(parentNode);
    if (removes.some((r2) => r2.id === parentId)) {
      return true;
    }
    return _isParentRemoved(removes, parentNode, mirror2);
  }
  function isAncestorInSet(set, n2) {
    if (set.size === 0)
      return false;
    return _isAncestorInSet(set, n2);
  }
  function _isAncestorInSet(set, n2) {
    const { parentNode } = n2;
    if (!parentNode) {
      return false;
    }
    if (set.has(parentNode)) {
      return true;
    }
    return _isAncestorInSet(set, parentNode);
  }

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/observer.js
  var mutationBuffers = [];
  var isCSSGroupingRuleSupported = typeof CSSGroupingRule !== "undefined";
  var isCSSMediaRuleSupported = typeof CSSMediaRule !== "undefined";
  var isCSSSupportsRuleSupported = typeof CSSSupportsRule !== "undefined";
  var isCSSConditionRuleSupported = typeof CSSConditionRule !== "undefined";
  function getEventTarget(event) {
    try {
      if ("composedPath" in event) {
        const path = event.composedPath();
        if (path.length) {
          return path[0];
        }
      } else if ("path" in event && event.path.length) {
        return event.path[0];
      }
      return event.target;
    } catch (_a) {
      return event.target;
    }
  }
  function initMutationObserver(options, rootEl) {
    var _a, _b;
    const mutationBuffer = new MutationBuffer();
    mutationBuffers.push(mutationBuffer);
    mutationBuffer.init(options);
    let mutationObserverCtor = window.MutationObserver || window.__rrMutationObserver;
    const angularZoneSymbol = (_b = (_a = window === null || window === void 0 ? void 0 : window.Zone) === null || _a === void 0 ? void 0 : _a.__symbol__) === null || _b === void 0 ? void 0 : _b.call(_a, "MutationObserver");
    if (angularZoneSymbol && window[angularZoneSymbol]) {
      mutationObserverCtor = window[angularZoneSymbol];
    }
    const observer = new mutationObserverCtor(mutationBuffer.processMutations.bind(mutationBuffer));
    observer.observe(rootEl, {
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
      childList: true,
      subtree: true
    });
    return observer;
  }
  function initMoveObserver({ mousemoveCb, sampling, doc, mirror: mirror2 }) {
    if (sampling.mousemove === false) {
      return () => {
      };
    }
    const threshold = typeof sampling.mousemove === "number" ? sampling.mousemove : 50;
    const callbackThreshold = typeof sampling.mousemoveCallback === "number" ? sampling.mousemoveCallback : 500;
    let positions = [];
    let timeBaseline;
    const wrappedCb = throttle((source) => {
      const totalOffset = Date.now() - timeBaseline;
      mousemoveCb(positions.map((p2) => {
        p2.timeOffset -= totalOffset;
        return p2;
      }), source);
      positions = [];
      timeBaseline = null;
    }, callbackThreshold);
    const updatePosition = throttle((evt) => {
      const target = getEventTarget(evt);
      const { clientX, clientY } = isTouchEvent(evt) ? evt.changedTouches[0] : evt;
      if (!timeBaseline) {
        timeBaseline = Date.now();
      }
      positions.push({
        x: clientX,
        y: clientY,
        id: mirror2.getId(target),
        timeOffset: Date.now() - timeBaseline
      });
      wrappedCb(typeof DragEvent !== "undefined" && evt instanceof DragEvent ? IncrementalSource.Drag : evt instanceof MouseEvent ? IncrementalSource.MouseMove : IncrementalSource.TouchMove);
    }, threshold, {
      trailing: false
    });
    const handlers = [
      on("mousemove", updatePosition, doc),
      on("touchmove", updatePosition, doc),
      on("drag", updatePosition, doc)
    ];
    return () => {
      handlers.forEach((h2) => h2());
    };
  }
  function initMouseInteractionObserver({ mouseInteractionCb, doc, mirror: mirror2, blockClass, blockSelector, sampling }) {
    if (sampling.mouseInteraction === false) {
      return () => {
      };
    }
    const disableMap = sampling.mouseInteraction === true || sampling.mouseInteraction === void 0 ? {} : sampling.mouseInteraction;
    const handlers = [];
    const getHandler = (eventKey) => {
      return (event) => {
        const target = getEventTarget(event);
        if (isBlocked(target, blockClass, blockSelector, true)) {
          return;
        }
        const e2 = isTouchEvent(event) ? event.changedTouches[0] : event;
        if (!e2) {
          return;
        }
        const id = mirror2.getId(target);
        const { clientX, clientY } = e2;
        mouseInteractionCb({
          type: MouseInteractions[eventKey],
          id,
          x: clientX,
          y: clientY
        });
      };
    };
    Object.keys(MouseInteractions).filter((key) => Number.isNaN(Number(key)) && !key.endsWith("_Departed") && disableMap[key] !== false).forEach((eventKey) => {
      const eventName = eventKey.toLowerCase();
      const handler = getHandler(eventKey);
      handlers.push(on(eventName, handler, doc));
    });
    return () => {
      handlers.forEach((h2) => h2());
    };
  }
  function initScrollObserver({ scrollCb, doc, mirror: mirror2, blockClass, blockSelector, sampling }) {
    const updatePosition = throttle((evt) => {
      const target = getEventTarget(evt);
      if (!target || isBlocked(target, blockClass, blockSelector, true)) {
        return;
      }
      const id = mirror2.getId(target);
      if (target === doc) {
        const scrollEl = doc.scrollingElement || doc.documentElement;
        scrollCb({
          id,
          x: scrollEl.scrollLeft,
          y: scrollEl.scrollTop
        });
      } else {
        scrollCb({
          id,
          x: target.scrollLeft,
          y: target.scrollTop
        });
      }
    }, sampling.scroll || 100);
    return on("scroll", updatePosition, doc);
  }
  function initViewportResizeObserver({ viewportResizeCb }) {
    let lastH = -1;
    let lastW = -1;
    const updateDimension = throttle(() => {
      const height = getWindowHeight();
      const width = getWindowWidth();
      if (lastH !== height || lastW !== width) {
        viewportResizeCb({
          width: Number(width),
          height: Number(height)
        });
        lastH = height;
        lastW = width;
      }
    }, 200);
    return on("resize", updateDimension, window);
  }
  function wrapEventWithUserTriggeredFlag(v2, enable) {
    const value = Object.assign({}, v2);
    if (!enable)
      delete value.userTriggered;
    return value;
  }
  var INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
  var lastInputValueMap = /* @__PURE__ */ new WeakMap();
  function initInputObserver({ inputCb, doc, mirror: mirror2, blockClass, blockSelector, ignoreClass, maskInputOptions, maskInputFn, sampling, userTriggeredOnInput }) {
    function eventHandler(event) {
      let target = getEventTarget(event);
      const userTriggered = event.isTrusted;
      if (target && target.tagName === "OPTION")
        target = target.parentElement;
      if (!target || !target.tagName || INPUT_TAGS.indexOf(target.tagName) < 0 || isBlocked(target, blockClass, blockSelector, true)) {
        return;
      }
      const type = target.type;
      if (target.classList.contains(ignoreClass)) {
        return;
      }
      let text = target.value;
      let isChecked = false;
      if (type === "radio" || type === "checkbox") {
        isChecked = target.checked;
      } else if (maskInputOptions[target.tagName.toLowerCase()] || maskInputOptions[type]) {
        text = maskInputValue({
          maskInputOptions,
          tagName: target.tagName,
          type,
          value: text,
          maskInputFn
        });
      }
      cbWithDedup(target, wrapEventWithUserTriggeredFlag({ text, isChecked, userTriggered }, userTriggeredOnInput));
      const name = target.name;
      if (type === "radio" && name && isChecked) {
        doc.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach((el) => {
          if (el !== target) {
            cbWithDedup(el, wrapEventWithUserTriggeredFlag({
              text: el.value,
              isChecked: !isChecked,
              userTriggered: false
            }, userTriggeredOnInput));
          }
        });
      }
    }
    function cbWithDedup(target, v2) {
      const lastInputValue = lastInputValueMap.get(target);
      if (!lastInputValue || lastInputValue.text !== v2.text || lastInputValue.isChecked !== v2.isChecked) {
        lastInputValueMap.set(target, v2);
        const id = mirror2.getId(target);
        inputCb(Object.assign(Object.assign({}, v2), { id }));
      }
    }
    const events = sampling.input === "last" ? ["change"] : ["input", "change"];
    const handlers = events.map((eventName) => on(eventName, eventHandler, doc));
    const currentWindow = doc.defaultView;
    if (!currentWindow) {
      return () => {
        handlers.forEach((h2) => h2());
      };
    }
    const propertyDescriptor = currentWindow.Object.getOwnPropertyDescriptor(currentWindow.HTMLInputElement.prototype, "value");
    const hookProperties = [
      [currentWindow.HTMLInputElement.prototype, "value"],
      [currentWindow.HTMLInputElement.prototype, "checked"],
      [currentWindow.HTMLSelectElement.prototype, "value"],
      [currentWindow.HTMLTextAreaElement.prototype, "value"],
      [currentWindow.HTMLSelectElement.prototype, "selectedIndex"],
      [currentWindow.HTMLOptionElement.prototype, "selected"]
    ];
    if (propertyDescriptor && propertyDescriptor.set) {
      handlers.push(...hookProperties.map((p2) => hookSetter(p2[0], p2[1], {
        set() {
          eventHandler({ target: this });
        }
      }, false, currentWindow)));
    }
    return () => {
      handlers.forEach((h2) => h2());
    };
  }
  function getNestedCSSRulePositions(rule) {
    const positions = [];
    function recurse(childRule, pos) {
      if (isCSSGroupingRuleSupported && childRule.parentRule instanceof CSSGroupingRule || isCSSMediaRuleSupported && childRule.parentRule instanceof CSSMediaRule || isCSSSupportsRuleSupported && childRule.parentRule instanceof CSSSupportsRule || isCSSConditionRuleSupported && childRule.parentRule instanceof CSSConditionRule) {
        const rules = Array.from(childRule.parentRule.cssRules);
        const index = rules.indexOf(childRule);
        pos.unshift(index);
      } else if (childRule.parentStyleSheet) {
        const rules = Array.from(childRule.parentStyleSheet.cssRules);
        const index = rules.indexOf(childRule);
        pos.unshift(index);
      }
      return pos;
    }
    return recurse(rule, positions);
  }
  function getIdAndStyleId(sheet, mirror2, styleMirror) {
    let id, styleId;
    if (!sheet)
      return {};
    if (sheet.ownerNode)
      id = mirror2.getId(sheet.ownerNode);
    else
      styleId = styleMirror.getId(sheet);
    return {
      styleId,
      id
    };
  }
  function initStyleSheetObserver({ styleSheetRuleCb, mirror: mirror2, stylesheetManager }, { win }) {
    const insertRule = win.CSSStyleSheet.prototype.insertRule;
    win.CSSStyleSheet.prototype.insertRule = function(rule, index) {
      const { id, styleId } = getIdAndStyleId(this, mirror2, stylesheetManager.styleMirror);
      if (id && id !== -1 || styleId && styleId !== -1) {
        styleSheetRuleCb({
          id,
          styleId,
          adds: [{ rule, index }]
        });
      }
      return insertRule.apply(this, [rule, index]);
    };
    const deleteRule = win.CSSStyleSheet.prototype.deleteRule;
    win.CSSStyleSheet.prototype.deleteRule = function(index) {
      const { id, styleId } = getIdAndStyleId(this, mirror2, stylesheetManager.styleMirror);
      if (id && id !== -1 || styleId && styleId !== -1) {
        styleSheetRuleCb({
          id,
          styleId,
          removes: [{ index }]
        });
      }
      return deleteRule.apply(this, [index]);
    };
    let replace;
    if (win.CSSStyleSheet.prototype.replace) {
      replace = win.CSSStyleSheet.prototype.replace;
      win.CSSStyleSheet.prototype.replace = function(text) {
        const { id, styleId } = getIdAndStyleId(this, mirror2, stylesheetManager.styleMirror);
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id,
            styleId,
            replace: text
          });
        }
        return replace.apply(this, [text]);
      };
    }
    let replaceSync;
    if (win.CSSStyleSheet.prototype.replaceSync) {
      replaceSync = win.CSSStyleSheet.prototype.replaceSync;
      win.CSSStyleSheet.prototype.replaceSync = function(text) {
        const { id, styleId } = getIdAndStyleId(this, mirror2, stylesheetManager.styleMirror);
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id,
            styleId,
            replaceSync: text
          });
        }
        return replaceSync.apply(this, [text]);
      };
    }
    const supportedNestedCSSRuleTypes = {};
    if (isCSSGroupingRuleSupported) {
      supportedNestedCSSRuleTypes.CSSGroupingRule = win.CSSGroupingRule;
    } else {
      if (isCSSMediaRuleSupported) {
        supportedNestedCSSRuleTypes.CSSMediaRule = win.CSSMediaRule;
      }
      if (isCSSConditionRuleSupported) {
        supportedNestedCSSRuleTypes.CSSConditionRule = win.CSSConditionRule;
      }
      if (isCSSSupportsRuleSupported) {
        supportedNestedCSSRuleTypes.CSSSupportsRule = win.CSSSupportsRule;
      }
    }
    const unmodifiedFunctions = {};
    Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
      unmodifiedFunctions[typeKey] = {
        insertRule: type.prototype.insertRule,
        deleteRule: type.prototype.deleteRule
      };
      type.prototype.insertRule = function(rule, index) {
        const { id, styleId } = getIdAndStyleId(this.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id,
            styleId,
            adds: [
              {
                rule,
                index: [
                  ...getNestedCSSRulePositions(this),
                  index || 0
                ]
              }
            ]
          });
        }
        return unmodifiedFunctions[typeKey].insertRule.apply(this, [rule, index]);
      };
      type.prototype.deleteRule = function(index) {
        const { id, styleId } = getIdAndStyleId(this.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id,
            styleId,
            removes: [
              { index: [...getNestedCSSRulePositions(this), index] }
            ]
          });
        }
        return unmodifiedFunctions[typeKey].deleteRule.apply(this, [index]);
      };
    });
    return () => {
      win.CSSStyleSheet.prototype.insertRule = insertRule;
      win.CSSStyleSheet.prototype.deleteRule = deleteRule;
      replace && (win.CSSStyleSheet.prototype.replace = replace);
      replaceSync && (win.CSSStyleSheet.prototype.replaceSync = replaceSync);
      Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
        type.prototype.insertRule = unmodifiedFunctions[typeKey].insertRule;
        type.prototype.deleteRule = unmodifiedFunctions[typeKey].deleteRule;
      });
    };
  }
  function initAdoptedStyleSheetObserver({ mirror: mirror2, stylesheetManager }, host) {
    var _a, _b, _c;
    let hostId = null;
    if (host.nodeName === "#document")
      hostId = mirror2.getId(host);
    else
      hostId = mirror2.getId(host.host);
    const patchTarget = host.nodeName === "#document" ? (_a = host.defaultView) === null || _a === void 0 ? void 0 : _a.Document : (_c = (_b = host.ownerDocument) === null || _b === void 0 ? void 0 : _b.defaultView) === null || _c === void 0 ? void 0 : _c.ShadowRoot;
    const originalPropertyDescriptor = Object.getOwnPropertyDescriptor(patchTarget === null || patchTarget === void 0 ? void 0 : patchTarget.prototype, "adoptedStyleSheets");
    if (hostId === null || hostId === -1 || !patchTarget || !originalPropertyDescriptor)
      return () => {
      };
    Object.defineProperty(host, "adoptedStyleSheets", {
      configurable: originalPropertyDescriptor.configurable,
      enumerable: originalPropertyDescriptor.enumerable,
      get() {
        var _a2;
        return (_a2 = originalPropertyDescriptor.get) === null || _a2 === void 0 ? void 0 : _a2.call(this);
      },
      set(sheets) {
        var _a2;
        const result = (_a2 = originalPropertyDescriptor.set) === null || _a2 === void 0 ? void 0 : _a2.call(this, sheets);
        if (hostId !== null && hostId !== -1) {
          try {
            stylesheetManager.adoptStyleSheets(sheets, hostId);
          } catch (e2) {
          }
        }
        return result;
      }
    });
    return () => {
      Object.defineProperty(host, "adoptedStyleSheets", {
        configurable: originalPropertyDescriptor.configurable,
        enumerable: originalPropertyDescriptor.enumerable,
        get: originalPropertyDescriptor.get,
        set: originalPropertyDescriptor.set
      });
    };
  }
  function initStyleDeclarationObserver({ styleDeclarationCb, mirror: mirror2, ignoreCSSAttributes, stylesheetManager }, { win }) {
    const setProperty = win.CSSStyleDeclaration.prototype.setProperty;
    win.CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
      var _a;
      if (ignoreCSSAttributes.has(property)) {
        return setProperty.apply(this, [property, value, priority]);
      }
      const { id, styleId } = getIdAndStyleId((_a = this.parentRule) === null || _a === void 0 ? void 0 : _a.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
      if (id && id !== -1 || styleId && styleId !== -1) {
        styleDeclarationCb({
          id,
          styleId,
          set: {
            property,
            value,
            priority
          },
          index: getNestedCSSRulePositions(this.parentRule)
        });
      }
      return setProperty.apply(this, [property, value, priority]);
    };
    const removeProperty = win.CSSStyleDeclaration.prototype.removeProperty;
    win.CSSStyleDeclaration.prototype.removeProperty = function(property) {
      var _a;
      if (ignoreCSSAttributes.has(property)) {
        return removeProperty.apply(this, [property]);
      }
      const { id, styleId } = getIdAndStyleId((_a = this.parentRule) === null || _a === void 0 ? void 0 : _a.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
      if (id && id !== -1 || styleId && styleId !== -1) {
        styleDeclarationCb({
          id,
          styleId,
          remove: {
            property
          },
          index: getNestedCSSRulePositions(this.parentRule)
        });
      }
      return removeProperty.apply(this, [property]);
    };
    return () => {
      win.CSSStyleDeclaration.prototype.setProperty = setProperty;
      win.CSSStyleDeclaration.prototype.removeProperty = removeProperty;
    };
  }
  function initMediaInteractionObserver({ mediaInteractionCb, blockClass, blockSelector, mirror: mirror2, sampling }) {
    const handler = (type) => throttle((event) => {
      const target = getEventTarget(event);
      if (!target || isBlocked(target, blockClass, blockSelector, true)) {
        return;
      }
      const { currentTime, volume, muted, playbackRate } = target;
      mediaInteractionCb({
        type,
        id: mirror2.getId(target),
        currentTime,
        volume,
        muted,
        playbackRate
      });
    }, sampling.media || 500);
    const handlers = [
      on("play", handler(0)),
      on("pause", handler(1)),
      on("seeked", handler(2)),
      on("volumechange", handler(3)),
      on("ratechange", handler(4))
    ];
    return () => {
      handlers.forEach((h2) => h2());
    };
  }
  function initFontObserver({ fontCb, doc }) {
    const win = doc.defaultView;
    if (!win) {
      return () => {
      };
    }
    const handlers = [];
    const fontMap = /* @__PURE__ */ new WeakMap();
    const originalFontFace = win.FontFace;
    win.FontFace = function FontFace(family, source, descriptors) {
      const fontFace = new originalFontFace(family, source, descriptors);
      fontMap.set(fontFace, {
        family,
        buffer: typeof source !== "string",
        descriptors,
        fontSource: typeof source === "string" ? source : JSON.stringify(Array.from(new Uint8Array(source)))
      });
      return fontFace;
    };
    const restoreHandler = patch(doc.fonts, "add", function(original) {
      return function(fontFace) {
        setTimeout(() => {
          const p2 = fontMap.get(fontFace);
          if (p2) {
            fontCb(p2);
            fontMap.delete(fontFace);
          }
        }, 0);
        return original.apply(this, [fontFace]);
      };
    });
    handlers.push(() => {
      win.FontFace = originalFontFace;
    });
    handlers.push(restoreHandler);
    return () => {
      handlers.forEach((h2) => h2());
    };
  }
  function initSelectionObserver(param) {
    const { doc, mirror: mirror2, blockClass, blockSelector, selectionCb } = param;
    let collapsed = true;
    const updateSelection = () => {
      const selection = doc.getSelection();
      if (!selection || collapsed && (selection === null || selection === void 0 ? void 0 : selection.isCollapsed))
        return;
      collapsed = selection.isCollapsed || false;
      const ranges = [];
      const count = selection.rangeCount || 0;
      for (let i2 = 0; i2 < count; i2++) {
        const range = selection.getRangeAt(i2);
        const { startContainer, startOffset, endContainer, endOffset } = range;
        const blocked = isBlocked(startContainer, blockClass, blockSelector, true) || isBlocked(endContainer, blockClass, blockSelector, true);
        if (blocked)
          continue;
        ranges.push({
          start: mirror2.getId(startContainer),
          startOffset,
          end: mirror2.getId(endContainer),
          endOffset
        });
      }
      selectionCb({ ranges });
    };
    updateSelection();
    return on("selectionchange", updateSelection);
  }
  function mergeHooks(o2, hooks) {
    const { mutationCb, mousemoveCb, mouseInteractionCb, scrollCb, viewportResizeCb, inputCb, mediaInteractionCb, styleSheetRuleCb, styleDeclarationCb, canvasMutationCb, fontCb, selectionCb } = o2;
    o2.mutationCb = (...p2) => {
      if (hooks.mutation) {
        hooks.mutation(...p2);
      }
      mutationCb(...p2);
    };
    o2.mousemoveCb = (...p2) => {
      if (hooks.mousemove) {
        hooks.mousemove(...p2);
      }
      mousemoveCb(...p2);
    };
    o2.mouseInteractionCb = (...p2) => {
      if (hooks.mouseInteraction) {
        hooks.mouseInteraction(...p2);
      }
      mouseInteractionCb(...p2);
    };
    o2.scrollCb = (...p2) => {
      if (hooks.scroll) {
        hooks.scroll(...p2);
      }
      scrollCb(...p2);
    };
    o2.viewportResizeCb = (...p2) => {
      if (hooks.viewportResize) {
        hooks.viewportResize(...p2);
      }
      viewportResizeCb(...p2);
    };
    o2.inputCb = (...p2) => {
      if (hooks.input) {
        hooks.input(...p2);
      }
      inputCb(...p2);
    };
    o2.mediaInteractionCb = (...p2) => {
      if (hooks.mediaInteaction) {
        hooks.mediaInteaction(...p2);
      }
      mediaInteractionCb(...p2);
    };
    o2.styleSheetRuleCb = (...p2) => {
      if (hooks.styleSheetRule) {
        hooks.styleSheetRule(...p2);
      }
      styleSheetRuleCb(...p2);
    };
    o2.styleDeclarationCb = (...p2) => {
      if (hooks.styleDeclaration) {
        hooks.styleDeclaration(...p2);
      }
      styleDeclarationCb(...p2);
    };
    o2.canvasMutationCb = (...p2) => {
      if (hooks.canvasMutation) {
        hooks.canvasMutation(...p2);
      }
      canvasMutationCb(...p2);
    };
    o2.fontCb = (...p2) => {
      if (hooks.font) {
        hooks.font(...p2);
      }
      fontCb(...p2);
    };
    o2.selectionCb = (...p2) => {
      if (hooks.selection) {
        hooks.selection(...p2);
      }
      selectionCb(...p2);
    };
  }
  function initObservers(o2, hooks = {}) {
    const currentWindow = o2.doc.defaultView;
    if (!currentWindow) {
      return () => {
      };
    }
    mergeHooks(o2, hooks);
    const mutationObserver = initMutationObserver(o2, o2.doc);
    const mousemoveHandler = initMoveObserver(o2);
    const mouseInteractionHandler = initMouseInteractionObserver(o2);
    const scrollHandler = initScrollObserver(o2);
    const viewportResizeHandler = initViewportResizeObserver(o2);
    const inputHandler = initInputObserver(o2);
    const mediaInteractionHandler = initMediaInteractionObserver(o2);
    const styleSheetObserver = initStyleSheetObserver(o2, { win: currentWindow });
    const adoptedStyleSheetObserver = initAdoptedStyleSheetObserver(o2, o2.doc);
    const styleDeclarationObserver = initStyleDeclarationObserver(o2, {
      win: currentWindow
    });
    const fontObserver = o2.collectFonts ? initFontObserver(o2) : () => {
    };
    const selectionObserver = initSelectionObserver(o2);
    const pluginHandlers = [];
    for (const plugin of o2.plugins) {
      pluginHandlers.push(plugin.observer(plugin.callback, currentWindow, plugin.options));
    }
    return () => {
      mutationBuffers.forEach((b2) => b2.reset());
      mutationObserver.disconnect();
      mousemoveHandler();
      mouseInteractionHandler();
      scrollHandler();
      viewportResizeHandler();
      inputHandler();
      mediaInteractionHandler();
      styleSheetObserver();
      adoptedStyleSheetObserver();
      styleDeclarationObserver();
      fontObserver();
      selectionObserver();
      pluginHandlers.forEach((h2) => h2());
    };
  }

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/cross-origin-iframe-mirror.js
  var CrossOriginIframeMirror = class {
    constructor(generateIdFn) {
      this.generateIdFn = generateIdFn;
      this.iframeIdToRemoteIdMap = /* @__PURE__ */ new WeakMap();
      this.iframeRemoteIdToIdMap = /* @__PURE__ */ new WeakMap();
    }
    getId(iframe, remoteId, idToRemoteMap, remoteToIdMap) {
      const idToRemoteIdMap = idToRemoteMap || this.getIdToRemoteIdMap(iframe);
      const remoteIdToIdMap = remoteToIdMap || this.getRemoteIdToIdMap(iframe);
      let id = idToRemoteIdMap.get(remoteId);
      if (!id) {
        id = this.generateIdFn();
        idToRemoteIdMap.set(remoteId, id);
        remoteIdToIdMap.set(id, remoteId);
      }
      return id;
    }
    getIds(iframe, remoteId) {
      const idToRemoteIdMap = this.getIdToRemoteIdMap(iframe);
      const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
      return remoteId.map((id) => this.getId(iframe, id, idToRemoteIdMap, remoteIdToIdMap));
    }
    getRemoteId(iframe, id, map) {
      const remoteIdToIdMap = map || this.getRemoteIdToIdMap(iframe);
      if (typeof id !== "number")
        return id;
      const remoteId = remoteIdToIdMap.get(id);
      if (!remoteId)
        return -1;
      return remoteId;
    }
    getRemoteIds(iframe, ids) {
      const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
      return ids.map((id) => this.getRemoteId(iframe, id, remoteIdToIdMap));
    }
    reset(iframe) {
      if (!iframe) {
        this.iframeIdToRemoteIdMap = /* @__PURE__ */ new WeakMap();
        this.iframeRemoteIdToIdMap = /* @__PURE__ */ new WeakMap();
        return;
      }
      this.iframeIdToRemoteIdMap.delete(iframe);
      this.iframeRemoteIdToIdMap.delete(iframe);
    }
    getIdToRemoteIdMap(iframe) {
      let idToRemoteIdMap = this.iframeIdToRemoteIdMap.get(iframe);
      if (!idToRemoteIdMap) {
        idToRemoteIdMap = /* @__PURE__ */ new Map();
        this.iframeIdToRemoteIdMap.set(iframe, idToRemoteIdMap);
      }
      return idToRemoteIdMap;
    }
    getRemoteIdToIdMap(iframe) {
      let remoteIdToIdMap = this.iframeRemoteIdToIdMap.get(iframe);
      if (!remoteIdToIdMap) {
        remoteIdToIdMap = /* @__PURE__ */ new Map();
        this.iframeRemoteIdToIdMap.set(iframe, remoteIdToIdMap);
      }
      return remoteIdToIdMap;
    }
  };

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/iframe-manager.js
  var IframeManager = class {
    constructor(options) {
      this.iframes = /* @__PURE__ */ new WeakMap();
      this.crossOriginIframeMap = /* @__PURE__ */ new WeakMap();
      this.crossOriginIframeMirror = new CrossOriginIframeMirror(genId);
      this.mutationCb = options.mutationCb;
      this.wrappedEmit = options.wrappedEmit;
      this.stylesheetManager = options.stylesheetManager;
      this.recordCrossOriginIframes = options.recordCrossOriginIframes;
      this.crossOriginIframeStyleMirror = new CrossOriginIframeMirror(this.stylesheetManager.styleMirror.generateId.bind(this.stylesheetManager.styleMirror));
      this.mirror = options.mirror;
      if (this.recordCrossOriginIframes) {
        window.addEventListener("message", this.handleMessage.bind(this));
      }
    }
    addIframe(iframeEl) {
      this.iframes.set(iframeEl, true);
      if (iframeEl.contentWindow)
        this.crossOriginIframeMap.set(iframeEl.contentWindow, iframeEl);
    }
    addLoadListener(cb) {
      this.loadListener = cb;
    }
    attachIframe(iframeEl, childSn) {
      var _a;
      this.mutationCb({
        adds: [
          {
            parentId: this.mirror.getId(iframeEl),
            nextId: null,
            node: childSn
          }
        ],
        removes: [],
        texts: [],
        attributes: [],
        isAttachIframe: true
      });
      (_a = this.loadListener) === null || _a === void 0 ? void 0 : _a.call(this, iframeEl);
      if (iframeEl.contentDocument && iframeEl.contentDocument.adoptedStyleSheets && iframeEl.contentDocument.adoptedStyleSheets.length > 0)
        this.stylesheetManager.adoptStyleSheets(iframeEl.contentDocument.adoptedStyleSheets, this.mirror.getId(iframeEl.contentDocument));
    }
    handleMessage(message) {
      if (message.data.type === "rrweb") {
        const iframeSourceWindow = message.source;
        if (!iframeSourceWindow)
          return;
        const iframeEl = this.crossOriginIframeMap.get(message.source);
        if (!iframeEl)
          return;
        const transformedEvent = this.transformCrossOriginEvent(iframeEl, message.data.event);
        if (transformedEvent)
          this.wrappedEmit(transformedEvent, message.data.isCheckout);
      }
    }
    transformCrossOriginEvent(iframeEl, e2) {
      var _a;
      switch (e2.type) {
        case EventType.FullSnapshot: {
          this.crossOriginIframeMirror.reset(iframeEl);
          this.crossOriginIframeStyleMirror.reset(iframeEl);
          this.replaceIdOnNode(e2.data.node, iframeEl);
          return {
            timestamp: e2.timestamp,
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.Mutation,
              adds: [
                {
                  parentId: this.mirror.getId(iframeEl),
                  nextId: null,
                  node: e2.data.node
                }
              ],
              removes: [],
              texts: [],
              attributes: [],
              isAttachIframe: true
            }
          };
        }
        case EventType.Meta:
        case EventType.Load:
        case EventType.DomContentLoaded: {
          return false;
        }
        case EventType.Plugin: {
          return e2;
        }
        case EventType.Custom: {
          this.replaceIds(e2.data.payload, iframeEl, ["id", "parentId", "previousId", "nextId"]);
          return e2;
        }
        case EventType.IncrementalSnapshot: {
          switch (e2.data.source) {
            case IncrementalSource.Mutation: {
              e2.data.adds.forEach((n2) => {
                this.replaceIds(n2, iframeEl, [
                  "parentId",
                  "nextId",
                  "previousId"
                ]);
                this.replaceIdOnNode(n2.node, iframeEl);
              });
              e2.data.removes.forEach((n2) => {
                this.replaceIds(n2, iframeEl, ["parentId", "id"]);
              });
              e2.data.attributes.forEach((n2) => {
                this.replaceIds(n2, iframeEl, ["id"]);
              });
              e2.data.texts.forEach((n2) => {
                this.replaceIds(n2, iframeEl, ["id"]);
              });
              return e2;
            }
            case IncrementalSource.Drag:
            case IncrementalSource.TouchMove:
            case IncrementalSource.MouseMove: {
              e2.data.positions.forEach((p2) => {
                this.replaceIds(p2, iframeEl, ["id"]);
              });
              return e2;
            }
            case IncrementalSource.ViewportResize: {
              return false;
            }
            case IncrementalSource.MediaInteraction:
            case IncrementalSource.MouseInteraction:
            case IncrementalSource.Scroll:
            case IncrementalSource.CanvasMutation:
            case IncrementalSource.Input: {
              this.replaceIds(e2.data, iframeEl, ["id"]);
              return e2;
            }
            case IncrementalSource.StyleSheetRule:
            case IncrementalSource.StyleDeclaration: {
              this.replaceIds(e2.data, iframeEl, ["id"]);
              this.replaceStyleIds(e2.data, iframeEl, ["styleId"]);
              return e2;
            }
            case IncrementalSource.Font: {
              return e2;
            }
            case IncrementalSource.Selection: {
              e2.data.ranges.forEach((range) => {
                this.replaceIds(range, iframeEl, ["start", "end"]);
              });
              return e2;
            }
            case IncrementalSource.AdoptedStyleSheet: {
              this.replaceIds(e2.data, iframeEl, ["id"]);
              this.replaceStyleIds(e2.data, iframeEl, ["styleIds"]);
              (_a = e2.data.styles) === null || _a === void 0 ? void 0 : _a.forEach((style) => {
                this.replaceStyleIds(style, iframeEl, ["styleId"]);
              });
              return e2;
            }
          }
        }
      }
    }
    replace(iframeMirror, obj, iframeEl, keys) {
      for (const key of keys) {
        if (!Array.isArray(obj[key]) && typeof obj[key] !== "number")
          continue;
        if (Array.isArray(obj[key])) {
          obj[key] = iframeMirror.getIds(iframeEl, obj[key]);
        } else {
          obj[key] = iframeMirror.getId(iframeEl, obj[key]);
        }
      }
      return obj;
    }
    replaceIds(obj, iframeEl, keys) {
      return this.replace(this.crossOriginIframeMirror, obj, iframeEl, keys);
    }
    replaceStyleIds(obj, iframeEl, keys) {
      return this.replace(this.crossOriginIframeStyleMirror, obj, iframeEl, keys);
    }
    replaceIdOnNode(node, iframeEl) {
      this.replaceIds(node, iframeEl, ["id"]);
      if ("childNodes" in node) {
        node.childNodes.forEach((child) => {
          this.replaceIdOnNode(child, iframeEl);
        });
      }
    }
  };

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/shadow-dom-manager.js
  var ShadowDomManager = class {
    constructor(options) {
      this.shadowDoms = /* @__PURE__ */ new WeakSet();
      this.restorePatches = [];
      this.mutationCb = options.mutationCb;
      this.scrollCb = options.scrollCb;
      this.bypassOptions = options.bypassOptions;
      this.mirror = options.mirror;
      const manager = this;
      this.restorePatches.push(patch(Element.prototype, "attachShadow", function(original) {
        return function(option) {
          const shadowRoot = original.call(this, option);
          if (this.shadowRoot)
            manager.addShadowRoot(this.shadowRoot, this.ownerDocument);
          return shadowRoot;
        };
      }));
    }
    addShadowRoot(shadowRoot, doc) {
      if (!isNativeShadowDom(shadowRoot))
        return;
      if (this.shadowDoms.has(shadowRoot))
        return;
      this.shadowDoms.add(shadowRoot);
      initMutationObserver(Object.assign(Object.assign({}, this.bypassOptions), { doc, mutationCb: this.mutationCb, mirror: this.mirror, shadowDomManager: this }), shadowRoot);
      initScrollObserver(Object.assign(Object.assign({}, this.bypassOptions), { scrollCb: this.scrollCb, doc: shadowRoot, mirror: this.mirror }));
      setTimeout(() => {
        if (shadowRoot.adoptedStyleSheets && shadowRoot.adoptedStyleSheets.length > 0)
          this.bypassOptions.stylesheetManager.adoptStyleSheets(shadowRoot.adoptedStyleSheets, this.mirror.getId(shadowRoot.host));
        initAdoptedStyleSheetObserver({
          mirror: this.mirror,
          stylesheetManager: this.bypassOptions.stylesheetManager
        }, shadowRoot);
      }, 0);
    }
    observeAttachShadow(iframeElement) {
      if (iframeElement.contentWindow) {
        const manager = this;
        this.restorePatches.push(patch(iframeElement.contentWindow.HTMLElement.prototype, "attachShadow", function(original) {
          return function(option) {
            const shadowRoot = original.call(this, option);
            if (this.shadowRoot)
              manager.addShadowRoot(this.shadowRoot, iframeElement.contentDocument);
            return shadowRoot;
          };
        }));
      }
    }
    reset() {
      this.restorePatches.forEach((restorePatch) => restorePatch());
      this.shadowDoms = /* @__PURE__ */ new WeakSet();
    }
  };

  // node_modules/rrweb/es/rrweb/ext/tslib/tslib.es6.js
  function __rest(s2, e2) {
    var t2 = {};
    for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e2.indexOf(p2) < 0)
      t2[p2] = s2[p2];
    if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
        if (e2.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
          t2[p2[i2]] = s2[p2[i2]];
      }
    return t2;
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e2) {
          reject(e2);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e2) {
          reject(e2);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  // node_modules/rrweb/es/rrweb/ext/base64-arraybuffer/dist/base64-arraybuffer.es5.js
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
  for (i2 = 0; i2 < chars.length; i2++) {
    lookup[chars.charCodeAt(i2)] = i2;
  }
  var i2;
  var encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer), i2, len = bytes.length, base64 = "";
    for (i2 = 0; i2 < len; i2 += 3) {
      base64 += chars[bytes[i2] >> 2];
      base64 += chars[(bytes[i2] & 3) << 4 | bytes[i2 + 1] >> 4];
      base64 += chars[(bytes[i2 + 1] & 15) << 2 | bytes[i2 + 2] >> 6];
      base64 += chars[bytes[i2 + 2] & 63];
    }
    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }
    return base64;
  };

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/observers/canvas/serialize-args.js
  var canvasVarMap = /* @__PURE__ */ new Map();
  function variableListFor(ctx, ctor) {
    let contextMap = canvasVarMap.get(ctx);
    if (!contextMap) {
      contextMap = /* @__PURE__ */ new Map();
      canvasVarMap.set(ctx, contextMap);
    }
    if (!contextMap.has(ctor)) {
      contextMap.set(ctor, []);
    }
    return contextMap.get(ctor);
  }
  var saveWebGLVar = (value, win, ctx) => {
    if (!value || !(isInstanceOfWebGLObject(value, win) || typeof value === "object"))
      return;
    const name = value.constructor.name;
    const list = variableListFor(ctx, name);
    let index = list.indexOf(value);
    if (index === -1) {
      index = list.length;
      list.push(value);
    }
    return index;
  };
  function serializeArg(value, win, ctx) {
    if (value instanceof Array) {
      return value.map((arg) => serializeArg(arg, win, ctx));
    } else if (value === null) {
      return value;
    } else if (value instanceof Float32Array || value instanceof Float64Array || value instanceof Int32Array || value instanceof Uint32Array || value instanceof Uint8Array || value instanceof Uint16Array || value instanceof Int16Array || value instanceof Int8Array || value instanceof Uint8ClampedArray) {
      const name = value.constructor.name;
      return {
        rr_type: name,
        args: [Object.values(value)]
      };
    } else if (value instanceof ArrayBuffer) {
      const name = value.constructor.name;
      const base64 = encode(value);
      return {
        rr_type: name,
        base64
      };
    } else if (value instanceof DataView) {
      const name = value.constructor.name;
      return {
        rr_type: name,
        args: [
          serializeArg(value.buffer, win, ctx),
          value.byteOffset,
          value.byteLength
        ]
      };
    } else if (value instanceof HTMLImageElement) {
      const name = value.constructor.name;
      const { src } = value;
      return {
        rr_type: name,
        src
      };
    } else if (value instanceof HTMLCanvasElement) {
      const name = "HTMLImageElement";
      const src = value.toDataURL();
      return {
        rr_type: name,
        src
      };
    } else if (value instanceof ImageData) {
      const name = value.constructor.name;
      return {
        rr_type: name,
        args: [serializeArg(value.data, win, ctx), value.width, value.height]
      };
    } else if (isInstanceOfWebGLObject(value, win) || typeof value === "object") {
      const name = value.constructor.name;
      const index = saveWebGLVar(value, win, ctx);
      return {
        rr_type: name,
        index
      };
    }
    return value;
  }
  var serializeArgs = (args, win, ctx) => {
    return [...args].map((arg) => serializeArg(arg, win, ctx));
  };
  var isInstanceOfWebGLObject = (value, win) => {
    const webGLConstructorNames = [
      "WebGLActiveInfo",
      "WebGLBuffer",
      "WebGLFramebuffer",
      "WebGLProgram",
      "WebGLRenderbuffer",
      "WebGLShader",
      "WebGLShaderPrecisionFormat",
      "WebGLTexture",
      "WebGLUniformLocation",
      "WebGLVertexArrayObject",
      "WebGLVertexArrayObjectOES"
    ];
    const supportedWebGLConstructorNames = webGLConstructorNames.filter((name) => typeof win[name] === "function");
    return Boolean(supportedWebGLConstructorNames.find((name) => value instanceof win[name]));
  };

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/observers/canvas/2d.js
  function initCanvas2DMutationObserver(cb, win, blockClass, blockSelector) {
    const handlers = [];
    const props2D = Object.getOwnPropertyNames(win.CanvasRenderingContext2D.prototype);
    for (const prop of props2D) {
      try {
        if (typeof win.CanvasRenderingContext2D.prototype[prop] !== "function") {
          continue;
        }
        const restoreHandler = patch(win.CanvasRenderingContext2D.prototype, prop, function(original) {
          return function(...args) {
            if (!isBlocked(this.canvas, blockClass, blockSelector, true)) {
              setTimeout(() => {
                const recordArgs = serializeArgs([...args], win, this);
                cb(this.canvas, {
                  type: CanvasContext["2D"],
                  property: prop,
                  args: recordArgs
                });
              }, 0);
            }
            return original.apply(this, args);
          };
        });
        handlers.push(restoreHandler);
      } catch (_a) {
        const hookHandler = hookSetter(win.CanvasRenderingContext2D.prototype, prop, {
          set(v2) {
            cb(this.canvas, {
              type: CanvasContext["2D"],
              property: prop,
              args: [v2],
              setter: true
            });
          }
        });
        handlers.push(hookHandler);
      }
    }
    return () => {
      handlers.forEach((h2) => h2());
    };
  }

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/observers/canvas/canvas.js
  function initCanvasContextObserver(win, blockClass, blockSelector) {
    const handlers = [];
    try {
      const restoreHandler = patch(win.HTMLCanvasElement.prototype, "getContext", function(original) {
        return function(contextType, ...args) {
          if (!isBlocked(this, blockClass, blockSelector, true)) {
            if (!("__context" in this))
              this.__context = contextType;
          }
          return original.apply(this, [contextType, ...args]);
        };
      });
      handlers.push(restoreHandler);
    } catch (_a) {
      console.error("failed to patch HTMLCanvasElement.prototype.getContext");
    }
    return () => {
      handlers.forEach((h2) => h2());
    };
  }

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/observers/canvas/webgl.js
  function patchGLPrototype(prototype, type, cb, blockClass, blockSelector, mirror2, win) {
    const handlers = [];
    const props = Object.getOwnPropertyNames(prototype);
    for (const prop of props) {
      if ([
        "isContextLost",
        "canvas",
        "drawingBufferWidth",
        "drawingBufferHeight"
      ].includes(prop)) {
        continue;
      }
      try {
        if (typeof prototype[prop] !== "function") {
          continue;
        }
        const restoreHandler = patch(prototype, prop, function(original) {
          return function(...args) {
            const result = original.apply(this, args);
            saveWebGLVar(result, win, this);
            if (!isBlocked(this.canvas, blockClass, blockSelector, true)) {
              const recordArgs = serializeArgs([...args], win, this);
              const mutation = {
                type,
                property: prop,
                args: recordArgs
              };
              cb(this.canvas, mutation);
            }
            return result;
          };
        });
        handlers.push(restoreHandler);
      } catch (_a) {
        const hookHandler = hookSetter(prototype, prop, {
          set(v2) {
            cb(this.canvas, {
              type,
              property: prop,
              args: [v2],
              setter: true
            });
          }
        });
        handlers.push(hookHandler);
      }
    }
    return handlers;
  }
  function initCanvasWebGLMutationObserver(cb, win, blockClass, blockSelector, mirror2) {
    const handlers = [];
    handlers.push(...patchGLPrototype(win.WebGLRenderingContext.prototype, CanvasContext.WebGL, cb, blockClass, blockSelector, mirror2, win));
    if (typeof win.WebGL2RenderingContext !== "undefined") {
      handlers.push(...patchGLPrototype(win.WebGL2RenderingContext.prototype, CanvasContext.WebGL2, cb, blockClass, blockSelector, mirror2, win));
    }
    return () => {
      handlers.forEach((h2) => h2());
    };
  }

  // node_modules/rrweb/es/rrweb/_virtual/_rollup-plugin-web-worker-loader__helper__node__WorkerClass.js
  var WorkerClass = null;
  try {
    WorkerThreads = typeof module !== "undefined" && typeof module.require === "function" && module.require("worker_threads") || typeof __non_webpack_require__ === "function" && __non_webpack_require__("worker_threads") || typeof __require === "function" && __require("worker_threads");
    WorkerClass = WorkerThreads.Worker;
  } catch (e2) {
  }
  var WorkerThreads;

  // node_modules/rrweb/es/rrweb/_virtual/_rollup-plugin-web-worker-loader__helper__node__createBase64WorkerFactory.js
  function decodeBase64(base64, enableUnicode) {
    return Buffer.from(base64, "base64").toString(enableUnicode ? "utf16" : "utf8");
  }
  function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
    var sourcemap = sourcemapArg === void 0 ? null : sourcemapArg;
    var enableUnicode = enableUnicodeArg === void 0 ? false : enableUnicodeArg;
    var source = decodeBase64(base64, enableUnicode);
    var start = source.indexOf("\n", 10) + 1;
    var body = source.substring(start) + (sourcemap ? "//# sourceMappingURL=" + sourcemap : "");
    return function WorkerFactory2(options) {
      return new WorkerClass(body, Object.assign({}, options, { eval: true }));
    };
  }

  // node_modules/rrweb/es/rrweb/_virtual/_rollup-plugin-web-worker-loader__helper__browser__createBase64WorkerFactory.js
  function decodeBase642(base64, enableUnicode) {
    var binaryString = atob(base64);
    if (enableUnicode) {
      var binaryView = new Uint8Array(binaryString.length);
      for (var i2 = 0, n2 = binaryString.length; i2 < n2; ++i2) {
        binaryView[i2] = binaryString.charCodeAt(i2);
      }
      return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
    }
    return binaryString;
  }
  function createURL(base64, sourcemapArg, enableUnicodeArg) {
    var sourcemap = sourcemapArg === void 0 ? null : sourcemapArg;
    var enableUnicode = enableUnicodeArg === void 0 ? false : enableUnicodeArg;
    var source = decodeBase642(base64, enableUnicode);
    var start = source.indexOf("\n", 10) + 1;
    var body = source.substring(start) + (sourcemap ? "//# sourceMappingURL=" + sourcemap : "");
    var blob = new Blob([body], { type: "application/javascript" });
    return URL.createObjectURL(blob);
  }
  function createBase64WorkerFactory2(base64, sourcemapArg, enableUnicodeArg) {
    var url;
    return function WorkerFactory2(options) {
      url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
      return new Worker(url, options);
    };
  }

  // node_modules/rrweb/es/rrweb/_virtual/_rollup-plugin-web-worker-loader__helper__auto__isNodeJS.js
  var kIsNodeJS = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
  function isNodeJS() {
    return kIsNodeJS;
  }

  // node_modules/rrweb/es/rrweb/_virtual/_rollup-plugin-web-worker-loader__helper__auto__createBase64WorkerFactory.js
  function createBase64WorkerFactory3(base64, sourcemapArg, enableUnicodeArg) {
    if (isNodeJS()) {
      return createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg);
    }
    return createBase64WorkerFactory2(base64, sourcemapArg, enableUnicodeArg);
  }

  // node_modules/rrweb/es/rrweb/_virtual/image-bitmap-data-url-worker.js
  var WorkerFactory = createBase64WorkerFactory3("Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIC8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKg0KICAgIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLg0KDQogICAgUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55DQogICAgcHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLg0KDQogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICJBUyBJUyIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEgNCiAgICBSRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkNCiAgICBBTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsDQogICAgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NDQogICAgTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1INCiAgICBPVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SDQogICAgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS4NCiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqLw0KDQogICAgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikgew0KICAgICAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH0NCiAgICAgICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7DQogICAgICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9DQogICAgICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvclsidGhyb3ciXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9DQogICAgICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfQ0KICAgICAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpOw0KICAgICAgICB9KTsNCiAgICB9CgogICAgLyoKICAgICAqIGJhc2U2NC1hcnJheWJ1ZmZlciAxLjAuMSA8aHR0cHM6Ly9naXRodWIuY29tL25pa2xhc3ZoL2Jhc2U2NC1hcnJheWJ1ZmZlcj4KICAgICAqIENvcHlyaWdodCAoYykgMjAyMSBOaWtsYXMgdm9uIEhlcnR6ZW4gPGh0dHBzOi8vaGVydHplbi5jb20+CiAgICAgKiBSZWxlYXNlZCB1bmRlciBNSVQgTGljZW5zZQogICAgICovCiAgICB2YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7CiAgICAvLyBVc2UgYSBsb29rdXAgdGFibGUgdG8gZmluZCB0aGUgaW5kZXguCiAgICB2YXIgbG9va3VwID0gdHlwZW9mIFVpbnQ4QXJyYXkgPT09ICd1bmRlZmluZWQnID8gW10gOiBuZXcgVWludDhBcnJheSgyNTYpOwogICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFycy5sZW5ndGg7IGkrKykgewogICAgICAgIGxvb2t1cFtjaGFycy5jaGFyQ29kZUF0KGkpXSA9IGk7CiAgICB9CiAgICB2YXIgZW5jb2RlID0gZnVuY3Rpb24gKGFycmF5YnVmZmVyKSB7CiAgICAgICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlidWZmZXIpLCBpLCBsZW4gPSBieXRlcy5sZW5ndGgsIGJhc2U2NCA9ICcnOwogICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMykgewogICAgICAgICAgICBiYXNlNjQgKz0gY2hhcnNbYnl0ZXNbaV0gPj4gMl07CiAgICAgICAgICAgIGJhc2U2NCArPSBjaGFyc1soKGJ5dGVzW2ldICYgMykgPDwgNCkgfCAoYnl0ZXNbaSArIDFdID4+IDQpXTsKICAgICAgICAgICAgYmFzZTY0ICs9IGNoYXJzWygoYnl0ZXNbaSArIDFdICYgMTUpIDw8IDIpIHwgKGJ5dGVzW2kgKyAyXSA+PiA2KV07CiAgICAgICAgICAgIGJhc2U2NCArPSBjaGFyc1tieXRlc1tpICsgMl0gJiA2M107CiAgICAgICAgfQogICAgICAgIGlmIChsZW4gJSAzID09PSAyKSB7CiAgICAgICAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDEpICsgJz0nOwogICAgICAgIH0KICAgICAgICBlbHNlIGlmIChsZW4gJSAzID09PSAxKSB7CiAgICAgICAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDIpICsgJz09JzsKICAgICAgICB9CiAgICAgICAgcmV0dXJuIGJhc2U2NDsKICAgIH07CgogICAgY29uc3QgbGFzdEJsb2JNYXAgPSBuZXcgTWFwKCk7DQogICAgY29uc3QgdHJhbnNwYXJlbnRCbG9iTWFwID0gbmV3IE1hcCgpOw0KICAgIGZ1bmN0aW9uIGdldFRyYW5zcGFyZW50QmxvYkZvcih3aWR0aCwgaGVpZ2h0LCBkYXRhVVJMT3B0aW9ucykgew0KICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkgew0KICAgICAgICAgICAgY29uc3QgaWQgPSBgJHt3aWR0aH0tJHtoZWlnaHR9YDsNCiAgICAgICAgICAgIGlmICgnT2Zmc2NyZWVuQ2FudmFzJyBpbiBnbG9iYWxUaGlzKSB7DQogICAgICAgICAgICAgICAgaWYgKHRyYW5zcGFyZW50QmxvYk1hcC5oYXMoaWQpKQ0KICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNwYXJlbnRCbG9iTWFwLmdldChpZCk7DQogICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2NyZWVuID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aCwgaGVpZ2h0KTsNCiAgICAgICAgICAgICAgICBvZmZzY3JlZW4uZ2V0Q29udGV4dCgnMmQnKTsNCiAgICAgICAgICAgICAgICBjb25zdCBibG9iID0geWllbGQgb2Zmc2NyZWVuLmNvbnZlcnRUb0Jsb2IoZGF0YVVSTE9wdGlvbnMpOw0KICAgICAgICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0geWllbGQgYmxvYi5hcnJheUJ1ZmZlcigpOw0KICAgICAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IGVuY29kZShhcnJheUJ1ZmZlcik7DQogICAgICAgICAgICAgICAgdHJhbnNwYXJlbnRCbG9iTWFwLnNldChpZCwgYmFzZTY0KTsNCiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZTY0Ow0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgZWxzZSB7DQogICAgICAgICAgICAgICAgcmV0dXJuICcnOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9KTsNCiAgICB9DQogICAgY29uc3Qgd29ya2VyID0gc2VsZjsNCiAgICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHsNCiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHsNCiAgICAgICAgICAgIGlmICgnT2Zmc2NyZWVuQ2FudmFzJyBpbiBnbG9iYWxUaGlzKSB7DQogICAgICAgICAgICAgICAgY29uc3QgeyBpZCwgYml0bWFwLCB3aWR0aCwgaGVpZ2h0LCBkYXRhVVJMT3B0aW9ucyB9ID0gZS5kYXRhOw0KICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zcGFyZW50QmFzZTY0ID0gZ2V0VHJhbnNwYXJlbnRCbG9iRm9yKHdpZHRoLCBoZWlnaHQsIGRhdGFVUkxPcHRpb25zKTsNCiAgICAgICAgICAgICAgICBjb25zdCBvZmZzY3JlZW4gPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHdpZHRoLCBoZWlnaHQpOw0KICAgICAgICAgICAgICAgIGNvbnN0IGN0eCA9IG9mZnNjcmVlbi5nZXRDb250ZXh0KCcyZCcpOw0KICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoYml0bWFwLCAwLCAwKTsNCiAgICAgICAgICAgICAgICBiaXRtYXAuY2xvc2UoKTsNCiAgICAgICAgICAgICAgICBjb25zdCBibG9iID0geWllbGQgb2Zmc2NyZWVuLmNvbnZlcnRUb0Jsb2IoZGF0YVVSTE9wdGlvbnMpOw0KICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBibG9iLnR5cGU7DQogICAgICAgICAgICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSB5aWVsZCBibG9iLmFycmF5QnVmZmVyKCk7DQogICAgICAgICAgICAgICAgY29uc3QgYmFzZTY0ID0gZW5jb2RlKGFycmF5QnVmZmVyKTsNCiAgICAgICAgICAgICAgICBpZiAoIWxhc3RCbG9iTWFwLmhhcyhpZCkgJiYgKHlpZWxkIHRyYW5zcGFyZW50QmFzZTY0KSA9PT0gYmFzZTY0KSB7DQogICAgICAgICAgICAgICAgICAgIGxhc3RCbG9iTWFwLnNldChpZCwgYmFzZTY0KTsNCiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdvcmtlci5wb3N0TWVzc2FnZSh7IGlkIH0pOw0KICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICBpZiAobGFzdEJsb2JNYXAuZ2V0KGlkKSA9PT0gYmFzZTY0KQ0KICAgICAgICAgICAgICAgICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQgfSk7DQogICAgICAgICAgICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHsNCiAgICAgICAgICAgICAgICAgICAgaWQsDQogICAgICAgICAgICAgICAgICAgIHR5cGUsDQogICAgICAgICAgICAgICAgICAgIGJhc2U2NCwNCiAgICAgICAgICAgICAgICAgICAgd2lkdGgsDQogICAgICAgICAgICAgICAgICAgIGhlaWdodCwNCiAgICAgICAgICAgICAgICB9KTsNCiAgICAgICAgICAgICAgICBsYXN0QmxvYk1hcC5zZXQoaWQsIGJhc2U2NCk7DQogICAgICAgICAgICB9DQogICAgICAgICAgICBlbHNlIHsNCiAgICAgICAgICAgICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQ6IGUuZGF0YS5pZCB9KTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgfSk7DQogICAgfTsKCn0pKCk7Cgo=", null, false);

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/observers/canvas/canvas-manager.js
  var CanvasManager = class {
    constructor(options) {
      this.pendingCanvasMutations = /* @__PURE__ */ new Map();
      this.rafStamps = { latestId: 0, invokeId: null };
      this.frozen = false;
      this.locked = false;
      this.processMutation = (target, mutation) => {
        const newFrame = this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId;
        if (newFrame || !this.rafStamps.invokeId)
          this.rafStamps.invokeId = this.rafStamps.latestId;
        if (!this.pendingCanvasMutations.has(target)) {
          this.pendingCanvasMutations.set(target, []);
        }
        this.pendingCanvasMutations.get(target).push(mutation);
      };
      const { sampling = "all", win, blockClass, blockSelector, recordCanvas, dataURLOptions } = options;
      this.mutationCb = options.mutationCb;
      this.mirror = options.mirror;
      if (recordCanvas && sampling === "all")
        this.initCanvasMutationObserver(win, blockClass, blockSelector);
      if (recordCanvas && typeof sampling === "number")
        this.initCanvasFPSObserver(sampling, win, blockClass, blockSelector, {
          dataURLOptions
        });
    }
    reset() {
      this.pendingCanvasMutations.clear();
      this.resetObservers && this.resetObservers();
    }
    freeze() {
      this.frozen = true;
    }
    unfreeze() {
      this.frozen = false;
    }
    lock() {
      this.locked = true;
    }
    unlock() {
      this.locked = false;
    }
    initCanvasFPSObserver(fps, win, blockClass, blockSelector, options) {
      const canvasContextReset = initCanvasContextObserver(win, blockClass, blockSelector);
      const snapshotInProgressMap = /* @__PURE__ */ new Map();
      const worker = new WorkerFactory();
      worker.onmessage = (e2) => {
        const { id } = e2.data;
        snapshotInProgressMap.set(id, false);
        if (!("base64" in e2.data))
          return;
        const { base64, type, width, height } = e2.data;
        this.mutationCb({
          id,
          type: CanvasContext["2D"],
          commands: [
            {
              property: "clearRect",
              args: [0, 0, width, height]
            },
            {
              property: "drawImage",
              args: [
                {
                  rr_type: "ImageBitmap",
                  args: [
                    {
                      rr_type: "Blob",
                      data: [{ rr_type: "ArrayBuffer", base64 }],
                      type
                    }
                  ]
                },
                0,
                0
              ]
            }
          ]
        });
      };
      const timeBetweenSnapshots = 1e3 / fps;
      let lastSnapshotTime = 0;
      let rafId;
      const getCanvas = () => {
        const matchedCanvas = [];
        win.document.querySelectorAll("canvas").forEach((canvas) => {
          if (!isBlocked(canvas, blockClass, blockSelector, true)) {
            matchedCanvas.push(canvas);
          }
        });
        return matchedCanvas;
      };
      const takeCanvasSnapshots = (timestamp) => {
        if (lastSnapshotTime && timestamp - lastSnapshotTime < timeBetweenSnapshots) {
          rafId = requestAnimationFrame(takeCanvasSnapshots);
          return;
        }
        lastSnapshotTime = timestamp;
        getCanvas().forEach((canvas) => __awaiter(this, void 0, void 0, function* () {
          var _a;
          const id = this.mirror.getId(canvas);
          if (snapshotInProgressMap.get(id))
            return;
          snapshotInProgressMap.set(id, true);
          if (["webgl", "webgl2"].includes(canvas.__context)) {
            const context = canvas.getContext(canvas.__context);
            if (((_a = context === null || context === void 0 ? void 0 : context.getContextAttributes()) === null || _a === void 0 ? void 0 : _a.preserveDrawingBuffer) === false) {
              context === null || context === void 0 ? void 0 : context.clear(context.COLOR_BUFFER_BIT);
            }
          }
          const bitmap = yield createImageBitmap(canvas);
          worker.postMessage({
            id,
            bitmap,
            width: canvas.width,
            height: canvas.height,
            dataURLOptions: options.dataURLOptions
          }, [bitmap]);
        }));
        rafId = requestAnimationFrame(takeCanvasSnapshots);
      };
      rafId = requestAnimationFrame(takeCanvasSnapshots);
      this.resetObservers = () => {
        canvasContextReset();
        cancelAnimationFrame(rafId);
      };
    }
    initCanvasMutationObserver(win, blockClass, blockSelector) {
      this.startRAFTimestamping();
      this.startPendingCanvasMutationFlusher();
      const canvasContextReset = initCanvasContextObserver(win, blockClass, blockSelector);
      const canvas2DReset = initCanvas2DMutationObserver(this.processMutation.bind(this), win, blockClass, blockSelector);
      const canvasWebGL1and2Reset = initCanvasWebGLMutationObserver(this.processMutation.bind(this), win, blockClass, blockSelector, this.mirror);
      this.resetObservers = () => {
        canvasContextReset();
        canvas2DReset();
        canvasWebGL1and2Reset();
      };
    }
    startPendingCanvasMutationFlusher() {
      requestAnimationFrame(() => this.flushPendingCanvasMutations());
    }
    startRAFTimestamping() {
      const setLatestRAFTimestamp = (timestamp) => {
        this.rafStamps.latestId = timestamp;
        requestAnimationFrame(setLatestRAFTimestamp);
      };
      requestAnimationFrame(setLatestRAFTimestamp);
    }
    flushPendingCanvasMutations() {
      this.pendingCanvasMutations.forEach((values, canvas) => {
        const id = this.mirror.getId(canvas);
        this.flushPendingCanvasMutationFor(canvas, id);
      });
      requestAnimationFrame(() => this.flushPendingCanvasMutations());
    }
    flushPendingCanvasMutationFor(canvas, id) {
      if (this.frozen || this.locked) {
        return;
      }
      const valuesWithType = this.pendingCanvasMutations.get(canvas);
      if (!valuesWithType || id === -1)
        return;
      const values = valuesWithType.map((value) => {
        const rest = __rest(value, ["type"]);
        return rest;
      });
      const { type } = valuesWithType[0];
      this.mutationCb({ id, type, commands: values });
      this.pendingCanvasMutations.delete(canvas);
    }
  };

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/stylesheet-manager.js
  var StylesheetManager = class {
    constructor(options) {
      this.trackedLinkElements = /* @__PURE__ */ new WeakSet();
      this.styleMirror = new StyleSheetMirror();
      this.mutationCb = options.mutationCb;
      this.adoptedStyleSheetCb = options.adoptedStyleSheetCb;
    }
    attachLinkElement(linkEl, childSn) {
      if ("_cssText" in childSn.attributes)
        this.mutationCb({
          adds: [],
          removes: [],
          texts: [],
          attributes: [
            {
              id: childSn.id,
              attributes: childSn.attributes
            }
          ]
        });
      this.trackLinkElement(linkEl);
    }
    trackLinkElement(linkEl) {
      if (this.trackedLinkElements.has(linkEl))
        return;
      this.trackedLinkElements.add(linkEl);
      this.trackStylesheetInLinkElement(linkEl);
    }
    adoptStyleSheets(sheets, hostId) {
      if (sheets.length === 0)
        return;
      const adoptedStyleSheetData = {
        id: hostId,
        styleIds: []
      };
      const styles = [];
      for (const sheet of sheets) {
        let styleId;
        if (!this.styleMirror.has(sheet)) {
          styleId = this.styleMirror.add(sheet);
          const rules = Array.from(sheet.rules || CSSRule);
          styles.push({
            styleId,
            rules: rules.map((r2, index) => {
              return {
                rule: getCssRuleString(r2),
                index
              };
            })
          });
        } else
          styleId = this.styleMirror.getId(sheet);
        adoptedStyleSheetData.styleIds.push(styleId);
      }
      if (styles.length > 0)
        adoptedStyleSheetData.styles = styles;
      this.adoptedStyleSheetCb(adoptedStyleSheetData);
    }
    reset() {
      this.styleMirror.reset();
      this.trackedLinkElements = /* @__PURE__ */ new WeakSet();
    }
    trackStylesheetInLinkElement(linkEl) {
    }
  };

  // node_modules/rrweb/es/rrweb/packages/rrweb/src/record/index.js
  function wrapEvent(e2) {
    return Object.assign(Object.assign({}, e2), { timestamp: Date.now() });
  }
  var wrappedEmit;
  var takeFullSnapshot;
  var canvasManager;
  var recording = false;
  var mirror = createMirror();
  function record(options = {}) {
    const { emit, checkoutEveryNms, checkoutEveryNth, blockClass = "rr-block", blockSelector = null, ignoreClass = "rr-ignore", maskTextClass = "rr-mask", maskTextSelector = null, inlineStylesheet = true, maskAllInputs, maskInputOptions: _maskInputOptions, slimDOMOptions: _slimDOMOptions, maskInputFn, maskTextFn, hooks, packFn, sampling = {}, dataURLOptions = {}, mousemoveWait, recordCanvas = false, recordCrossOriginIframes = false, userTriggeredOnInput = false, collectFonts = false, inlineImages = false, plugins, keepIframeSrcFn = () => false, ignoreCSSAttributes = /* @__PURE__ */ new Set([]) } = options;
    const inEmittingFrame = recordCrossOriginIframes ? window.parent === window : true;
    let passEmitsToParent = false;
    if (!inEmittingFrame) {
      try {
        window.parent.document;
        passEmitsToParent = false;
      } catch (e2) {
        passEmitsToParent = true;
      }
    }
    if (inEmittingFrame && !emit) {
      throw new Error("emit function is required");
    }
    if (mousemoveWait !== void 0 && sampling.mousemove === void 0) {
      sampling.mousemove = mousemoveWait;
    }
    mirror.reset();
    const maskInputOptions = maskAllInputs === true ? {
      color: true,
      date: true,
      "datetime-local": true,
      email: true,
      month: true,
      number: true,
      range: true,
      search: true,
      tel: true,
      text: true,
      time: true,
      url: true,
      week: true,
      textarea: true,
      select: true,
      password: true
    } : _maskInputOptions !== void 0 ? _maskInputOptions : { password: true };
    const slimDOMOptions = _slimDOMOptions === true || _slimDOMOptions === "all" ? {
      script: true,
      comment: true,
      headFavicon: true,
      headWhitespace: true,
      headMetaSocial: true,
      headMetaRobots: true,
      headMetaHttpEquiv: true,
      headMetaVerification: true,
      headMetaAuthorship: _slimDOMOptions === "all",
      headMetaDescKeywords: _slimDOMOptions === "all"
    } : _slimDOMOptions ? _slimDOMOptions : {};
    polyfill();
    let lastFullSnapshotEvent;
    let incrementalSnapshotCount = 0;
    const eventProcessor = (e2) => {
      for (const plugin of plugins || []) {
        if (plugin.eventProcessor) {
          e2 = plugin.eventProcessor(e2);
        }
      }
      if (packFn) {
        e2 = packFn(e2);
      }
      return e2;
    };
    wrappedEmit = (e2, isCheckout) => {
      var _a;
      if (((_a = mutationBuffers[0]) === null || _a === void 0 ? void 0 : _a.isFrozen()) && e2.type !== EventType.FullSnapshot && !(e2.type === EventType.IncrementalSnapshot && e2.data.source === IncrementalSource.Mutation)) {
        mutationBuffers.forEach((buf) => buf.unfreeze());
      }
      if (inEmittingFrame) {
        emit === null || emit === void 0 ? void 0 : emit(eventProcessor(e2), isCheckout);
      } else if (passEmitsToParent) {
        const message = {
          type: "rrweb",
          event: eventProcessor(e2),
          isCheckout
        };
        window.parent.postMessage(message, "*");
      }
      if (e2.type === EventType.FullSnapshot) {
        lastFullSnapshotEvent = e2;
        incrementalSnapshotCount = 0;
      } else if (e2.type === EventType.IncrementalSnapshot) {
        if (e2.data.source === IncrementalSource.Mutation && e2.data.isAttachIframe) {
          return;
        }
        incrementalSnapshotCount++;
        const exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
        const exceedTime = checkoutEveryNms && e2.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
        if (exceedCount || exceedTime) {
          takeFullSnapshot(true);
        }
      }
    };
    const wrappedMutationEmit = (m2) => {
      wrappedEmit(wrapEvent({
        type: EventType.IncrementalSnapshot,
        data: Object.assign({ source: IncrementalSource.Mutation }, m2)
      }));
    };
    const wrappedScrollEmit = (p2) => wrappedEmit(wrapEvent({
      type: EventType.IncrementalSnapshot,
      data: Object.assign({ source: IncrementalSource.Scroll }, p2)
    }));
    const wrappedCanvasMutationEmit = (p2) => wrappedEmit(wrapEvent({
      type: EventType.IncrementalSnapshot,
      data: Object.assign({ source: IncrementalSource.CanvasMutation }, p2)
    }));
    const wrappedAdoptedStyleSheetEmit = (a2) => wrappedEmit(wrapEvent({
      type: EventType.IncrementalSnapshot,
      data: Object.assign({ source: IncrementalSource.AdoptedStyleSheet }, a2)
    }));
    const stylesheetManager = new StylesheetManager({
      mutationCb: wrappedMutationEmit,
      adoptedStyleSheetCb: wrappedAdoptedStyleSheetEmit
    });
    const iframeManager = new IframeManager({
      mirror,
      mutationCb: wrappedMutationEmit,
      stylesheetManager,
      recordCrossOriginIframes,
      wrappedEmit
    });
    for (const plugin of plugins || []) {
      if (plugin.getMirror)
        plugin.getMirror({
          nodeMirror: mirror,
          crossOriginIframeMirror: iframeManager.crossOriginIframeMirror,
          crossOriginIframeStyleMirror: iframeManager.crossOriginIframeStyleMirror
        });
    }
    canvasManager = new CanvasManager({
      recordCanvas,
      mutationCb: wrappedCanvasMutationEmit,
      win: window,
      blockClass,
      blockSelector,
      mirror,
      sampling: sampling.canvas,
      dataURLOptions
    });
    const shadowDomManager = new ShadowDomManager({
      mutationCb: wrappedMutationEmit,
      scrollCb: wrappedScrollEmit,
      bypassOptions: {
        blockClass,
        blockSelector,
        maskTextClass,
        maskTextSelector,
        inlineStylesheet,
        maskInputOptions,
        dataURLOptions,
        maskTextFn,
        maskInputFn,
        recordCanvas,
        inlineImages,
        sampling,
        slimDOMOptions,
        iframeManager,
        stylesheetManager,
        canvasManager,
        keepIframeSrcFn
      },
      mirror
    });
    takeFullSnapshot = (isCheckout = false) => {
      var _a, _b, _c, _d, _e, _f;
      wrappedEmit(wrapEvent({
        type: EventType.Meta,
        data: {
          href: window.location.href,
          width: getWindowWidth(),
          height: getWindowHeight()
        }
      }), isCheckout);
      stylesheetManager.reset();
      mutationBuffers.forEach((buf) => buf.lock());
      const node = snapshot(document, {
        mirror,
        blockClass,
        blockSelector,
        maskTextClass,
        maskTextSelector,
        inlineStylesheet,
        maskAllInputs: maskInputOptions,
        maskTextFn,
        slimDOM: slimDOMOptions,
        dataURLOptions,
        recordCanvas,
        inlineImages,
        onSerialize: (n2) => {
          if (isSerializedIframe(n2, mirror)) {
            iframeManager.addIframe(n2);
          }
          if (isSerializedStylesheet(n2, mirror)) {
            stylesheetManager.trackLinkElement(n2);
          }
          if (hasShadowRoot(n2)) {
            shadowDomManager.addShadowRoot(n2.shadowRoot, document);
          }
        },
        onIframeLoad: (iframe, childSn) => {
          iframeManager.attachIframe(iframe, childSn);
          shadowDomManager.observeAttachShadow(iframe);
        },
        onStylesheetLoad: (linkEl, childSn) => {
          stylesheetManager.attachLinkElement(linkEl, childSn);
        },
        keepIframeSrcFn
      });
      if (!node) {
        return console.warn("Failed to snapshot the document");
      }
      wrappedEmit(wrapEvent({
        type: EventType.FullSnapshot,
        data: {
          node,
          initialOffset: {
            left: window.pageXOffset !== void 0 ? window.pageXOffset : (document === null || document === void 0 ? void 0 : document.documentElement.scrollLeft) || ((_b = (_a = document === null || document === void 0 ? void 0 : document.body) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.scrollLeft) || ((_c = document === null || document === void 0 ? void 0 : document.body) === null || _c === void 0 ? void 0 : _c.scrollLeft) || 0,
            top: window.pageYOffset !== void 0 ? window.pageYOffset : (document === null || document === void 0 ? void 0 : document.documentElement.scrollTop) || ((_e = (_d = document === null || document === void 0 ? void 0 : document.body) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.scrollTop) || ((_f = document === null || document === void 0 ? void 0 : document.body) === null || _f === void 0 ? void 0 : _f.scrollTop) || 0
          }
        }
      }));
      mutationBuffers.forEach((buf) => buf.unlock());
      if (document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0)
        stylesheetManager.adoptStyleSheets(document.adoptedStyleSheets, mirror.getId(document));
    };
    try {
      const handlers = [];
      handlers.push(on("DOMContentLoaded", () => {
        wrappedEmit(wrapEvent({
          type: EventType.DomContentLoaded,
          data: {}
        }));
      }));
      const observe = (doc) => {
        var _a;
        return initObservers({
          mutationCb: wrappedMutationEmit,
          mousemoveCb: (positions, source) => wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: {
              source,
              positions
            }
          })),
          mouseInteractionCb: (d2) => wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.MouseInteraction }, d2)
          })),
          scrollCb: wrappedScrollEmit,
          viewportResizeCb: (d2) => wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.ViewportResize }, d2)
          })),
          inputCb: (v2) => wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.Input }, v2)
          })),
          mediaInteractionCb: (p2) => wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.MediaInteraction }, p2)
          })),
          styleSheetRuleCb: (r2) => wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.StyleSheetRule }, r2)
          })),
          styleDeclarationCb: (r2) => wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.StyleDeclaration }, r2)
          })),
          canvasMutationCb: wrappedCanvasMutationEmit,
          fontCb: (p2) => wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.Font }, p2)
          })),
          selectionCb: (p2) => {
            wrappedEmit(wrapEvent({
              type: EventType.IncrementalSnapshot,
              data: Object.assign({ source: IncrementalSource.Selection }, p2)
            }));
          },
          blockClass,
          ignoreClass,
          maskTextClass,
          maskTextSelector,
          maskInputOptions,
          inlineStylesheet,
          sampling,
          recordCanvas,
          inlineImages,
          userTriggeredOnInput,
          collectFonts,
          doc,
          maskInputFn,
          maskTextFn,
          keepIframeSrcFn,
          blockSelector,
          slimDOMOptions,
          dataURLOptions,
          mirror,
          iframeManager,
          stylesheetManager,
          shadowDomManager,
          canvasManager,
          ignoreCSSAttributes,
          plugins: ((_a = plugins === null || plugins === void 0 ? void 0 : plugins.filter((p2) => p2.observer)) === null || _a === void 0 ? void 0 : _a.map((p2) => ({
            observer: p2.observer,
            options: p2.options,
            callback: (payload) => wrappedEmit(wrapEvent({
              type: EventType.Plugin,
              data: {
                plugin: p2.name,
                payload
              }
            }))
          }))) || []
        }, hooks);
      };
      iframeManager.addLoadListener((iframeEl) => {
        handlers.push(observe(iframeEl.contentDocument));
      });
      const init = () => {
        takeFullSnapshot();
        handlers.push(observe(document));
        recording = true;
      };
      if (document.readyState === "interactive" || document.readyState === "complete") {
        init();
      } else {
        handlers.push(on("load", () => {
          wrappedEmit(wrapEvent({
            type: EventType.Load,
            data: {}
          }));
          init();
        }, window));
      }
      return () => {
        handlers.forEach((h2) => h2());
        recording = false;
      };
    } catch (error) {
      console.warn(error);
    }
  }
  record.addCustomEvent = (tag, payload) => {
    if (!recording) {
      throw new Error("please add custom event after start recording");
    }
    wrappedEmit(wrapEvent({
      type: EventType.Custom,
      data: {
        tag,
        payload
      }
    }));
  };
  record.freezePage = () => {
    mutationBuffers.forEach((buf) => buf.freeze());
  };
  record.takeFullSnapshot = (isCheckout) => {
    if (!recording) {
      throw new Error("please take full snapshot after start recording");
    }
    takeFullSnapshot(isCheckout);
  };
  record.mirror = mirror;

  // node_modules/web-vitals/dist/web-vitals.js
  var n;
  var t;
  var r;
  var i;
  var o = -1;
  var a = function(e2) {
    addEventListener("pageshow", function(n2) {
      n2.persisted && (o = n2.timeStamp, e2(n2));
    }, true);
  };
  var c = function() {
    var e2 = self.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
    if (e2 && e2.responseStart > 0 && e2.responseStart < performance.now()) return e2;
  };
  var u = function() {
    var e2 = c();
    return e2 && e2.activationStart || 0;
  };
  var f = function(e2, n2) {
    var t2 = c(), r2 = "navigate";
    o >= 0 ? r2 = "back-forward-cache" : t2 && (document.prerendering || u() > 0 ? r2 = "prerender" : document.wasDiscarded ? r2 = "restore" : t2.type && (r2 = t2.type.replace(/_/g, "-")));
    return { name: e2, value: void 0 === n2 ? -1 : n2, rating: "good", delta: 0, entries: [], id: "v4-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12), navigationType: r2 };
  };
  var s = function(e2, n2, t2) {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(e2)) {
        var r2 = new PerformanceObserver(function(e3) {
          Promise.resolve().then(function() {
            n2(e3.getEntries());
          });
        });
        return r2.observe(Object.assign({ type: e2, buffered: true }, t2 || {})), r2;
      }
    } catch (e3) {
    }
  };
  var d = function(e2, n2, t2, r2) {
    var i2, o2;
    return function(a2) {
      n2.value >= 0 && (a2 || r2) && ((o2 = n2.value - (i2 || 0)) || void 0 === i2) && (i2 = n2.value, n2.delta = o2, n2.rating = function(e3, n3) {
        return e3 > n3[1] ? "poor" : e3 > n3[0] ? "needs-improvement" : "good";
      }(n2.value, t2), e2(n2));
    };
  };
  var l = function(e2) {
    requestAnimationFrame(function() {
      return requestAnimationFrame(function() {
        return e2();
      });
    });
  };
  var p = function(e2) {
    document.addEventListener("visibilitychange", function() {
      "hidden" === document.visibilityState && e2();
    });
  };
  var v = function(e2) {
    var n2 = false;
    return function() {
      n2 || (e2(), n2 = true);
    };
  };
  var m = -1;
  var h = function() {
    return "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0;
  };
  var g = function(e2) {
    "hidden" === document.visibilityState && m > -1 && (m = "visibilitychange" === e2.type ? e2.timeStamp : 0, T());
  };
  var y = function() {
    addEventListener("visibilitychange", g, true), addEventListener("prerenderingchange", g, true);
  };
  var T = function() {
    removeEventListener("visibilitychange", g, true), removeEventListener("prerenderingchange", g, true);
  };
  var E = function() {
    return m < 0 && (m = h(), y(), a(function() {
      setTimeout(function() {
        m = h(), y();
      }, 0);
    })), { get firstHiddenTime() {
      return m;
    } };
  };
  var C = function(e2) {
    document.prerendering ? addEventListener("prerenderingchange", function() {
      return e2();
    }, true) : e2();
  };
  var b = [1800, 3e3];
  var S = function(e2, n2) {
    n2 = n2 || {}, C(function() {
      var t2, r2 = E(), i2 = f("FCP"), o2 = s("paint", function(e3) {
        e3.forEach(function(e4) {
          "first-contentful-paint" === e4.name && (o2.disconnect(), e4.startTime < r2.firstHiddenTime && (i2.value = Math.max(e4.startTime - u(), 0), i2.entries.push(e4), t2(true)));
        });
      });
      o2 && (t2 = d(e2, i2, b, n2.reportAllChanges), a(function(r3) {
        i2 = f("FCP"), t2 = d(e2, i2, b, n2.reportAllChanges), l(function() {
          i2.value = performance.now() - r3.timeStamp, t2(true);
        });
      }));
    });
  };
  var L = [0.1, 0.25];
  var w = function(e2, n2) {
    n2 = n2 || {}, S(v(function() {
      var t2, r2 = f("CLS", 0), i2 = 0, o2 = [], c2 = function(e3) {
        e3.forEach(function(e4) {
          if (!e4.hadRecentInput) {
            var n3 = o2[0], t3 = o2[o2.length - 1];
            i2 && e4.startTime - t3.startTime < 1e3 && e4.startTime - n3.startTime < 5e3 ? (i2 += e4.value, o2.push(e4)) : (i2 = e4.value, o2 = [e4]);
          }
        }), i2 > r2.value && (r2.value = i2, r2.entries = o2, t2());
      }, u2 = s("layout-shift", c2);
      u2 && (t2 = d(e2, r2, L, n2.reportAllChanges), p(function() {
        c2(u2.takeRecords()), t2(true);
      }), a(function() {
        i2 = 0, r2 = f("CLS", 0), t2 = d(e2, r2, L, n2.reportAllChanges), l(function() {
          return t2();
        });
      }), setTimeout(t2, 0));
    }));
  };
  var I = 1 / 0;
  var O = function(e2) {
    var n2 = self.requestIdleCallback || self.setTimeout, t2 = -1;
    return e2 = v(e2), "hidden" === document.visibilityState ? e2() : (t2 = n2(e2), p(e2)), t2;
  };
  var _ = [2500, 4e3];
  var z = {};
  var G = function(e2, n2) {
    n2 = n2 || {}, C(function() {
      var t2, r2 = E(), i2 = f("LCP"), o2 = function(e3) {
        n2.reportAllChanges || (e3 = e3.slice(-1)), e3.forEach(function(e4) {
          e4.startTime < r2.firstHiddenTime && (i2.value = Math.max(e4.startTime - u(), 0), i2.entries = [e4], t2());
        });
      }, c2 = s("largest-contentful-paint", o2);
      if (c2) {
        t2 = d(e2, i2, _, n2.reportAllChanges);
        var m2 = v(function() {
          z[i2.id] || (o2(c2.takeRecords()), c2.disconnect(), z[i2.id] = true, t2(true));
        });
        ["keydown", "click"].forEach(function(e3) {
          addEventListener(e3, function() {
            return O(m2);
          }, { once: true, capture: true });
        }), p(m2), a(function(r3) {
          i2 = f("LCP"), t2 = d(e2, i2, _, n2.reportAllChanges), l(function() {
            i2.value = performance.now() - r3.timeStamp, z[i2.id] = true, t2(true);
          });
        });
      }
    });
  };
  var J = [800, 1800];
  var K = function e(n2) {
    document.prerendering ? C(function() {
      return e(n2);
    }) : "complete" !== document.readyState ? addEventListener("load", function() {
      return e(n2);
    }, true) : setTimeout(n2, 0);
  };
  var Q = function(e2, n2) {
    n2 = n2 || {};
    var t2 = f("TTFB"), r2 = d(e2, t2, J, n2.reportAllChanges);
    K(function() {
      var i2 = c();
      i2 && (t2.value = Math.max(i2.responseStart - u(), 0), t2.entries = [i2], r2(true), a(function() {
        t2 = f("TTFB", 0), (r2 = d(e2, t2, J, n2.reportAllChanges))(true);
      }));
    });
  };
  var U = { passive: true, capture: true };
  var V = /* @__PURE__ */ new Date();
  var W = function(e2, i2) {
    n || (n = i2, t = e2, r = /* @__PURE__ */ new Date(), Z(removeEventListener), X());
  };
  var X = function() {
    if (t >= 0 && t < r - V) {
      var e2 = { entryType: "first-input", name: n.type, target: n.target, cancelable: n.cancelable, startTime: n.timeStamp, processingStart: n.timeStamp + t };
      i.forEach(function(n2) {
        n2(e2);
      }), i = [];
    }
  };
  var Y = function(e2) {
    if (e2.cancelable) {
      var n2 = (e2.timeStamp > 1e12 ? /* @__PURE__ */ new Date() : performance.now()) - e2.timeStamp;
      "pointerdown" == e2.type ? function(e3, n3) {
        var t2 = function() {
          W(e3, n3), i2();
        }, r2 = function() {
          i2();
        }, i2 = function() {
          removeEventListener("pointerup", t2, U), removeEventListener("pointercancel", r2, U);
        };
        addEventListener("pointerup", t2, U), addEventListener("pointercancel", r2, U);
      }(n2, e2) : W(n2, e2);
    }
  };
  var Z = function(e2) {
    ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function(n2) {
      return e2(n2, Y, U);
    });
  };
  var $ = [100, 300];
  var ee = function(e2, r2) {
    r2 = r2 || {}, C(function() {
      var o2, c2 = E(), u2 = f("FID"), l2 = function(e3) {
        e3.startTime < c2.firstHiddenTime && (u2.value = e3.processingStart - e3.startTime, u2.entries.push(e3), o2(true));
      }, m2 = function(e3) {
        e3.forEach(l2);
      }, h2 = s("first-input", m2);
      o2 = d(e2, u2, $, r2.reportAllChanges), h2 && (p(v(function() {
        m2(h2.takeRecords()), h2.disconnect();
      })), a(function() {
        var a2;
        u2 = f("FID"), o2 = d(e2, u2, $, r2.reportAllChanges), i = [], t = -1, n = null, Z(addEventListener), a2 = l2, i.push(a2), X();
      }));
    });
  };

  // src/index.ts
  var import_ua_parser_js = __toESM(require_ua_parser());
  var SESSION_ID_KEY = "_insight_core_session_id";
  var BATCH_INTERVAL = 10 * 1e3;
  var InsightCoreSDK = class {
    constructor() {
      this.config = null;
      this.eventBuffer = [];
      this.sessionId = this.getSessionId();
      this.initFromScriptTag();
    }
    getSessionId() {
      let sid = sessionStorage.getItem(SESSION_ID_KEY);
      if (!sid) {
        sid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem(SESSION_ID_KEY, sid);
      }
      return sid;
    }
    initFromScriptTag() {
      const script = document.currentScript;
      if (!script) {
        console.error("InsightCore SDK: Could not find the script tag. Please ensure the script is loaded correctly.");
        return;
      }
      const projectId = script.getAttribute("data-project-id");
      const collectorUrl = script.getAttribute("data-collector-url");
      if (!projectId || !collectorUrl) {
        console.error("InsightCore SDK: 'data-project-id' and 'data-collector-url' attributes are required.");
        return;
      }
      this.init({ projectId, collectorUrl });
    }
    init(config) {
      if (this.config) {
        console.warn("InsightCore SDK has already been initialized.");
        return;
      }
      this.config = config;
      console.log("InsightCore SDK Initialized for project:", this.config.projectId);
      this.start();
    }
    start() {
      if (!this.config) return;
      try {
        this.captureMeta();
        console.log("InsightCore SDK: Meta data captured.");
      } catch (e2) {
        console.error("InsightCore SDK: Failed to capture meta data.", e2);
      }
      try {
        this.startRrwebRecording();
        console.log("InsightCore SDK: rrweb recording started.");
      } catch (e2) {
        console.error("InsightCore SDK: Failed to start rrweb recording.", e2);
      }
      try {
        this.captureWebVitals();
        console.log("InsightCore SDK: Web Vitals capturing started.");
      } catch (e2) {
        console.error("InsightCore SDK: Failed to capture Web Vitals.", e2);
      }
      try {
        this.captureErrors();
        console.log("InsightCore SDK: Error capturing started.");
      } catch (e2) {
        console.error("InsightCore SDK: Failed to set up error capturing.", e2);
      }
      setInterval(() => this.sendBatch(), BATCH_INTERVAL);
      window.addEventListener("beforeunload", () => this.sendBatch(true));
      console.log("InsightCore SDK: Batch sending interval set up.");
    }
    addToBuffer(type, payload) {
      this.eventBuffer.push({ type, payload });
    }
    captureMeta() {
      const parser = new import_ua_parser_js.default();
      const ua = parser.getResult();
      this.addToBuffer("meta", {
        startTime: (/* @__PURE__ */ new Date()).toISOString(),
        browser: ua.browser.name,
        os: ua.os.name,
        device: ua.device.type || "desktop",
        href: window.location.href
      });
    }
    startRrwebRecording() {
      this.stopRecording = record({
        emit: (event, isCheckout) => {
          const isHeatmapEvent = event.type === 3 && (event.data.source === 1 || event.data.source === 2 && event.data.type === 2);
          if (isHeatmapEvent) {
            this.addToBuffer("heatmap", event.data);
          } else {
            this.addToBuffer("replay", event);
          }
        },
        sampling: {
          mousemove: 150,
          scroll: 1e3
        },
        maskAllInputs: true
      });
    }
    captureWebVitals() {
      const metricHandler = (metric) => this.addToBuffer("metric", metric);
      w(metricHandler);
      S(metricHandler);
      ee(metricHandler);
      G(metricHandler);
      Q(metricHandler);
    }
    captureErrors() {
      window.onerror = (message, source, lineno, colno, error) => {
        this.addToBuffer("error", {
          message,
          source,
          lineno,
          colno,
          error: error ? error.stack : null
        });
      };
    }
    sendBatch(useBeacon = false) {
      if (!this.config || this.eventBuffer.length === 0) {
        return;
      }
      const payload = {
        projectId: this.config.projectId,
        sessionId: this.sessionId,
        events: this.eventBuffer
      };
      this.eventBuffer = [];
      const data = JSON.stringify(payload);
      const url = this.config.collectorUrl;
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(url, data);
      } else {
        fetch(url, {
          method: "POST",
          body: data,
          headers: { "Content-Type": "application/json" },
          keepalive: useBeacon
        }).catch((error) => {
          console.error("InsightCore SDK: Error sending data:", error);
        });
      }
    }
  };
  new InsightCoreSDK();
})();
/*! Bundled license information:

rrweb/es/rrweb/ext/tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
