/* GENERATED FILE - do not edit. Source: packages/worker/src/vercel-entry.ts. Regenerate with: pnpm build:api */
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to2, from, except2, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key) && key !== except2)
        __defProp(to2, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/util.js"(exports2) {
    "use strict";
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = function(string, regex) {
      const matches = [];
      let match2 = regex.exec(string);
      while (match2) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match2[0].length;
        const len = match2.length;
        for (let index2 = 0; index2 < len; index2++) {
          allmatches.push(match2[index2]);
        }
        matches.push(allmatches);
        match2 = regex.exec(string);
      }
      return matches;
    };
    var isName = function(string) {
      const match2 = regexName.exec(string);
      return !(match2 === null || typeof match2 === "undefined");
    };
    exports2.isExist = function(v2) {
      return typeof v2 !== "undefined";
    };
    exports2.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports2.merge = function(target, a2, arrayMode) {
      if (a2) {
        const keys = Object.keys(a2);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          if (arrayMode === "strict") {
            target[keys[i]] = [a2[keys[i]]];
          } else {
            target[keys[i]] = a2[keys[i]];
          }
        }
      }
    };
    exports2.getValue = function(v2) {
      if (exports2.isExist(v2)) {
        return v2;
      } else {
        return "";
      }
    };
    var DANGEROUS_PROPERTY_NAMES = [
      // '__proto__',
      // 'constructor',
      // 'prototype',
      "hasOwnProperty",
      "toString",
      "valueOf",
      "__defineGetter__",
      "__defineSetter__",
      "__lookupGetter__",
      "__lookupSetter__"
    ];
    var criticalProperties = ["__proto__", "constructor", "prototype"];
    exports2.isName = isName;
    exports2.getAllMatches = getAllMatches;
    exports2.nameRegexp = nameRegexp;
    exports2.DANGEROUS_PROPERTY_NAMES = DANGEROUS_PROPERTY_NAMES;
    exports2.criticalProperties = criticalProperties;
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/validator.js"(exports2) {
    "use strict";
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    exports2.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i = 0; i < xmlData.length; i++) {
        if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
          i += 2;
          i = readPI(xmlData, i);
          if (i.err) return i;
        } else if (xmlData[i] === "<") {
          let tagStartPos = i;
          i++;
          if (xmlData[i] === "!") {
            i = readCommentAndCDATA(xmlData, i);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i] === "/") {
              closingTag = true;
              i++;
            }
            let tagName = "";
            for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
              tagName += xmlData[i];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
            }
            const result = readAttributeStr(xmlData, i);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
            }
            let attrStr = result.value;
            i = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else if (tags.length === 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject(
                    "InvalidTag",
                    "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                    getLineNumberForPosition(xmlData, tagStartPos)
                  );
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) {
              } else {
                tags.push({ tagName, tagStartPos });
              }
              tagFound = true;
            }
            for (i++; i < xmlData.length; i++) {
              if (xmlData[i] === "<") {
                if (xmlData[i + 1] === "!") {
                  i++;
                  i = readCommentAndCDATA(xmlData, i);
                  continue;
                } else if (xmlData[i + 1] === "?") {
                  i = readPI(xmlData, ++i);
                  if (i.err) return i;
                } else {
                  break;
                }
              } else if (xmlData[i] === "&") {
                const afterAmp = validateAmpersand(xmlData, i);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
                i = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
                }
              }
            }
            if (xmlData[i] === "<") {
              i--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
      }
      return true;
    };
    function isWhiteSpace(char2) {
      return char2 === " " || char2 === "	" || char2 === "\n" || char2 === "\r";
    }
    function readPI(xmlData, i) {
      const start = i;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] == "?" || xmlData[i] == " ") {
          const tagname = xmlData.substr(start, i - start);
          if (i > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
          } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
            i++;
            break;
          } else {
            continue;
          }
        }
      }
      return i;
    }
    function readCommentAndCDATA(xmlData, i) {
      if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
        for (i += 3; i < xmlData.length; i++) {
          if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
        let angleBracketsCount = 1;
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      }
      return i;
    }
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i];
          } else if (startChar !== xmlData[i]) {
          } else {
            startChar = "";
          }
        } else if (xmlData[i] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i,
        tagClosed
      };
    }
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
        } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
        } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
        }
        const attrName = matches[i][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
        }
      }
      return true;
    }
    function validateNumberAmpersand(xmlData, i) {
      let re = /\d/;
      if (xmlData[i] === "x") {
        i++;
        re = /[\da-fA-F]/;
      }
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === ";")
          return i;
        if (!xmlData[i].match(re))
          break;
      }
      return -1;
    }
    function validateAmpersand(xmlData, i) {
      i++;
      if (xmlData[i] === ";")
        return -1;
      if (xmlData[i] === "#") {
        i++;
        return validateNumberAmpersand(xmlData, i);
      }
      let count = 0;
      for (; i < xmlData.length; i++, count++) {
        if (xmlData[i].match(/\w/) && count < 20)
          continue;
        if (xmlData[i] === ";")
          break;
        return -1;
      }
      return i;
    }
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    function getLineNumberForPosition(xmlData, index2) {
      const lines = xmlData.substring(0, index2).split(/\r?\n/);
      return {
        line: lines.length,
        // column number is last line's length + 1, because column numbering starts at 1:
        col: lines[lines.length - 1].length + 1
      };
    }
    function getPositionFromMatch(match2) {
      return match2.startIndex + match2[1].length;
    }
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports2) {
    var { DANGEROUS_PROPERTY_NAMES, criticalProperties } = require_util();
    var defaultOnDangerousProperty = (name) => {
      if (DANGEROUS_PROPERTY_NAMES.includes(name)) {
        return "__" + name;
      }
      return name;
    };
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true
      },
      tagValueProcessor: function(tagName, val) {
        return val;
      },
      attributeValueProcessor: function(attrName, val) {
        return val;
      },
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: () => false,
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false,
      updateTag: function(tagName, jPath, attrs) {
        return tagName;
      },
      // skipEmptyListItem: false
      captureMetaData: false,
      maxNestedTags: 100,
      strictReservedNames: true,
      onDangerousProperty: defaultOnDangerousProperty
    };
    function validatePropertyName(propertyName, optionName) {
      if (typeof propertyName !== "string") {
        return;
      }
      const normalized = propertyName.toLowerCase();
      if (DANGEROUS_PROPERTY_NAMES.some((dangerous) => normalized === dangerous.toLowerCase())) {
        throw new Error(
          `[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
        );
      }
      if (criticalProperties.some((dangerous) => normalized === dangerous.toLowerCase())) {
        throw new Error(
          `[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
        );
      }
    }
    function normalizeProcessEntities(value) {
      if (typeof value === "boolean") {
        return {
          enabled: value,
          // true or false
          maxEntitySize: 1e4,
          maxExpansionDepth: 10,
          maxTotalExpansions: 1e3,
          maxExpandedLength: 1e5,
          allowedTags: null,
          tagFilter: null
        };
      }
      if (typeof value === "object" && value !== null) {
        return {
          enabled: value.enabled !== false,
          maxEntitySize: Math.max(1, value.maxEntitySize ?? 1e4),
          maxExpansionDepth: Math.max(1, value.maxExpansionDepth ?? 10),
          maxTotalExpansions: Math.max(1, value.maxTotalExpansions ?? 1e3),
          maxExpandedLength: Math.max(1, value.maxExpandedLength ?? 1e5),
          maxEntityCount: Math.max(1, value.maxEntityCount ?? 100),
          allowedTags: value.allowedTags ?? null,
          tagFilter: value.tagFilter ?? null
        };
      }
      return normalizeProcessEntities(true);
    }
    var buildOptions = function(options) {
      const built = Object.assign({}, defaultOptions, options);
      const propertyNameOptions = [
        { value: built.attributeNamePrefix, name: "attributeNamePrefix" },
        { value: built.attributesGroupName, name: "attributesGroupName" },
        { value: built.textNodeName, name: "textNodeName" },
        { value: built.cdataPropName, name: "cdataPropName" },
        { value: built.commentPropName, name: "commentPropName" }
      ];
      for (const { value, name } of propertyNameOptions) {
        if (value) {
          validatePropertyName(value, name);
        }
      }
      if (built.onDangerousProperty === null) {
        built.onDangerousProperty = defaultOnDangerousProperty;
      }
      built.processEntities = normalizeProcessEntities(built.processEntities);
      return built;
    };
    exports2.buildOptions = buildOptions;
    exports2.defaultOptions = defaultOptions;
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports2, module2) {
    "use strict";
    var XmlNode = class {
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val) {
        if (key === "__proto__") key = "#__proto__";
        this.child.push({ [key]: val });
      }
      addChild(node) {
        if (node.tagname === "__proto__") node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
      }
    };
    module2.exports = XmlNode;
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports2, module2) {
    var util = require_util();
    var DocTypeReader = class {
      constructor(options) {
        this.suppressValidationErr = !options;
        this.options = options || {};
      }
      readDocType(xmlData, i) {
        const entities = /* @__PURE__ */ Object.create(null);
        let entityCount = 0;
        if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
          i = i + 9;
          let angleBracketsCount = 1;
          let hasBody = false, comment = false;
          let exp = "";
          for (; i < xmlData.length; i++) {
            if (xmlData[i] === "<" && !comment) {
              if (hasBody && hasSeq(xmlData, "!ENTITY", i)) {
                i += 7;
                let entityName, val;
                [entityName, val, i] = this.readEntityExp(xmlData, i + 1, this.suppressValidationErr);
                if (val.indexOf("&") === -1) {
                  if (this.options.enabled !== false && this.options.maxEntityCount != null && entityCount >= this.options.maxEntityCount) {
                    throw new Error(
                      `Entity count (${entityCount + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`
                    );
                  }
                  const escaped = entityName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                  entities[entityName] = {
                    regx: RegExp(`&${escaped};`, "g"),
                    val
                  };
                  entityCount++;
                }
              } else if (hasBody && hasSeq(xmlData, "!ELEMENT", i)) {
                i += 8;
                const { index: index2 } = this.readElementExp(xmlData, i + 1);
                i = index2;
              } else if (hasBody && hasSeq(xmlData, "!ATTLIST", i)) {
                i += 8;
              } else if (hasBody && hasSeq(xmlData, "!NOTATION", i)) {
                i += 9;
                const { index: index2 } = this.readNotationExp(xmlData, i + 1, this.suppressValidationErr);
                i = index2;
              } else if (hasSeq(xmlData, "!--", i)) {
                comment = true;
              } else {
                throw new Error(`Invalid DOCTYPE`);
              }
              angleBracketsCount++;
              exp = "";
            } else if (xmlData[i] === ">") {
              if (comment) {
                if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
                  comment = false;
                  angleBracketsCount--;
                }
              } else {
                angleBracketsCount--;
              }
              if (angleBracketsCount === 0) {
                break;
              }
            } else if (xmlData[i] === "[") {
              hasBody = true;
            } else {
              exp += xmlData[i];
            }
          }
          if (angleBracketsCount !== 0) {
            throw new Error(`Unclosed DOCTYPE`);
          }
        } else {
          throw new Error(`Invalid Tag instead of DOCTYPE`);
        }
        return { entities, i };
      }
      readEntityExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        let entityName = "";
        while (i < xmlData.length && !/\s/.test(xmlData[i]) && xmlData[i] !== '"' && xmlData[i] !== "'") {
          entityName += xmlData[i];
          i++;
        }
        validateEntityName(entityName);
        i = skipWhitespace(xmlData, i);
        if (!this.suppressValidationErr) {
          if (xmlData.substring(i, i + 6).toUpperCase() === "SYSTEM") {
            throw new Error("External entities are not supported");
          } else if (xmlData[i] === "%") {
            throw new Error("Parameter entities are not supported");
          }
        }
        let entityValue = "";
        [i, entityValue] = this.readIdentifierVal(xmlData, i, "entity");
        if (this.options.enabled !== false && this.options.maxEntitySize != null && entityValue.length > this.options.maxEntitySize) {
          throw new Error(
            `Entity "${entityName}" size (${entityValue.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`
          );
        }
        i--;
        return [entityName, entityValue, i];
      }
      readNotationExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        let notationName = "";
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          notationName += xmlData[i];
          i++;
        }
        !this.suppressValidationErr && validateEntityName(notationName);
        i = skipWhitespace(xmlData, i);
        const identifierType = xmlData.substring(i, i + 6).toUpperCase();
        if (!this.suppressValidationErr && identifierType !== "SYSTEM" && identifierType !== "PUBLIC") {
          throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
        }
        i += identifierType.length;
        i = skipWhitespace(xmlData, i);
        let publicIdentifier = null;
        let systemIdentifier = null;
        if (identifierType === "PUBLIC") {
          [i, publicIdentifier] = this.readIdentifierVal(xmlData, i, "publicIdentifier");
          i = skipWhitespace(xmlData, i);
          if (xmlData[i] === '"' || xmlData[i] === "'") {
            [i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
          }
        } else if (identifierType === "SYSTEM") {
          [i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
          if (!this.suppressValidationErr && !systemIdentifier) {
            throw new Error("Missing mandatory system identifier for SYSTEM notation");
          }
        }
        return { notationName, publicIdentifier, systemIdentifier, index: --i };
      }
      readIdentifierVal(xmlData, i, type) {
        let identifierVal = "";
        const startChar = xmlData[i];
        if (startChar !== '"' && startChar !== "'") {
          throw new Error(`Expected quoted string, found "${startChar}"`);
        }
        i++;
        while (i < xmlData.length && xmlData[i] !== startChar) {
          identifierVal += xmlData[i];
          i++;
        }
        if (xmlData[i] !== startChar) {
          throw new Error(`Unterminated ${type} value`);
        }
        i++;
        return [i, identifierVal];
      }
      readElementExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        let elementName = "";
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          elementName += xmlData[i];
          i++;
        }
        if (!this.suppressValidationErr && !util.isName(elementName)) {
          throw new Error(`Invalid element name: "${elementName}"`);
        }
        i = skipWhitespace(xmlData, i);
        let contentModel = "";
        if (xmlData[i] === "E" && hasSeq(xmlData, "MPTY", i)) {
          i += 4;
        } else if (xmlData[i] === "A" && hasSeq(xmlData, "NY", i)) {
          i += 2;
        } else if (xmlData[i] === "(") {
          i++;
          while (i < xmlData.length && xmlData[i] !== ")") {
            contentModel += xmlData[i];
            i++;
          }
          if (xmlData[i] !== ")") {
            throw new Error("Unterminated content model");
          }
        } else if (!this.suppressValidationErr) {
          throw new Error(`Invalid Element Expression, found "${xmlData[i]}"`);
        }
        return {
          elementName,
          contentModel: contentModel.trim(),
          index: i
        };
      }
      readAttlistExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        let elementName = "";
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          elementName += xmlData[i];
          i++;
        }
        validateEntityName(elementName);
        i = skipWhitespace(xmlData, i);
        let attributeName = "";
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          attributeName += xmlData[i];
          i++;
        }
        if (!validateEntityName(attributeName)) {
          throw new Error(`Invalid attribute name: "${attributeName}"`);
        }
        i = skipWhitespace(xmlData, i);
        let attributeType = "";
        if (xmlData.substring(i, i + 8).toUpperCase() === "NOTATION") {
          attributeType = "NOTATION";
          i += 8;
          i = skipWhitespace(xmlData, i);
          if (xmlData[i] !== "(") {
            throw new Error(`Expected '(', found "${xmlData[i]}"`);
          }
          i++;
          let allowedNotations = [];
          while (i < xmlData.length && xmlData[i] !== ")") {
            let notation = "";
            while (i < xmlData.length && xmlData[i] !== "|" && xmlData[i] !== ")") {
              notation += xmlData[i];
              i++;
            }
            notation = notation.trim();
            if (!validateEntityName(notation)) {
              throw new Error(`Invalid notation name: "${notation}"`);
            }
            allowedNotations.push(notation);
            if (xmlData[i] === "|") {
              i++;
              i = skipWhitespace(xmlData, i);
            }
          }
          if (xmlData[i] !== ")") {
            throw new Error("Unterminated list of notations");
          }
          i++;
          attributeType += " (" + allowedNotations.join("|") + ")";
        } else {
          while (i < xmlData.length && !/\s/.test(xmlData[i])) {
            attributeType += xmlData[i];
            i++;
          }
          const validTypes = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
          if (!this.suppressValidationErr && !validTypes.includes(attributeType.toUpperCase())) {
            throw new Error(`Invalid attribute type: "${attributeType}"`);
          }
        }
        i = skipWhitespace(xmlData, i);
        let defaultValue = "";
        if (xmlData.substring(i, i + 8).toUpperCase() === "#REQUIRED") {
          defaultValue = "#REQUIRED";
          i += 8;
        } else if (xmlData.substring(i, i + 7).toUpperCase() === "#IMPLIED") {
          defaultValue = "#IMPLIED";
          i += 7;
        } else {
          [i, defaultValue] = this.readIdentifierVal(xmlData, i, "ATTLIST");
        }
        return {
          elementName,
          attributeName,
          attributeType,
          defaultValue,
          index: i
        };
      }
    };
    var skipWhitespace = (data, index2) => {
      while (index2 < data.length && /\s/.test(data[index2])) {
        index2++;
      }
      return index2;
    };
    function hasSeq(data, seq, i) {
      for (let j = 0; j < seq.length; j++) {
        if (seq[j] !== data[i + j + 1]) return false;
      }
      return true;
    }
    function validateEntityName(name) {
      if (util.isName(name))
        return name;
      else
        throw new Error(`Invalid entity name ${name}`);
    }
    module2.exports = DocTypeReader;
  }
});

// ../../node_modules/.pnpm/strnum@1.1.2/node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "../../node_modules/.pnpm/strnum@1.1.2/node_modules/strnum/strnum.js"(exports2, module2) {
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
    var consider = {
      hex: true,
      // oct: false,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
      //skipLike: /regex/
    };
    function toNumber(str2, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str2 || typeof str2 !== "string") return str2;
      let trimmedStr = str2.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str2;
      else if (str2 === "0") return 0;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return parse_int(trimmedStr, 16);
      } else if (trimmedStr.search(/[eE]/) !== -1) {
        const notation = trimmedStr.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
        if (notation) {
          if (options.leadingZeros) {
            trimmedStr = (notation[1] || "") + notation[3];
          } else {
            if (notation[2] === "0" && notation[3][0] === ".") {
            } else {
              return str2;
            }
          }
          return options.eNotation ? Number(trimmedStr) : str2;
        } else {
          return str2;
        }
      } else {
        const match2 = numRegex.exec(trimmedStr);
        if (match2) {
          const sign3 = match2[1];
          const leadingZeros = match2[2];
          let numTrimmedByZeros = trimZeros(match2[3]);
          if (!options.leadingZeros && leadingZeros.length > 0 && sign3 && trimmedStr[2] !== ".") return str2;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign3 && trimmedStr[1] !== ".") return str2;
          else if (options.leadingZeros && leadingZeros === str2) return 0;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation) return num;
              else return str2;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "") return num;
              else if (numStr === numTrimmedByZeros) return num;
              else if (sign3 && numStr === "-" + numTrimmedByZeros) return num;
              else return str2;
            }
            if (leadingZeros) {
              return numTrimmedByZeros === numStr || sign3 + numTrimmedByZeros === numStr ? num : str2;
            } else {
              return trimmedStr === numStr || trimmedStr === sign3 + numStr ? num : str2;
            }
          }
        } else {
          return str2;
        }
      }
    }
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".") numStr = "0";
        else if (numStr[0] === ".") numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    function parse_int(numStr, base) {
      if (parseInt) return parseInt(numStr, base);
      else if (Number.parseInt) return Number.parseInt(numStr, base);
      else if (window && window.parseInt) return window.parseInt(numStr, base);
      else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
    }
    module2.exports = toNumber;
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/ignoreAttributes.js
var require_ignoreAttributes = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/ignoreAttributes.js"(exports2, module2) {
    function getIgnoreAttributesFn(ignoreAttributes) {
      if (typeof ignoreAttributes === "function") {
        return ignoreAttributes;
      }
      if (Array.isArray(ignoreAttributes)) {
        return (attrName) => {
          for (const pattern of ignoreAttributes) {
            if (typeof pattern === "string" && attrName === pattern) {
              return true;
            }
            if (pattern instanceof RegExp && pattern.test(attrName)) {
              return true;
            }
          }
        };
      }
      return () => false;
    }
    module2.exports = getIgnoreAttributesFn;
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports2, module2) {
    "use strict";
    var util = require_util();
    var xmlNode = require_xmlNode();
    var DocTypeReader = require_DocTypeReader();
    var toNumber = require_strnum();
    var getIgnoreAttributesFn = require_ignoreAttributes();
    var OrderedObjParser = class {
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
          // "lt" : { regex: /&(lt|#60);/g, val: "<" },
          // "gt" : { regex: /&(gt|#62);/g, val: ">" },
          // "amp" : { regex: /&(amp|#38);/g, val: "&" },
          // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
          // "apos" : { regex: /&(apos|#39);/g, val: "'" },
          "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
          "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
          "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
          "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
          "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
          "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
          "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" },
          "num_dec": { regex: /&#([0-9]{1,7});/g, val: (_, str2) => fromCodePoint(str2, 10, "&#") },
          "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_, str2) => fromCodePoint(str2, 16, "&#x") }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
        this.addChild = addChild;
        this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
        this.entityExpansionCount = 0;
        this.currentExpandedLength = 0;
        if (this.options.stopNodes && this.options.stopNodes.length > 0) {
          this.stopNodesExact = /* @__PURE__ */ new Set();
          this.stopNodesWildcard = /* @__PURE__ */ new Set();
          for (let i = 0; i < this.options.stopNodes.length; i++) {
            const stopNodeExp = this.options.stopNodes[i];
            if (typeof stopNodeExp !== "string") continue;
            if (stopNodeExp.startsWith("*.")) {
              this.stopNodesWildcard.add(stopNodeExp.substring(2));
            } else {
              this.stopNodesExact.add(stopNodeExp);
            }
          }
        }
      }
    };
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i = 0; i < entKeys.length; i++) {
        const ent = entKeys[i];
        const escaped = ent.replace(/[.\-+*:]/g, "\\.");
        this.lastEntities[ent] = {
          regex: new RegExp("&" + escaped + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val = val.trim();
        }
        if (val.length > 0) {
          if (!escapeEntities) val = this.replaceEntitiesValue(val, tagName, jPath);
          const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val;
          } else if (typeof newval !== typeof val || newval !== val) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val.trim();
            if (trimmedVal === val) {
              return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val;
            }
          }
        }
      }
    }
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath, tagName) {
      if (this.options.ignoreAttributes !== true && typeof attrStr === "string") {
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i = 0; i < len; i++) {
          const attrName = this.resolveNameSpace(matches[i][1]);
          if (this.ignoreAttributesFn(attrName, jPath)) {
            continue;
          }
          let oldVal = matches[i][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            aName = sanitizeName(aName, this.options);
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal, tagName, jPath);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(
                  oldVal,
                  this.options.parseAttributeValue,
                  this.options.numberParseOptions
                );
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    var parseXml = function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      this.entityExpansionCount = 0;
      this.currentExpandedLength = 0;
      const docTypeReader = new DocTypeReader(this.options.processEntities);
      for (let i = 0; i < xmlData.length; i++) {
        const ch = xmlData[i];
        if (ch === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
            if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
              throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
            }
            let propIndex = 0;
            if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
              propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
              this.tagsNodeStack.pop();
            } else {
              propIndex = jPath.lastIndexOf(".");
            }
            jPath = jPath.substring(0, propIndex);
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            let tagData = readTagExp(xmlData, i, false, "?>");
            if (!tagData) throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
            } else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
              }
              this.addChild(currentNode, childNode, jPath, i);
            }
            i = tagData.closeIndex + 1;
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
            }
            i = endIndex;
          } else if (xmlData.substr(i + 1, 2) === "!D") {
            const result = docTypeReader.readDocType(xmlData, i);
            this.docTypeEntities = result.entities;
            i = result.i;
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
            if (val == void 0) val = "";
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
            } else {
              currentNode.add(this.options.textNodeName, val);
            }
            i = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
            let tagName = result.tagName;
            const rawTagName = result.rawTagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              const newTagName = this.options.transformTagName(tagName);
              if (tagExp === tagName) {
                tagExp = newTagName;
              }
              tagName = newTagName;
            }
            if (this.options.strictReservedNames && (tagName === this.options.commentPropName || tagName === this.options.cdataPropName || tagName === this.options.textNodeName || tagName === this.options.attributesGroupName)) {
              throw new Error(`Invalid tag name: ${tagName}`);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
              jPath = jPath.substring(0, jPath.lastIndexOf("."));
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            const startIndex = i;
            if (this.isItStopNode(this.stopNodesExact, this.stopNodesWildcard, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                i = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
                if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
                i = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              this.addChild(currentNode, childNode, jPath, startIndex);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  const newTagName = this.options.transformTagName(tagName);
                  if (tagExp === tagName) {
                    tagExp = newTagName;
                  }
                  tagName = newTagName;
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath, startIndex);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
                }
                this.addChild(currentNode, childNode, jPath, startIndex);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
                i = result.closeIndex;
                continue;
              } else {
                const childNode = new xmlNode(tagName);
                if (this.tagsNodeStack.length > this.options.maxNestedTags) {
                  throw new Error("Maximum nested tags exceeded");
                }
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                currentNode = childNode;
              }
              textData = "";
              i = closeIndex;
            }
          }
        } else {
          textData += xmlData[i];
        }
      }
      return xmlObj.child;
    };
    function addChild(currentNode, childNode, jPath, startIndex) {
      if (!this.options.captureMetaData) startIndex = void 0;
      const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
      if (result === false) {
      } else if (typeof result === "string") {
        childNode.tagname = result;
        currentNode.addChild(childNode, startIndex);
      } else {
        currentNode.addChild(childNode, startIndex);
      }
    }
    var replaceEntitiesValue = function(val, tagName, jPath) {
      if (val.indexOf("&") === -1) {
        return val;
      }
      const entityConfig = this.options.processEntities;
      if (!entityConfig.enabled) {
        return val;
      }
      if (entityConfig.allowedTags) {
        if (!entityConfig.allowedTags.includes(tagName)) {
          return val;
        }
      }
      if (entityConfig.tagFilter) {
        if (!entityConfig.tagFilter(tagName, jPath)) {
          return val;
        }
      }
      for (let entityName in this.docTypeEntities) {
        const entity = this.docTypeEntities[entityName];
        const matches = val.match(entity.regx);
        if (matches) {
          this.entityExpansionCount += matches.length;
          if (entityConfig.maxTotalExpansions && this.entityExpansionCount > entityConfig.maxTotalExpansions) {
            throw new Error(
              `Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
            );
          }
          const lengthBefore = val.length;
          val = val.replace(entity.regx, entity.val);
          if (entityConfig.maxExpandedLength) {
            this.currentExpandedLength += val.length - lengthBefore;
            if (this.currentExpandedLength > entityConfig.maxExpandedLength) {
              throw new Error(
                `Total expanded content size exceeded: ${this.currentExpandedLength} > ${entityConfig.maxExpandedLength}`
              );
            }
          }
        }
      }
      if (val.indexOf("&") === -1) return val;
      for (const entityName of Object.keys(this.lastEntities)) {
        const entity = this.lastEntities[entityName];
        const matches = val.match(entity.regex);
        if (matches) {
          this.entityExpansionCount += matches.length;
          if (entityConfig.maxTotalExpansions && this.entityExpansionCount > entityConfig.maxTotalExpansions) {
            throw new Error(
              `Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
            );
          }
        }
        val = val.replace(entity.regex, entity.val);
      }
      if (val.indexOf("&") === -1) return val;
      if (this.options.htmlEntities) {
        for (const entityName of Object.keys(this.htmlEntities)) {
          const entity = this.htmlEntities[entityName];
          const matches = val.match(entity.regex);
          if (matches) {
            this.entityExpansionCount += matches.length;
            if (entityConfig.maxTotalExpansions && this.entityExpansionCount > entityConfig.maxTotalExpansions) {
              throw new Error(
                `Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
              );
            }
          }
          val = val.replace(entity.regex, entity.val);
        }
      }
      val = val.replace(this.ampEntity.regex, this.ampEntity.val);
      return val;
    };
    function saveTextToParentTag(textData, parentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0) isLeafNode = parentNode.child.length === 0;
        textData = this.parseTextData(
          textData,
          parentNode.tagname,
          jPath,
          false,
          parentNode[":@"] ? Object.keys(parentNode[":@"]).length !== 0 : false,
          isLeafNode
        );
        if (textData !== void 0 && textData !== "")
          parentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    function isItStopNode(stopNodesExact, stopNodesWildcard, jPath, currentTagName) {
      if (stopNodesWildcard && stopNodesWildcard.has(currentTagName)) return true;
      if (stopNodesExact && stopNodesExact.has(jPath)) return true;
      return false;
    }
    function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index2 = i; index2 < xmlData.length; index2++) {
        let ch = xmlData[index2];
        if (attrBoundary) {
          if (ch === attrBoundary) attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index2 + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index: index2
              };
            }
          } else {
            return {
              data: tagExp,
              index: index2
            };
          }
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    function findClosingIndex(xmlData, str2, i, errMsg) {
      const closingIndex = xmlData.indexOf(str2, i);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str2.length - 1;
      }
    }
    function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
      if (!result) return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substring(0, separatorIndex);
        tagExp = tagExp.substring(separatorIndex + 1).trimStart();
      }
      const rawTagName = tagName;
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent,
        rawTagName
      };
    }
    function readStopNodeData(xmlData, tagName, i) {
      const startIndex = i;
      let openTagCount = 1;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i),
                  i: closeIndex
                };
              }
            }
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
            i = closeIndex;
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
            i = closeIndex;
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
            i = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i = tagData.closeIndex;
            }
          }
        }
      }
    }
    function parseValue(val, shouldParse, options) {
      if (shouldParse && typeof val === "string") {
        const newval = val.trim();
        if (newval === "true") return true;
        else if (newval === "false") return false;
        else return toNumber(val, options);
      } else {
        if (util.isExist(val)) {
          return val;
        } else {
          return "";
        }
      }
    }
    function fromCodePoint(str2, base, prefix) {
      const codePoint = Number.parseInt(str2, base);
      if (codePoint >= 0 && codePoint <= 1114111) {
        return String.fromCodePoint(codePoint);
      } else {
        return prefix + str2 + ";";
      }
    }
    function sanitizeName(name, options) {
      if (util.criticalProperties.includes(name)) {
        throw new Error(`[SECURITY] Invalid name: "${name}" is a reserved JavaScript keyword that could cause prototype pollution`);
      } else if (util.DANGEROUS_PROPERTY_NAMES.includes(name)) {
        return options.onDangerousProperty(name);
      }
      return name;
    }
    module2.exports = OrderedObjParser;
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports2) {
    "use strict";
    function prettify(node, options) {
      return compress(node, options);
    }
    function compress(arr2, options, jPath) {
      let text2;
      const compressedObj = {};
      for (let i = 0; i < arr2.length; i++) {
        const tagObj = arr2[i];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0) newJpath = property;
        else newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text2 === void 0) text2 = tagObj[property];
          else text2 += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val, options);
          if (tagObj[":@"]) {
            assignAttributes(val, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val = val[options.textNodeName];
          } else if (Object.keys(val).length === 0) {
            if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
            else val = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val];
            } else {
              compressedObj[property] = val;
            }
          }
        }
      }
      if (typeof text2 === "string") {
        if (text2.length > 0) compressedObj[options.textNodeName] = text2;
      } else if (text2 !== void 0) compressedObj[options.textNodeName] = text2;
      return compressedObj;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== ":@") return key;
      }
    }
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          const atrrName = keys[i];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    function isLeafTag(obj, options) {
      const { textNodeName } = options;
      const propCount = Object.keys(obj).length;
      if (propCount === 0) {
        return true;
      }
      if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
        return true;
      }
      return false;
    }
    exports2.prettify = prettify;
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports2, module2) {
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser3 = class {
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object 
       * @param {string|Buffer} xmlData 
       * @param {boolean|Object} validationOption 
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") {
        } else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true) validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
        else return prettify(orderedResult, this.options);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key 
       * @param {string} value 
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module2.exports = XMLParser3;
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports2, module2) {
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    function arrToStr(arr2, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      if (!Array.isArray(arr2)) {
        if (arr2 !== void 0 && arr2 !== null) {
          let text2 = arr2.toString();
          text2 = replaceEntitiesValue(text2, options);
          return text2;
        }
        return "";
      }
      for (let i = 0; i < arr2.length; i++) {
        const tagObj = arr2[i];
        const tagName = propName(tagObj);
        if (tagName === void 0) continue;
        let newJPath = "";
        if (jPath.length === 0) newJPath = tagName;
        else newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
          else xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
        if (key !== ":@") return key;
      }
    }
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          if (!Object.prototype.hasOwnProperty.call(attrMap, attr)) continue;
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index2 in options.stopNodes) {
        if (options.stopNodes[index2] === jPath || options.stopNodes[index2] === "*." + tagName) return true;
      }
      return false;
    }
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i = 0; i < options.entities.length; i++) {
          const entity = options.entities[i];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    module2.exports = toXml;
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports2, module2) {
    "use strict";
    var buildFromOrderedJs = require_orderedJs2Xml();
    var getIgnoreAttributesFn = require_ignoreAttributes();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: function(key, a2) {
        return a2;
      },
      attributeValueProcessor: function(attrName, a2) {
        return a2;
      },
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        { regex: new RegExp("&", "g"), val: "&amp;" },
        //it must be on top
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: [],
      // transformTagName: false,
      // transformAttributeName: false,
      oneListGroup: false
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes === true || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
    }
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0, []).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level, ajPath) {
      let attrStr = "";
      let val = "";
      const jPath = ajPath.join(".");
      for (let key in jObj) {
        if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
        if (typeof jObj[key] === "undefined") {
          if (this.isAttribute(key)) {
            val += "";
          }
        } else if (jObj[key] === null) {
          if (this.isAttribute(key)) {
            val += "";
          } else if (key === this.options.cdataPropName) {
            val += "";
          } else if (key[0] === "?") {
            val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          } else {
            val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          }
        } else if (jObj[key] instanceof Date) {
          val += this.buildTextValNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr && !this.ignoreAttributesFn(attr, jPath)) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else if (!attr) {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val += this.replaceEntitiesValue(newval);
            } else {
              val += this.buildTextValNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          let listTagVal = "";
          let listTagAttr = "";
          for (let j = 0; j < arrLen; j++) {
            const item = jObj[key][j];
            if (typeof item === "undefined") {
            } else if (item === null) {
              if (key[0] === "?") val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              if (this.options.oneListGroup) {
                const result = this.j2x(item, level + 1, ajPath.concat(key));
                listTagVal += result.val;
                if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                  listTagAttr += result.attrStr;
                }
              } else {
                listTagVal += this.processTextOrObjNode(item, key, level, ajPath);
              }
            } else {
              if (this.options.oneListGroup) {
                let textValue = this.options.tagValueProcessor(key, item);
                textValue = this.replaceEntitiesValue(textValue);
                listTagVal += textValue;
              } else {
                listTagVal += this.buildTextValNode(item, key, "", level);
              }
            }
          }
          if (this.options.oneListGroup) {
            listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
          }
          val += listTagVal;
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks2 = Object.keys(jObj[key]);
            const L = Ks2.length;
            for (let j = 0; j < L; j++) {
              attrStr += this.buildAttrPairStr(Ks2[j], "" + jObj[key][Ks2[j]]);
            }
          } else {
            val += this.processTextOrObjNode(jObj[key], key, level, ajPath);
          }
        }
      }
      return { attrStr, val };
    };
    Builder.prototype.buildAttrPairStr = function(attrName, val) {
      val = this.options.attributeValueProcessor(attrName, "" + val);
      val = this.replaceEntitiesValue(val);
      if (this.options.suppressBooleanAttributes && val === "true") {
        return " " + attrName;
      } else return " " + attrName + '="' + val + '"';
    };
    function processTextOrObjNode(object, key, level, ajPath) {
      const result = this.j2x(object, level + 1, ajPath.concat(key));
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjectNode(result.val, key, result.attrStr, level);
      }
    }
    Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
      if (val === "") {
        if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        }
      } else {
        let tagEndExp = "</" + key + this.tagEndChar;
        let piClosingChar = "";
        if (key[0] === "?") {
          piClosingChar = "?";
          tagEndExp = "";
        }
        if ((attrStr || attrStr === "") && val.indexOf("<") === -1) {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
          return this.indentate(level) + `<!--${val}-->` + this.newLine;
        } else {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
        }
      }
    };
    Builder.prototype.closeTag = function(key) {
      let closeTag = "";
      if (this.options.unpairedTags.indexOf(key) !== -1) {
        if (!this.options.suppressUnpairedNode) closeTag = "/";
      } else if (this.options.suppressEmptyNode) {
        closeTag = "/";
      } else {
        closeTag = `></${key}`;
      }
      return closeTag;
    };
    Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val}-->` + this.newLine;
      } else if (key[0] === "?") {
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      } else {
        let textValue = this.options.tagValueProcessor(key, val);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "") {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    };
    Builder.prototype.replaceEntitiesValue = function(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i = 0; i < this.options.entities.length; i++) {
          const entity = this.options.entities[i];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    };
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    module2.exports = Builder;
  }
});

// ../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "../../node_modules/.pnpm/fast-xml-parser@4.5.5/node_modules/fast-xml-parser/src/fxp.js"(exports2, module2) {
    "use strict";
    var validator = require_validator();
    var XMLParser3 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module2.exports = {
      XMLParser: XMLParser3,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// src/vercel-entry.ts
var vercel_entry_exports = {};
__export(vercel_entry_exports, {
  DELETE: () => DELETE,
  GET: () => GET,
  PATCH: () => PATCH,
  POST: () => POST
});
module.exports = __toCommonJS(vercel_entry_exports);

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/adapter/vercel/handler.js
var handle = (app2) => (req) => {
  return app2.fetch(req);
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index2 = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index2) {
        throw new Error("next() called multiple times");
      }
      index2 = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index2) => {
    if (index2 === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index2) => {
    const mark = `@${index2}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str2, decoder) => {
  try {
    return decoder(str2);
  } catch {
    return str2.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str2) => tryDecode(str2, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v2, i, a2) => a2.indexOf(v2) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str2) => tryDecode(str2, decodeURIComponent_);
var HonoRequest = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text2) => JSON.parse(text2));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str2, phase, preserveCallbacks, context, buffer) => {
  if (typeof str2 === "object" && !(str2 instanceof String)) {
    if (!(str2 instanceof Promise)) {
      str2 = str2.toString();
    }
    if (str2 instanceof Promise) {
      str2 = await str2;
    }
  }
  const callbacks = str2.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str2);
  }
  if (buffer) {
    buffer[0] += str2;
  } else {
    buffer = [str2];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str22) => resolveCallback(str22, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v2] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v2);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v2] of Object.entries(headers)) {
        if (typeof v2 === "string") {
          responseHeaders.set(k, v2);
        } else {
          responseHeaders.delete(k);
          for (const v22 of v2) {
            responseHeaders.append(k, v22);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text2, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text2) : this.#newResponse(
      text2,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p2 of [path].flat()) {
        this.#path = p2;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index2 = match3.indexOf("", 1);
    return [matcher[1][index2], match3];
  });
  this.match = match2;
  return match2(method, path);
}

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a2, b2) {
  if (a2.length === 1) {
    return b2.length === 1 ? a2 < b2 ? -1 : 1 : -1;
  }
  if (b2.length === 1) {
    return 1;
  }
  if (a2 === ONLY_WILDCARD_REG_EXP_STR || a2 === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b2 === ONLY_WILDCARD_REG_EXP_STR || b2 === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a2 === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b2 === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a2.length === b2.length ? a2 < b2 ? -1 : 1 : b2.length - a2.length;
}
var Node = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index2, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index2;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index2, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index2, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index2, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h2]) => [h2, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h2, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h2, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a2, b2) => b2.length - a2.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p2) => {
          handlerMap[method][p2] = [...handlerMap[METHOD_NAME_ALL][p2]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p2) => {
            re.test(p2) && middleware[m][p2].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p2) => re.test(p2) && routes[m][p2].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
  for (const _ in children) {
    return true;
  }
  return false;
};
var Node2 = class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p2 = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p2, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p2;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v2, i, a2) => a2.indexOf(v2) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p2 = 0; p2 < len; p2++) {
                partOffsets[p2] = offset;
                offset += parts[p2].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a2, b2) => {
        return a2.score - b2.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/entity.js
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/column.js
var Column = class {
  constructor(table, config) {
    this.table = table;
    this.config = config;
    this.name = config.name;
    this.keyAsName = config.keyAsName;
    this.notNull = config.notNull;
    this.default = config.default;
    this.defaultFn = config.defaultFn;
    this.onUpdateFn = config.onUpdateFn;
    this.hasDefault = config.hasDefault;
    this.primary = config.primaryKey;
    this.isUnique = config.isUnique;
    this.uniqueName = config.uniqueName;
    this.uniqueType = config.uniqueType;
    this.dataType = config.dataType;
    this.columnType = config.columnType;
    this.generated = config.generated;
    this.generatedIdentity = config.generatedIdentity;
  }
  static [entityKind] = "Column";
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  generated = void 0;
  generatedIdentity = void 0;
  config;
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/column-builder.js
var ColumnBuilder = class {
  static [entityKind] = "ColumnBuilder";
  config;
  constructor(name, dataType, columnType) {
    this.config = {
      name,
      keyAsName: name === "",
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType,
      columnType,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    this.config.notNull = true;
    return this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $defaultFn}.
   */
  $default = this.$defaultFn;
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $onUpdateFn}.
   */
  $onUpdate = this.$onUpdateFn;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(name) {
    if (this.config.name !== "")
      return;
    this.config.name = name;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/table.utils.js
var TableName = Symbol.for("drizzle:Name");

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/foreign-keys.js
var ForeignKeyBuilder = class {
  static [entityKind] = "PgForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate = "no action";
  /** @internal */
  _onDelete = "no action";
  constructor(config, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action === void 0 ? "no action" : action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action === void 0 ? "no action" : action;
    return this;
  }
  /** @internal */
  build(table) {
    return new ForeignKey(table, this);
  }
};
var ForeignKey = class {
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  static [entityKind] = "PgForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
  return fn(...args);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/unique-constraint.js
function uniqueKeyName(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder = class {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [entityKind] = "PgUniqueConstraintBuilder";
  /** @internal */
  columns;
  /** @internal */
  nullsNotDistinctConfig = false;
  nullsNotDistinct() {
    this.nullsNotDistinctConfig = true;
    return this;
  }
  /** @internal */
  build(table) {
    return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
  }
};
var UniqueOnConstraintBuilder = class {
  static [entityKind] = "PgUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
};
var UniqueConstraint = class {
  constructor(table, columns, nullsNotDistinct, name) {
    this.table = table;
    this.columns = columns;
    this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
    this.nullsNotDistinct = nullsNotDistinct;
  }
  static [entityKind] = "PgUniqueConstraint";
  columns;
  name;
  nullsNotDistinct = false;
  getName() {
    return this.name;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/utils/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char2 = arrayString[i];
    if (char2 === "\\") {
      i++;
      continue;
    }
    if (char2 === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char2 === "," || char2 === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char2 = arrayString[i];
    if (char2 === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char2 === "\\") {
      i += 2;
      continue;
    }
    if (char2 === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char2 === "}") {
      return [result, i + 1];
    }
    if (char2 === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
function makePgArray(array) {
  return `{${array.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string") {
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder = class extends ColumnBuilder {
  foreignKeyConfigs = [];
  static [entityKind] = "PgColumnBuilder";
  array(size) {
    return new PgArrayBuilder(this.config.name, this, size);
  }
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name, config) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    this.config.uniqueType = config?.nulls;
    return this;
  }
  generatedAlwaysAs(as2) {
    this.config.generated = {
      as: as2,
      type: "always",
      mode: "stored"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return iife(
        (ref2, actions2) => {
          const builder = new ForeignKeyBuilder(() => {
            const foreignColumn = ref2();
            return { columns: [column], foreignColumns: [foreignColumn] };
          });
          if (actions2.onUpdate) {
            builder.onUpdate(actions2.onUpdate);
          }
          if (actions2.onDelete) {
            builder.onDelete(actions2.onDelete);
          }
          return builder.build(table);
        },
        ref,
        actions
      );
    });
  }
  /** @internal */
  buildExtraConfigColumn(table) {
    return new ExtraConfigColumn(table, this.config);
  }
};
var PgColumn = class extends Column {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [entityKind] = "PgColumn";
};
var ExtraConfigColumn = class extends PgColumn {
  static [entityKind] = "ExtraConfigColumn";
  getSQLType() {
    return this.getSQLType();
  }
  indexConfig = {
    order: this.config.order ?? "asc",
    nulls: this.config.nulls ?? "last",
    opClass: this.config.opClass
  };
  defaultConfig = {
    order: "asc",
    nulls: "last",
    opClass: void 0
  };
  asc() {
    this.indexConfig.order = "asc";
    return this;
  }
  desc() {
    this.indexConfig.order = "desc";
    return this;
  }
  nullsFirst() {
    this.indexConfig.nulls = "first";
    return this;
  }
  nullsLast() {
    this.indexConfig.nulls = "last";
    return this;
  }
  /**
   * ### PostgreSQL documentation quote
   *
   * > An operator class with optional parameters can be specified for each column of an index.
   * The operator class identifies the operators to be used by the index for that column.
   * For example, a B-tree index on four-byte integers would use the int4_ops class;
   * this operator class includes comparison functions for four-byte integers.
   * In practice the default operator class for the column's data type is usually sufficient.
   * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
   * For example, we might want to sort a complex-number data type either by absolute value or by real part.
   * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
   * More information about operator classes check:
   *
   * ### Useful links
   * https://www.postgresql.org/docs/current/sql-createindex.html
   *
   * https://www.postgresql.org/docs/current/indexes-opclass.html
   *
   * https://www.postgresql.org/docs/current/xindex.html
   *
   * ### Additional types
   * If you have the `pg_vector` extension installed in your database, you can use the
   * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
   *
   * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
   *
   * @param opClass
   * @returns
   */
  op(opClass) {
    this.indexConfig.opClass = opClass;
    return this;
  }
};
var IndexedColumn = class {
  static [entityKind] = "IndexedColumn";
  constructor(name, keyAsName, type, indexConfig) {
    this.name = name;
    this.keyAsName = keyAsName;
    this.type = type;
    this.indexConfig = indexConfig;
  }
  name;
  keyAsName;
  type;
  indexConfig;
};
var PgArrayBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgArrayBuilder";
  constructor(name, baseBuilder, size) {
    super(name, "array", "PgArray");
    this.config.baseBuilder = baseBuilder;
    this.config.size = size;
  }
  /** @internal */
  build(table) {
    const baseColumn = this.config.baseBuilder.build(table);
    return new PgArray(
      table,
      this.config,
      baseColumn
    );
  }
};
var PgArray = class _PgArray extends PgColumn {
  constructor(table, config, baseColumn, range) {
    super(table, config);
    this.baseColumn = baseColumn;
    this.range = range;
    this.size = config.size;
  }
  size;
  static [entityKind] = "PgArray";
  getSQLType() {
    return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      value = parsePgArray(value);
    }
    return value.map((v2) => this.baseColumn.mapFromDriverValue(v2));
  }
  mapToDriverValue(value, isNestedArray = false) {
    const a2 = value.map(
      (v2) => v2 === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v2, true) : this.baseColumn.mapToDriverValue(v2)
    );
    if (isNestedArray)
      return a2;
    return makePgArray(a2);
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/enum.js
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
var PgEnumColumnBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgEnumColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table) {
    return new PgEnumColumn(
      table,
      this.config
    );
  }
};
var PgEnumColumn = class extends PgColumn {
  static [entityKind] = "PgEnumColumn";
  enum = this.config.enum;
  enumValues = this.config.enum.enumValues;
  constructor(table, config) {
    super(table, config);
    this.enum = config.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/subquery.js
var Subquery = class {
  static [entityKind] = "Subquery";
  constructor(sql2, selection, alias, isWith = false) {
    this._ = {
      brand: "Subquery",
      sql: sql2,
      selectedFields: selection,
      alias,
      isWith
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
};
var WithSubquery = class extends Subquery {
  static [entityKind] = "WithSubquery";
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/version.js
var version = "0.41.0";

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/tracing.js
var otel;
var rawTracer;
var tracer = {
  startActiveSpan(name, fn) {
    if (!otel) {
      return fn();
    }
    if (!rawTracer) {
      rawTracer = otel.trace.getTracer("drizzle-orm", version);
    }
    return iife(
      (otel2, rawTracer2) => rawTracer2.startActiveSpan(
        name,
        (span) => {
          try {
            return fn(span);
          } catch (e) {
            span.setStatus({
              code: otel2.SpanStatusCode.ERROR,
              message: e instanceof Error ? e.message : "Unknown error"
              // eslint-disable-line no-instanceof/no-instanceof
            });
            throw e;
          } finally {
            span.end();
          }
        }
      ),
      otel,
      rawTracer
    );
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/table.js
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
  static [entityKind] = "Table";
  /** @internal */
  static Symbol = {
    Name: TableName,
    Schema,
    OriginalName,
    Columns,
    ExtraConfigColumns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [TableName];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName];
  /** @internal */
  [Schema];
  /** @internal */
  [Columns];
  /** @internal */
  [ExtraConfigColumns];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName];
  /** @internal */
  [IsAlias] = false;
  /** @internal */
  [IsDrizzleTable] = true;
  /** @internal */
  [ExtraConfigBuilder] = void 0;
  constructor(name, schema, baseName) {
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema;
    this[BaseName] = baseName;
  }
};
function getTableName(table) {
  return table[TableName];
}
function getTableUniqueName(table) {
  return `${table[Schema] ?? "public"}.${table[TableName]}`;
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/sql/sql.js
var FakePrimitiveParam = class {
  static [entityKind] = "FakePrimitiveParam";
};
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
var StringChunk = class {
  static [entityKind] = "StringChunk";
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
};
var SQL = class _SQL {
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
  }
  static [entityKind] = "SQL";
  /** @internal */
  decoder = noopDecoder;
  shouldInlineParams = false;
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const {
      casing,
      escapeName,
      escapeParam,
      prepareTyping,
      inlineParams,
      paramStartIndex
    } = config;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === void 0) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p2] of chunk.entries()) {
          result.push(p2);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config);
      }
      if (is(chunk, _SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        const columnName = casing.getColumnCasing(chunk);
        if (_config.invokeSource === "indexes") {
          return { sql: escapeName(columnName), params: [] };
        }
        const schemaName = chunk.table[Table.Symbol.Schema];
        return {
          sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
          params: []
        };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        if (is(chunk.value, Placeholder)) {
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, _SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config), params: [] };
        }
        let typings = ["none"];
        if (prepareTyping) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
      }
      if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk._.isWith) {
          return { sql: escapeName(chunk._.alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config);
      }
      if (isPgEnum(chunk)) {
        if (chunk.schema) {
          return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
        }
        return { sql: escapeName(chunk.enumName), params: [] };
      }
      if (isSQLWrapper(chunk)) {
        if (chunk.shouldOmitSQLParens?.()) {
          return this.buildQueryFromSourceParams([chunk.getSQL()], config);
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === void 0) {
      return this;
    }
    return new _SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(condition) {
    return condition ? this : void 0;
  }
};
var Name = class {
  constructor(value) {
    this.value = value;
  }
  static [entityKind] = "Name";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
var noopDecoder = {
  mapFromDriverValue: (value) => value
};
var noopEncoder = {
  mapToDriverValue: (value) => value
};
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};
var Param = class {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
  static [entityKind] = "Param";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
((sql2) => {
  function empty() {
    return new SQL([]);
  }
  sql2.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  sql2.fromList = fromList;
  function raw2(str2) {
    return new SQL([new StringChunk(str2)]);
  }
  sql2.raw = raw2;
  function join(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== void 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  sql2.join = join;
  function identifier(value) {
    return new Name(value);
  }
  sql2.identifier = identifier;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
  class Aliased {
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    static [entityKind] = "SQL.Aliased";
    /** @internal */
    isSelectionField = false;
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
  constructor(name2) {
    this.name = name2;
  }
  static [entityKind] = "Placeholder";
  getSQL() {
    return new SQL([this]);
  }
};
function fillPlaceholders(params, values) {
  return params.map((p2) => {
    if (is(p2, Placeholder)) {
      if (!(p2.name in values)) {
        throw new Error(`No value for placeholder "${p2.name}" was provided`);
      }
      return values[p2.name];
    }
    if (is(p2, Param) && is(p2.value, Placeholder)) {
      if (!(p2.value.name in values)) {
        throw new Error(`No value for placeholder "${p2.value.name}" was provided`);
      }
      return p2.encoder.mapToDriverValue(values[p2.value.name]);
    }
    return p2;
  });
}
var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
var View = class {
  static [entityKind] = "View";
  /** @internal */
  [ViewBaseConfig];
  /** @internal */
  [IsDrizzleView] = true;
  constructor({ name: name2, schema, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
};
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Table.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/alias.js
var ColumnAliasProxyHandler = class {
  constructor(table) {
    this.table = table;
  }
  static [entityKind] = "ColumnAliasProxyHandler";
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
};
var TableAliasProxyHandler = class {
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  static [entityKind] = "TableAliasProxyHandler";
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === ViewBaseConfig) {
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(
          columns[key],
          new ColumnAliasProxyHandler(new Proxy(target, this))
        );
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is(value, Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
};
var RelationTableAliasProxyHandler = class {
  constructor(alias) {
    this.alias = alias;
  }
  static [entityKind] = "RelationTableAliasProxyHandler";
  get(target, prop) {
    if (prop === "sourceTable") {
      return aliasedTable(target.sourceTable, this.alias);
    }
    return target[prop];
  }
};
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/errors.js
var DrizzleError = class extends Error {
  static [entityKind] = "DrizzleError";
  constructor({ message, cause }) {
    super(message);
    this.name = "DrizzleError";
    this.cause = cause;
  }
};
var TransactionRollbackError = class extends DrizzleError {
  static [entityKind] = "TransactionRollbackError";
  constructor() {
    super({ message: "Rollback" });
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
var eq = (left, right) => {
  return sql`${left} = ${bindIfParam(right, left)}`;
};
var ne = (left, right) => {
  return sql`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
function not(condition) {
  return sql`not ${condition}`;
}
var gt = (left, right) => {
  return sql`${left} > ${bindIfParam(right, left)}`;
};
var gte = (left, right) => {
  return sql`${left} >= ${bindIfParam(right, left)}`;
};
var lt = (left, right) => {
  return sql`${left} < ${bindIfParam(right, left)}`;
};
var lte = (left, right) => {
  return sql`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`false`;
    }
    return sql`${column} in ${values.map((v2) => bindIfParam(v2, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`true`;
    }
    return sql`${column} not in ${values.map((v2) => bindIfParam(v2, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
  return sql`${value} is null`;
}
function isNotNull(value) {
  return sql`${value} is not null`;
}
function exists(subquery) {
  return sql`exists ${subquery}`;
}
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
  return sql`${column} like ${value}`;
}
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/logger.js
var ConsoleLogWriter = class {
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
};
var DefaultLogger = class {
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config) {
    this.writer = config?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p2) => {
      try {
        return JSON.stringify(p2);
      } catch {
        return String(p2);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
};
var NoopLogger = class {
  static [entityKind] = "NoopLogger";
  logQuery() {
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/query-promise.js
var QueryPromise = class {
  static [entityKind] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index2, key] of leftKeys.entries()) {
    if (key !== rightKeys[index2]) {
      return false;
    }
  }
  return true;
}
function mapUpdateSet(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL) || is(value, Column)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor")
        continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
function getTableColumns(table) {
  return table[Table.Symbol.Columns];
}
function getTableLikeName(table) {
  return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
function getColumnNameAndConfig(a2, b2) {
  return {
    name: typeof a2 === "string" && a2.length > 0 ? a2 : "",
    config: typeof a2 === "object" ? a2 : b2
  };
}
function isConfig(data) {
  if (typeof data !== "object" || data === null)
    return false;
  if (data.constructor.name !== "Object")
    return false;
  if ("logger" in data) {
    const type = typeof data["logger"];
    if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined")
      return false;
    return true;
  }
  if ("schema" in data) {
    const type = typeof data["schema"];
    if (type !== "object" && type !== "undefined")
      return false;
    return true;
  }
  if ("casing" in data) {
    const type = typeof data["casing"];
    if (type !== "string" && type !== "undefined")
      return false;
    return true;
  }
  if ("mode" in data) {
    if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0)
      return false;
    return true;
  }
  if ("connection" in data) {
    const type = typeof data["connection"];
    if (type !== "string" && type !== "object" && type !== "undefined")
      return false;
    return true;
  }
  if ("client" in data) {
    const type = typeof data["client"];
    if (type !== "object" && type !== "function" && type !== "undefined")
      return false;
    return true;
  }
  if (Object.keys(data).length === 0)
    return true;
  return false;
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/int.common.js
var PgIntColumnBaseBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgIntColumnBaseBuilder";
  generatedAlwaysAsIdentity(sequence) {
    if (sequence) {
      const { name, ...options } = sequence;
      this.config.generatedIdentity = {
        type: "always",
        sequenceName: name,
        sequenceOptions: options
      };
    } else {
      this.config.generatedIdentity = {
        type: "always"
      };
    }
    this.config.hasDefault = true;
    this.config.notNull = true;
    return this;
  }
  generatedByDefaultAsIdentity(sequence) {
    if (sequence) {
      const { name, ...options } = sequence;
      this.config.generatedIdentity = {
        type: "byDefault",
        sequenceName: name,
        sequenceOptions: options
      };
    } else {
      this.config.generatedIdentity = {
        type: "byDefault"
      };
    }
    this.config.hasDefault = true;
    this.config.notNull = true;
    return this;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/bigint.js
var PgBigInt53Builder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgBigInt53Builder";
  constructor(name) {
    super(name, "number", "PgBigInt53");
  }
  /** @internal */
  build(table) {
    return new PgBigInt53(table, this.config);
  }
};
var PgBigInt53 = class extends PgColumn {
  static [entityKind] = "PgBigInt53";
  getSQLType() {
    return "bigint";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
};
var PgBigInt64Builder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgBigInt64Builder";
  constructor(name) {
    super(name, "bigint", "PgBigInt64");
  }
  /** @internal */
  build(table) {
    return new PgBigInt64(
      table,
      this.config
    );
  }
};
var PgBigInt64 = class extends PgColumn {
  static [entityKind] = "PgBigInt64";
  getSQLType() {
    return "bigint";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
};
function bigint(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  if (config.mode === "number") {
    return new PgBigInt53Builder(name);
  }
  return new PgBigInt64Builder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/bigserial.js
var PgBigSerial53Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgBigSerial53Builder";
  constructor(name) {
    super(name, "number", "PgBigSerial53");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgBigSerial53(
      table,
      this.config
    );
  }
};
var PgBigSerial53 = class extends PgColumn {
  static [entityKind] = "PgBigSerial53";
  getSQLType() {
    return "bigserial";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
};
var PgBigSerial64Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgBigSerial64Builder";
  constructor(name) {
    super(name, "bigint", "PgBigSerial64");
    this.config.hasDefault = true;
  }
  /** @internal */
  build(table) {
    return new PgBigSerial64(
      table,
      this.config
    );
  }
};
var PgBigSerial64 = class extends PgColumn {
  static [entityKind] = "PgBigSerial64";
  getSQLType() {
    return "bigserial";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
};
function bigserial(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  if (config.mode === "number") {
    return new PgBigSerial53Builder(name);
  }
  return new PgBigSerial64Builder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/boolean.js
var PgBooleanBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "PgBoolean");
  }
  /** @internal */
  build(table) {
    return new PgBoolean(table, this.config);
  }
};
var PgBoolean = class extends PgColumn {
  static [entityKind] = "PgBoolean";
  getSQLType() {
    return "boolean";
  }
};
function boolean(name) {
  return new PgBooleanBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/char.js
var PgCharBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCharBuilder";
  constructor(name, config) {
    super(name, "string", "PgChar");
    this.config.length = config.length;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgChar(
      table,
      this.config
    );
  }
};
var PgChar = class extends PgColumn {
  static [entityKind] = "PgChar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
};
function char(a2, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  return new PgCharBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/cidr.js
var PgCidrBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCidrBuilder";
  constructor(name) {
    super(name, "string", "PgCidr");
  }
  /** @internal */
  build(table) {
    return new PgCidr(table, this.config);
  }
};
var PgCidr = class extends PgColumn {
  static [entityKind] = "PgCidr";
  getSQLType() {
    return "cidr";
  }
};
function cidr(name) {
  return new PgCidrBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/custom.js
var PgCustomColumnBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "PgCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new PgCustomColumn(
      table,
      this.config
    );
  }
};
var PgCustomColumn = class extends PgColumn {
  static [entityKind] = "PgCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table, config) {
    super(table, config);
    this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
    this.mapTo = config.customTypeParams.toDriver;
    this.mapFrom = config.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
};
function customType(customTypeParams) {
  return (a2, b2) => {
    const { name, config } = getColumnNameAndConfig(a2, b2);
    return new PgCustomColumnBuilder(name, config, customTypeParams);
  };
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/date.common.js
var PgDateColumnBaseBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgDateColumnBaseBuilder";
  defaultNow() {
    return this.default(sql`now()`);
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/date.js
var PgDateBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgDateBuilder";
  constructor(name) {
    super(name, "date", "PgDate");
  }
  /** @internal */
  build(table) {
    return new PgDate(table, this.config);
  }
};
var PgDate = class extends PgColumn {
  static [entityKind] = "PgDate";
  getSQLType() {
    return "date";
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
  mapToDriverValue(value) {
    return value.toISOString();
  }
};
var PgDateStringBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgDateStringBuilder";
  constructor(name) {
    super(name, "string", "PgDateString");
  }
  /** @internal */
  build(table) {
    return new PgDateString(
      table,
      this.config
    );
  }
};
var PgDateString = class extends PgColumn {
  static [entityKind] = "PgDateString";
  getSQLType() {
    return "date";
  }
};
function date(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  if (config?.mode === "date") {
    return new PgDateBuilder(name);
  }
  return new PgDateStringBuilder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/double-precision.js
var PgDoublePrecisionBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgDoublePrecisionBuilder";
  constructor(name) {
    super(name, "number", "PgDoublePrecision");
  }
  /** @internal */
  build(table) {
    return new PgDoublePrecision(
      table,
      this.config
    );
  }
};
var PgDoublePrecision = class extends PgColumn {
  static [entityKind] = "PgDoublePrecision";
  getSQLType() {
    return "double precision";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    return value;
  }
};
function doublePrecision(name) {
  return new PgDoublePrecisionBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/inet.js
var PgInetBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgInetBuilder";
  constructor(name) {
    super(name, "string", "PgInet");
  }
  /** @internal */
  build(table) {
    return new PgInet(table, this.config);
  }
};
var PgInet = class extends PgColumn {
  static [entityKind] = "PgInet";
  getSQLType() {
    return "inet";
  }
};
function inet(name) {
  return new PgInetBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/integer.js
var PgIntegerBuilder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgIntegerBuilder";
  constructor(name) {
    super(name, "number", "PgInteger");
  }
  /** @internal */
  build(table) {
    return new PgInteger(table, this.config);
  }
};
var PgInteger = class extends PgColumn {
  static [entityKind] = "PgInteger";
  getSQLType() {
    return "integer";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseInt(value);
    }
    return value;
  }
};
function integer(name) {
  return new PgIntegerBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/interval.js
var PgIntervalBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgIntervalBuilder";
  constructor(name, intervalConfig) {
    super(name, "string", "PgInterval");
    this.config.intervalConfig = intervalConfig;
  }
  /** @internal */
  build(table) {
    return new PgInterval(table, this.config);
  }
};
var PgInterval = class extends PgColumn {
  static [entityKind] = "PgInterval";
  fields = this.config.intervalConfig.fields;
  precision = this.config.intervalConfig.precision;
  getSQLType() {
    const fields = this.fields ? ` ${this.fields}` : "";
    const precision = this.precision ? `(${this.precision})` : "";
    return `interval${fields}${precision}`;
  }
};
function interval(a2, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  return new PgIntervalBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/json.js
var PgJsonBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgJsonBuilder";
  constructor(name) {
    super(name, "json", "PgJson");
  }
  /** @internal */
  build(table) {
    return new PgJson(table, this.config);
  }
};
var PgJson = class extends PgColumn {
  static [entityKind] = "PgJson";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "json";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
};
function json(name) {
  return new PgJsonBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/jsonb.js
var PgJsonbBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgJsonbBuilder";
  constructor(name) {
    super(name, "json", "PgJsonb");
  }
  /** @internal */
  build(table) {
    return new PgJsonb(table, this.config);
  }
};
var PgJsonb = class extends PgColumn {
  static [entityKind] = "PgJsonb";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "jsonb";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
};
function jsonb(name) {
  return new PgJsonbBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/line.js
var PgLineBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgLineBuilder";
  constructor(name) {
    super(name, "array", "PgLine");
  }
  /** @internal */
  build(table) {
    return new PgLineTuple(
      table,
      this.config
    );
  }
};
var PgLineTuple = class extends PgColumn {
  static [entityKind] = "PgLine";
  getSQLType() {
    return "line";
  }
  mapFromDriverValue(value) {
    const [a2, b2, c] = value.slice(1, -1).split(",");
    return [Number.parseFloat(a2), Number.parseFloat(b2), Number.parseFloat(c)];
  }
  mapToDriverValue(value) {
    return `{${value[0]},${value[1]},${value[2]}}`;
  }
};
var PgLineABCBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgLineABCBuilder";
  constructor(name) {
    super(name, "json", "PgLineABC");
  }
  /** @internal */
  build(table) {
    return new PgLineABC(
      table,
      this.config
    );
  }
};
var PgLineABC = class extends PgColumn {
  static [entityKind] = "PgLineABC";
  getSQLType() {
    return "line";
  }
  mapFromDriverValue(value) {
    const [a2, b2, c] = value.slice(1, -1).split(",");
    return { a: Number.parseFloat(a2), b: Number.parseFloat(b2), c: Number.parseFloat(c) };
  }
  mapToDriverValue(value) {
    return `{${value.a},${value.b},${value.c}}`;
  }
};
function line(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  if (!config?.mode || config.mode === "tuple") {
    return new PgLineBuilder(name);
  }
  return new PgLineABCBuilder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/macaddr.js
var PgMacaddrBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgMacaddrBuilder";
  constructor(name) {
    super(name, "string", "PgMacaddr");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr(table, this.config);
  }
};
var PgMacaddr = class extends PgColumn {
  static [entityKind] = "PgMacaddr";
  getSQLType() {
    return "macaddr";
  }
};
function macaddr(name) {
  return new PgMacaddrBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/macaddr8.js
var PgMacaddr8Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgMacaddr8Builder";
  constructor(name) {
    super(name, "string", "PgMacaddr8");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr8(table, this.config);
  }
};
var PgMacaddr8 = class extends PgColumn {
  static [entityKind] = "PgMacaddr8";
  getSQLType() {
    return "macaddr8";
  }
};
function macaddr8(name) {
  return new PgMacaddr8Builder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/numeric.js
var PgNumericBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericBuilder";
  constructor(name, precision, scale) {
    super(name, "string", "PgNumeric");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  /** @internal */
  build(table) {
    return new PgNumeric(table, this.config);
  }
};
var PgNumeric = class extends PgColumn {
  static [entityKind] = "PgNumeric";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string")
      return value;
    return String(value);
  }
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `numeric(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "numeric";
    } else {
      return `numeric(${this.precision})`;
    }
  }
};
var PgNumericNumberBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericNumberBuilder";
  constructor(name, precision, scale) {
    super(name, "number", "PgNumericNumber");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  /** @internal */
  build(table) {
    return new PgNumericNumber(
      table,
      this.config
    );
  }
};
var PgNumericNumber = class extends PgColumn {
  static [entityKind] = "PgNumericNumber";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  mapFromDriverValue(value) {
    if (typeof value === "number")
      return value;
    return Number(value);
  }
  mapToDriverValue = String;
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `numeric(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "numeric";
    } else {
      return `numeric(${this.precision})`;
    }
  }
};
var PgNumericBigIntBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericBigIntBuilder";
  constructor(name, precision, scale) {
    super(name, "bigint", "PgNumericBigInt");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  /** @internal */
  build(table) {
    return new PgNumericBigInt(
      table,
      this.config
    );
  }
};
var PgNumericBigInt = class extends PgColumn {
  static [entityKind] = "PgNumericBigInt";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  mapFromDriverValue = BigInt;
  mapToDriverValue = String;
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `numeric(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "numeric";
    } else {
      return `numeric(${this.precision})`;
    }
  }
};
function numeric(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  const mode = config?.mode;
  return mode === "number" ? new PgNumericNumberBuilder(name, config?.precision, config?.scale) : mode === "bigint" ? new PgNumericBigIntBuilder(name, config?.precision, config?.scale) : new PgNumericBuilder(name, config?.precision, config?.scale);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/point.js
var PgPointTupleBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgPointTupleBuilder";
  constructor(name) {
    super(name, "array", "PgPointTuple");
  }
  /** @internal */
  build(table) {
    return new PgPointTuple(
      table,
      this.config
    );
  }
};
var PgPointTuple = class extends PgColumn {
  static [entityKind] = "PgPointTuple";
  getSQLType() {
    return "point";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      const [x2, y2] = value.slice(1, -1).split(",");
      return [Number.parseFloat(x2), Number.parseFloat(y2)];
    }
    return [value.x, value.y];
  }
  mapToDriverValue(value) {
    return `(${value[0]},${value[1]})`;
  }
};
var PgPointObjectBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgPointObjectBuilder";
  constructor(name) {
    super(name, "json", "PgPointObject");
  }
  /** @internal */
  build(table) {
    return new PgPointObject(
      table,
      this.config
    );
  }
};
var PgPointObject = class extends PgColumn {
  static [entityKind] = "PgPointObject";
  getSQLType() {
    return "point";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      const [x2, y2] = value.slice(1, -1).split(",");
      return { x: Number.parseFloat(x2), y: Number.parseFloat(y2) };
    }
    return value;
  }
  mapToDriverValue(value) {
    return `(${value.x},${value.y})`;
  }
};
function point(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  if (!config?.mode || config.mode === "tuple") {
    return new PgPointTupleBuilder(name);
  }
  return new PgPointObjectBuilder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.js
function hexToBytes(hex) {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(Number.parseInt(hex.slice(c, c + 2), 16));
  }
  return new Uint8Array(bytes);
}
function bytesToFloat64(bytes, offset) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  for (let i = 0; i < 8; i++) {
    view.setUint8(i, bytes[offset + i]);
  }
  return view.getFloat64(0, true);
}
function parseEWKB(hex) {
  const bytes = hexToBytes(hex);
  let offset = 0;
  const byteOrder = bytes[offset];
  offset += 1;
  const view = new DataView(bytes.buffer);
  const geomType = view.getUint32(offset, byteOrder === 1);
  offset += 4;
  let _srid;
  if (geomType & 536870912) {
    _srid = view.getUint32(offset, byteOrder === 1);
    offset += 4;
  }
  if ((geomType & 65535) === 1) {
    const x2 = bytesToFloat64(bytes, offset);
    offset += 8;
    const y2 = bytesToFloat64(bytes, offset);
    offset += 8;
    return [x2, y2];
  }
  throw new Error("Unsupported geometry type");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.js
var PgGeometryBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgGeometryBuilder";
  constructor(name) {
    super(name, "array", "PgGeometry");
  }
  /** @internal */
  build(table) {
    return new PgGeometry(
      table,
      this.config
    );
  }
};
var PgGeometry = class extends PgColumn {
  static [entityKind] = "PgGeometry";
  getSQLType() {
    return "geometry(point)";
  }
  mapFromDriverValue(value) {
    return parseEWKB(value);
  }
  mapToDriverValue(value) {
    return `point(${value[0]} ${value[1]})`;
  }
};
var PgGeometryObjectBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgGeometryObjectBuilder";
  constructor(name) {
    super(name, "json", "PgGeometryObject");
  }
  /** @internal */
  build(table) {
    return new PgGeometryObject(
      table,
      this.config
    );
  }
};
var PgGeometryObject = class extends PgColumn {
  static [entityKind] = "PgGeometryObject";
  getSQLType() {
    return "geometry(point)";
  }
  mapFromDriverValue(value) {
    const parsed = parseEWKB(value);
    return { x: parsed[0], y: parsed[1] };
  }
  mapToDriverValue(value) {
    return `point(${value.x} ${value.y})`;
  }
};
function geometry(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  if (!config?.mode || config.mode === "tuple") {
    return new PgGeometryBuilder(name);
  }
  return new PgGeometryObjectBuilder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/real.js
var PgRealBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgRealBuilder";
  constructor(name, length) {
    super(name, "number", "PgReal");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new PgReal(table, this.config);
  }
};
var PgReal = class extends PgColumn {
  static [entityKind] = "PgReal";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "real";
  }
  mapFromDriverValue = (value) => {
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    return value;
  };
};
function real(name) {
  return new PgRealBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/serial.js
var PgSerialBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSerial(table, this.config);
  }
};
var PgSerial = class extends PgColumn {
  static [entityKind] = "PgSerial";
  getSQLType() {
    return "serial";
  }
};
function serial(name) {
  return new PgSerialBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/smallint.js
var PgSmallIntBuilder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgSmallIntBuilder";
  constructor(name) {
    super(name, "number", "PgSmallInt");
  }
  /** @internal */
  build(table) {
    return new PgSmallInt(table, this.config);
  }
};
var PgSmallInt = class extends PgColumn {
  static [entityKind] = "PgSmallInt";
  getSQLType() {
    return "smallint";
  }
  mapFromDriverValue = (value) => {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  };
};
function smallint(name) {
  return new PgSmallIntBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/smallserial.js
var PgSmallSerialBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSmallSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSmallSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSmallSerial(
      table,
      this.config
    );
  }
};
var PgSmallSerial = class extends PgColumn {
  static [entityKind] = "PgSmallSerial";
  getSQLType() {
    return "smallserial";
  }
};
function smallserial(name) {
  return new PgSmallSerialBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/text.js
var PgTextBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgTextBuilder";
  constructor(name, config) {
    super(name, "string", "PgText");
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgText(table, this.config);
  }
};
var PgText = class extends PgColumn {
  static [entityKind] = "PgText";
  enumValues = this.config.enumValues;
  getSQLType() {
    return "text";
  }
};
function text(a2, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  return new PgTextBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/time.js
var PgTimeBuilder = class extends PgDateColumnBaseBuilder {
  constructor(name, withTimezone, precision) {
    super(name, "string", "PgTime");
    this.withTimezone = withTimezone;
    this.precision = precision;
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  static [entityKind] = "PgTimeBuilder";
  /** @internal */
  build(table) {
    return new PgTime(table, this.config);
  }
};
var PgTime = class extends PgColumn {
  static [entityKind] = "PgTime";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : `(${this.precision})`;
    return `time${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
};
function time(a2, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  return new PgTimeBuilder(name, config.withTimezone ?? false, config.precision);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/timestamp.js
var PgTimestampBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgTimestampBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "date", "PgTimestamp");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTimestamp(table, this.config);
  }
};
var PgTimestamp = class extends PgColumn {
  static [entityKind] = "PgTimestamp";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : ` (${this.precision})`;
    return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
  mapFromDriverValue = (value) => {
    return new Date(this.withTimezone ? value : value + "+0000");
  };
  mapToDriverValue = (value) => {
    return value.toISOString();
  };
};
var PgTimestampStringBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgTimestampStringBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "string", "PgTimestampString");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTimestampString(
      table,
      this.config
    );
  }
};
var PgTimestampString = class extends PgColumn {
  static [entityKind] = "PgTimestampString";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : `(${this.precision})`;
    return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
};
function timestamp(a2, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  if (config?.mode === "string") {
    return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
  }
  return new PgTimestampBuilder(name, config?.withTimezone ?? false, config?.precision);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/uuid.js
var PgUUIDBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgUUIDBuilder";
  constructor(name) {
    super(name, "string", "PgUUID");
  }
  /**
   * Adds `default gen_random_uuid()` to the column definition.
   */
  defaultRandom() {
    return this.default(sql`gen_random_uuid()`);
  }
  /** @internal */
  build(table) {
    return new PgUUID(table, this.config);
  }
};
var PgUUID = class extends PgColumn {
  static [entityKind] = "PgUUID";
  getSQLType() {
    return "uuid";
  }
};
function uuid(name) {
  return new PgUUIDBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/varchar.js
var PgVarcharBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgVarcharBuilder";
  constructor(name, config) {
    super(name, "string", "PgVarchar");
    this.config.length = config.length;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgVarchar(
      table,
      this.config
    );
  }
};
var PgVarchar = class extends PgColumn {
  static [entityKind] = "PgVarchar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
  }
};
function varchar(a2, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  return new PgVarcharBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.js
var PgBinaryVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgBinaryVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgBinaryVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgBinaryVector(
      table,
      this.config
    );
  }
};
var PgBinaryVector = class extends PgColumn {
  static [entityKind] = "PgBinaryVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `bit(${this.dimensions})`;
  }
};
function bit(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  return new PgBinaryVectorBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.js
var PgHalfVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgHalfVectorBuilder";
  constructor(name, config) {
    super(name, "array", "PgHalfVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgHalfVector(
      table,
      this.config
    );
  }
};
var PgHalfVector = class extends PgColumn {
  static [entityKind] = "PgHalfVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `halfvec(${this.dimensions})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return value.slice(1, -1).split(",").map((v2) => Number.parseFloat(v2));
  }
};
function halfvec(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  return new PgHalfVectorBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.js
var PgSparseVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSparseVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgSparseVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgSparseVector(
      table,
      this.config
    );
  }
};
var PgSparseVector = class extends PgColumn {
  static [entityKind] = "PgSparseVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `sparsevec(${this.dimensions})`;
  }
};
function sparsevec(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  return new PgSparseVectorBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.js
var PgVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgVectorBuilder";
  constructor(name, config) {
    super(name, "array", "PgVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgVector(
      table,
      this.config
    );
  }
};
var PgVector = class extends PgColumn {
  static [entityKind] = "PgVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `vector(${this.dimensions})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return value.slice(1, -1).split(",").map((v2) => Number.parseFloat(v2));
  }
};
function vector(a2, b2) {
  const { name, config } = getColumnNameAndConfig(a2, b2);
  return new PgVectorBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/columns/all.js
function getPgColumnBuilders() {
  return {
    bigint,
    bigserial,
    boolean,
    char,
    cidr,
    customType,
    date,
    doublePrecision,
    inet,
    integer,
    interval,
    json,
    jsonb,
    line,
    macaddr,
    macaddr8,
    numeric,
    point,
    geometry,
    real,
    serial,
    smallint,
    smallserial,
    text,
    time,
    timestamp,
    uuid,
    varchar,
    bit,
    halfvec,
    sparsevec,
    vector
  };
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
var EnableRLS = Symbol.for("drizzle:EnableRLS");
var PgTable = class extends Table {
  static [entityKind] = "PgTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys,
    EnableRLS
  });
  /**@internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [EnableRLS] = false;
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
  /** @internal */
  [Table.Symbol.ExtraConfigColumns] = {};
};
function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new PgTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getPgColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const builtColumnsForExtraConfig = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.buildExtraConfigColumn(rawTable);
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
  if (extraConfig) {
    table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return Object.assign(table, {
    enableRLS: () => {
      table[PgTable.Symbol.EnableRLS] = true;
      return table;
    }
  });
}
var pgTable = (name, columns, extraConfig) => {
  return pgTableWithSchema(name, columns, extraConfig, void 0);
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/primary-keys.js
var PrimaryKeyBuilder = class {
  static [entityKind] = "PgPrimaryKeyBuilder";
  /** @internal */
  columns;
  /** @internal */
  name;
  constructor(columns, name) {
    this.columns = columns;
    this.name = name;
  }
  /** @internal */
  build(table) {
    return new PrimaryKey(table, this.columns, this.name);
  }
};
var PrimaryKey = class {
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name;
  }
  static [entityKind] = "PgPrimaryKey";
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/relations.js
var Relation = class {
  constructor(sourceTable, referencedTable, relationName) {
    this.sourceTable = sourceTable;
    this.referencedTable = referencedTable;
    this.relationName = relationName;
    this.referencedTableName = referencedTable[Table.Symbol.Name];
  }
  static [entityKind] = "Relation";
  referencedTableName;
  fieldName;
};
var Relations = class {
  constructor(table, config) {
    this.table = table;
    this.config = config;
  }
  static [entityKind] = "Relations";
};
var One = class _One extends Relation {
  constructor(sourceTable, referencedTable, config, isNullable) {
    super(sourceTable, referencedTable, config?.relationName);
    this.config = config;
    this.isNullable = isNullable;
  }
  static [entityKind] = "One";
  withFieldName(fieldName) {
    const relation = new _One(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
var Many = class _Many extends Relation {
  constructor(sourceTable, referencedTable, config) {
    super(sourceTable, referencedTable, config?.relationName);
    this.config = config;
  }
  static [entityKind] = "Many";
  withFieldName(fieldName) {
    const relation = new _Many(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
function extractTablesRelationalConfig(schema, configHelpers) {
  if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) {
    schema = schema["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema)) {
    if (is(value, Table)) {
      const dbName = getTableUniqueName(value);
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = getTableUniqueName(value.table);
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
          if (primaryKey) {
            tableConfig.primaryKey.push(...primaryKey);
          }
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
function createOne(sourceTable) {
  return function one(table, config) {
    return new One(
      sourceTable,
      table,
      config,
      config?.fields.reduce((res, f) => res && f.notNull, true) ?? false
    );
  };
}
function createMany(sourceTable) {
  return function many(referencedTable, config) {
    return new Many(sourceTable, referencedTable, config);
  };
}
function normalizeRelation(schema, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}

// ../../node_modules/.pnpm/@neondatabase+serverless@1.2.0/node_modules/@neondatabase/serverless/index.mjs
var Po = Object.create;
var Ie = Object.defineProperty;
var Ro = Object.getOwnPropertyDescriptor;
var Lo = Object.getOwnPropertyNames;
var Bo = Object.getPrototypeOf;
var Fo = Object.prototype.hasOwnProperty;
var Mo = (r, e, t) => e in r ? Ie(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t;
var a = (r, e) => Ie(r, "name", { value: e, configurable: true });
var V = (r, e, t) => () => {
  if (t) throw t[0];
  try {
    return r && (e = r(r = 0)), e;
  } catch (n) {
    throw t = [n], n;
  }
};
var T = (r, e) => () => {
  try {
    return e || r((e = { exports: {} }).exports, e), e.exports;
  } catch (t) {
    throw e = 0, t;
  }
};
var se = (r, e) => {
  for (var t in e) Ie(r, t, { get: e[t], enumerable: true });
};
var Dn = (r, e, t, n) => {
  if (e && typeof e == "object" || typeof e == "function") for (let i of Lo(e)) !Fo.call(r, i) && i !== t && Ie(r, i, { get: () => e[i], enumerable: !(n = Ro(e, i)) || n.enumerable });
  return r;
};
var we = (r, e, t) => (t = r != null ? Po(Bo(r)) : {}, Dn(e || !r || !r.__esModule ? Ie(t, "default", { value: r, enumerable: true }) : t, r));
var O = (r) => Dn(Ie({}, "__esModule", { value: true }), r);
var E = (r, e, t) => Mo(r, typeof e != "symbol" ? e + "" : e, t);
var Wn = T((lt2) => {
  "use strict";
  h();
  lt2.byteLength = Oo;
  lt2.toByteArray = Qo;
  lt2.fromByteArray = No;
  var le = [], X = [], ko = typeof Uint8Array < "u" ? Uint8Array : Array, qt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (Ae = 0, qn = qt.length; Ae < qn; ++Ae) le[Ae] = qt[Ae], X[qt.charCodeAt(Ae)] = Ae;
  var Ae, qn;
  X[45] = 62;
  X[95] = 63;
  function Nn(r) {
    var e = r.length;
    if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    var t = r.indexOf("=");
    t === -1 && (t = e);
    var n = t === e ? 0 : 4 - t % 4;
    return [t, n];
  }
  a(Nn, "getLens");
  function Oo(r) {
    var e = Nn(r), t = e[0], n = e[1];
    return (t + n) * 3 / 4 - n;
  }
  a(Oo, "byteLength");
  function Uo(r, e, t) {
    return (e + t) * 3 / 4 - t;
  }
  a(Uo, "_byteLength");
  function Qo(r) {
    var e, t = Nn(r), n = t[0], i = t[1], s = new ko(Uo(r, n, i)), o = 0, u = i > 0 ? n - 4 : n, c;
    for (c = 0; c < u; c += 4) e = X[r.charCodeAt(c)] << 18 | X[r.charCodeAt(c + 1)] << 12 | X[r.charCodeAt(c + 2)] << 6 | X[r.charCodeAt(
      c + 3
    )], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
    return i === 2 && (e = X[r.charCodeAt(c)] << 2 | X[r.charCodeAt(
      c + 1
    )] >> 4, s[o++] = e & 255), i === 1 && (e = X[r.charCodeAt(c)] << 10 | X[r.charCodeAt(c + 1)] << 4 | X[r.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
  }
  a(Qo, "toByteArray");
  function Do(r) {
    return le[r >> 18 & 63] + le[r >> 12 & 63] + le[r >> 6 & 63] + le[r & 63];
  }
  a(Do, "tripletToBase64");
  function qo(r, e, t) {
    for (var n, i = [], s = e; s < t; s += 3) n = (r[s] << 16 & 16711680) + (r[s + 1] << 8 & 65280) + (r[s + 2] & 255), i.push(Do(n));
    return i.join("");
  }
  a(qo, "encodeChunk");
  function No(r) {
    for (var e, t = r.length, n = t % 3, i = [], s = 16383, o = 0, u = t - n; o < u; o += s) i.push(qo(r, o, o + s > u ? u : o + s));
    return n === 1 ? (e = r[t - 1], i.push(le[e >> 2] + le[e << 4 & 63] + "==")) : n === 2 && (e = (r[t - 2] << 8) + r[t - 1], i.push(le[e >> 10] + le[e >> 4 & 63] + le[e << 2 & 63] + "=")), i.join("");
  }
  a(No, "fromByteArray");
});
var jn = T((Nt) => {
  h();
  Nt.read = function(r, e, t, n, i) {
    var s, o, u = i * 8 - n - 1, c = (1 << u) - 1, l = c >> 1, f = -7, m = t ? i - 1 : 0, g = t ? -1 : 1, w = r[e + m];
    for (m += g, s = w & (1 << -f) - 1, w >>= -f, f += u; f > 0; s = s * 256 + r[e + m], m += g, f -= 8) ;
    for (o = s & (1 << -f) - 1, s >>= -f, f += n; f > 0; o = o * 256 + r[e + m], m += g, f -= 8) ;
    if (s === 0) s = 1 - l;
    else {
      if (s === c) return o ? NaN : (w ? -1 : 1) * (1 / 0);
      o = o + Math.pow(2, n), s = s - l;
    }
    return (w ? -1 : 1) * o * Math.pow(2, s - n);
  };
  Nt.write = function(r, e, t, n, i, s) {
    var o, u, c, l = s * 8 - i - 1, f = (1 << l) - 1, m = f >> 1, g = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, w = n ? 0 : s - 1, S = n ? 1 : -1, k = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, o = f) : (o = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), o + m >= 1 ? e += g / c : e += g * Math.pow(2, 1 - m), e * c >= 2 && (o++, c /= 2), o + m >= f ? (u = 0, o = f) : o + m >= 1 ? (u = (e * c - 1) * Math.pow(2, i), o = o + m) : (u = e * Math.pow(2, m - 1) * Math.pow(2, i), o = 0)); i >= 8; r[t + w] = u & 255, w += S, u /= 256, i -= 8) ;
    for (o = o << i | u, l += i; l > 0; r[t + w] = o & 255, w += S, o /= 256, l -= 8) ;
    r[t + w - S] |= k * 128;
  };
});
var oi = T((Be) => {
  "use strict";
  h();
  var Wt = Wn(), Re = jn(), Hn = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  Be.Buffer = d;
  Be.SlowBuffer = Vo;
  Be.INSPECT_MAX_BYTES = 50;
  var ft = 2147483647;
  Be.kMaxLength = ft;
  d.TYPED_ARRAY_SUPPORT = Wo();
  !d.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
  function Wo() {
    try {
      let r = new Uint8Array(1), e = { foo: a(function() {
        return 42;
      }, "foo") };
      return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(r, e), r.foo() === 42;
    } catch {
      return false;
    }
  }
  a(Wo, "typedArraySupport");
  Object.defineProperty(d.prototype, "parent", { enumerable: true, get: a(function() {
    if (d.isBuffer(this)) return this.buffer;
  }, "get") });
  Object.defineProperty(d.prototype, "offset", { enumerable: true, get: a(function() {
    if (d.isBuffer(
      this
    )) return this.byteOffset;
  }, "get") });
  function de(r) {
    if (r > ft) throw new RangeError('The value "' + r + '" is invalid for option "size"');
    let e = new Uint8Array(r);
    return Object.setPrototypeOf(e, d.prototype), e;
  }
  a(de, "createBuffer");
  function d(r, e, t) {
    if (typeof r == "number") {
      if (typeof e == "string") throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      );
      return Gt(r);
    }
    return zn(r, e, t);
  }
  a(d, "Buffer");
  d.poolSize = 8192;
  function zn(r, e, t) {
    if (typeof r == "string") return Ho(r, e);
    if (ArrayBuffer.isView(r)) return $o(r);
    if (r == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
    if (fe(r, ArrayBuffer) || r && fe(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (fe(r, SharedArrayBuffer) || r && fe(
      r.buffer,
      SharedArrayBuffer
    ))) return Ht(r, e, t);
    if (typeof r == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
    let n = r.valueOf && r.valueOf();
    if (n != null && n !== r) return d.from(n, e, t);
    let i = Go(r);
    if (i) return i;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function") return d.from(r[Symbol.toPrimitive]("string"), e, t);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
  }
  a(zn, "from");
  d.from = function(r, e, t) {
    return zn(r, e, t);
  };
  Object.setPrototypeOf(
    d.prototype,
    Uint8Array.prototype
  );
  Object.setPrototypeOf(d, Uint8Array);
  function Kn(r) {
    if (typeof r != "number") throw new TypeError(
      '"size" argument must be of type number'
    );
    if (r < 0) throw new RangeError('The value "' + r + '" is invalid for option "size"');
  }
  a(Kn, "assertSize");
  function jo(r, e, t) {
    return Kn(r), r <= 0 ? de(r) : e !== void 0 ? typeof t == "string" ? de(r).fill(e, t) : de(r).fill(e) : de(r);
  }
  a(jo, "alloc");
  d.alloc = function(r, e, t) {
    return jo(r, e, t);
  };
  function Gt(r) {
    return Kn(r), de(r < 0 ? 0 : Vt(r) | 0);
  }
  a(Gt, "allocUnsafe");
  d.allocUnsafe = function(r) {
    return Gt(
      r
    );
  };
  d.allocUnsafeSlow = function(r) {
    return Gt(r);
  };
  function Ho(r, e) {
    if ((typeof e != "string" || e === "") && (e = "utf8"), !d.isEncoding(e)) throw new TypeError("Unknown encoding: " + e);
    let t = Yn(r, e) | 0, n = de(t), i = n.write(
      r,
      e
    );
    return i !== t && (n = n.slice(0, i)), n;
  }
  a(Ho, "fromString");
  function jt(r) {
    let e = r.length < 0 ? 0 : Vt(r.length) | 0, t = de(e);
    for (let n = 0; n < e; n += 1) t[n] = r[n] & 255;
    return t;
  }
  a(jt, "fromArrayLike");
  function $o(r) {
    if (fe(r, Uint8Array)) {
      let e = new Uint8Array(r);
      return Ht(e.buffer, e.byteOffset, e.byteLength);
    }
    return jt(r);
  }
  a($o, "fromArrayView");
  function Ht(r, e, t) {
    if (e < 0 || r.byteLength < e) throw new RangeError('"offset" is outside of buffer bounds');
    if (r.byteLength < e + (t || 0)) throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return e === void 0 && t === void 0 ? n = new Uint8Array(r) : t === void 0 ? n = new Uint8Array(r, e) : n = new Uint8Array(
      r,
      e,
      t
    ), Object.setPrototypeOf(n, d.prototype), n;
  }
  a(Ht, "fromArrayBuffer");
  function Go(r) {
    if (d.isBuffer(r)) {
      let e = Vt(r.length) | 0, t = de(e);
      return t.length === 0 || r.copy(t, 0, 0, e), t;
    }
    if (r.length !== void 0) return typeof r.length != "number" || Kt(r.length) ? de(0) : jt(r);
    if (r.type === "Buffer" && Array.isArray(r.data)) return jt(r.data);
  }
  a(Go, "fromObject");
  function Vt(r) {
    if (r >= ft) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + ft.toString(16) + " bytes");
    return r | 0;
  }
  a(Vt, "checked");
  function Vo(r) {
    return +r != r && (r = 0), d.alloc(+r);
  }
  a(Vo, "SlowBuffer");
  d.isBuffer = a(function(e) {
    return e != null && e._isBuffer === true && e !== d.prototype;
  }, "isBuffer");
  d.compare = a(function(e, t) {
    if (fe(e, Uint8Array) && (e = d.from(e, e.offset, e.byteLength)), fe(t, Uint8Array) && (t = d.from(t, t.offset, t.byteLength)), !d.isBuffer(e) || !d.isBuffer(t)) throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    );
    if (e === t) return 0;
    let n = e.length, i = t.length;
    for (let s = 0, o = Math.min(n, i); s < o; ++s) if (e[s] !== t[s]) {
      n = e[s], i = t[s];
      break;
    }
    return n < i ? -1 : i < n ? 1 : 0;
  }, "compare");
  d.isEncoding = a(function(e) {
    switch (String(e).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  }, "isEncoding");
  d.concat = a(function(e, t) {
    if (!Array.isArray(e)) throw new TypeError(
      '"list" argument must be an Array of Buffers'
    );
    if (e.length === 0) return d.alloc(0);
    let n;
    if (t === void 0)
      for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
    let i = d.allocUnsafe(t), s = 0;
    for (n = 0; n < e.length; ++n) {
      let o = e[n];
      if (fe(o, Uint8Array)) s + o.length > i.length ? (d.isBuffer(o) || (o = d.from(o)), o.copy(i, s)) : Uint8Array.prototype.set.call(i, o, s);
      else if (d.isBuffer(o)) o.copy(i, s);
      else throw new TypeError('"list" argument must be an Array of Buffers');
      s += o.length;
    }
    return i;
  }, "concat");
  function Yn(r, e) {
    if (d.isBuffer(r)) return r.length;
    if (ArrayBuffer.isView(r) || fe(r, ArrayBuffer)) return r.byteLength;
    if (typeof r != "string") throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r
    );
    let t = r.length, n = arguments.length > 2 && arguments[2] === true;
    if (!n && t === 0) return 0;
    let i = false;
    for (; ; ) switch (e) {
      case "ascii":
      case "latin1":
      case "binary":
        return t;
      case "utf8":
      case "utf-8":
        return $t(r).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return t * 2;
      case "hex":
        return t >>> 1;
      case "base64":
        return si(r).length;
      default:
        if (i) return n ? -1 : $t(r).length;
        e = ("" + e).toLowerCase(), i = true;
    }
  }
  a(Yn, "byteLength");
  d.byteLength = Yn;
  function zo(r, e, t) {
    let n = false;
    if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, e >>>= 0, t <= e)) return "";
    for (r || (r = "utf8"); ; ) switch (r) {
      case "hex":
        return ia(this, e, t);
      case "utf8":
      case "utf-8":
        return Jn(this, e, t);
      case "ascii":
        return ra(this, e, t);
      case "latin1":
      case "binary":
        return na(
          this,
          e,
          t
        );
      case "base64":
        return ea(this, e, t);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return sa(
          this,
          e,
          t
        );
      default:
        if (n) throw new TypeError("Unknown encoding: " + r);
        r = (r + "").toLowerCase(), n = true;
    }
  }
  a(
    zo,
    "slowToString"
  );
  d.prototype._isBuffer = true;
  function Ce(r, e, t) {
    let n = r[e];
    r[e] = r[t], r[t] = n;
  }
  a(Ce, "swap");
  d.prototype.swap16 = a(function() {
    let e = this.length;
    if (e % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let t = 0; t < e; t += 2) Ce(this, t, t + 1);
    return this;
  }, "swap16");
  d.prototype.swap32 = a(function() {
    let e = this.length;
    if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let t = 0; t < e; t += 4) Ce(this, t, t + 3), Ce(this, t + 1, t + 2);
    return this;
  }, "swap32");
  d.prototype.swap64 = a(
    function() {
      let e = this.length;
      if (e % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let t = 0; t < e; t += 8) Ce(this, t, t + 7), Ce(this, t + 1, t + 6), Ce(this, t + 2, t + 5), Ce(this, t + 3, t + 4);
      return this;
    },
    "swap64"
  );
  d.prototype.toString = a(function() {
    let e = this.length;
    return e === 0 ? "" : arguments.length === 0 ? Jn(
      this,
      0,
      e
    ) : zo.apply(this, arguments);
  }, "toString");
  d.prototype.toLocaleString = d.prototype.toString;
  d.prototype.equals = a(function(e) {
    if (!d.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
    return this === e ? true : d.compare(this, e) === 0;
  }, "equals");
  d.prototype.inspect = a(function() {
    let e = "", t = Be.INSPECT_MAX_BYTES;
    return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
  }, "inspect");
  Hn && (d.prototype[Hn] = d.prototype.inspect);
  d.prototype.compare = a(function(e, t, n, i, s) {
    if (fe(e, Uint8Array) && (e = d.from(e, e.offset, e.byteLength)), !d.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
    if (t === void 0 && (t = 0), n === void 0 && (n = e ? e.length : 0), i === void 0 && (i = 0), s === void 0 && (s = this.length), t < 0 || n > e.length || i < 0 || s > this.length) throw new RangeError("out of range index");
    if (i >= s && t >= n) return 0;
    if (i >= s) return -1;
    if (t >= n) return 1;
    if (t >>>= 0, n >>>= 0, i >>>= 0, s >>>= 0, this === e) return 0;
    let o = s - i, u = n - t, c = Math.min(o, u), l = this.slice(
      i,
      s
    ), f = e.slice(t, n);
    for (let m = 0; m < c; ++m) if (l[m] !== f[m]) {
      o = l[m], u = f[m];
      break;
    }
    return o < u ? -1 : u < o ? 1 : 0;
  }, "compare");
  function Zn(r, e, t, n, i) {
    if (r.length === 0) return -1;
    if (typeof t == "string" ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, Kt(t) && (t = i ? 0 : r.length - 1), t < 0 && (t = r.length + t), t >= r.length) {
      if (i) return -1;
      t = r.length - 1;
    } else if (t < 0) if (i) t = 0;
    else return -1;
    if (typeof e == "string" && (e = d.from(
      e,
      n
    )), d.isBuffer(e)) return e.length === 0 ? -1 : $n(r, e, t, n, i);
    if (typeof e == "number") return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(r, e, t) : Uint8Array.prototype.lastIndexOf.call(r, e, t) : $n(r, [e], t, n, i);
    throw new TypeError("val must be string, number or Buffer");
  }
  a(Zn, "bidirectionalIndexOf");
  function $n(r, e, t, n, i) {
    let s = 1, o = r.length, u = e.length;
    if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
      if (r.length < 2 || e.length < 2) return -1;
      s = 2, o /= 2, u /= 2, t /= 2;
    }
    function c(f, m) {
      return s === 1 ? f[m] : f.readUInt16BE(m * s);
    }
    a(c, "read");
    let l;
    if (i) {
      let f = -1;
      for (l = t; l < o; l++) if (c(r, l) === c(e, f === -1 ? 0 : l - f)) {
        if (f === -1 && (f = l), l - f + 1 === u) return f * s;
      } else f !== -1 && (l -= l - f), f = -1;
    } else for (t + u > o && (t = o - u), l = t; l >= 0; l--) {
      let f = true;
      for (let m = 0; m < u; m++) if (c(r, l + m) !== c(e, m)) {
        f = false;
        break;
      }
      if (f) return l;
    }
    return -1;
  }
  a($n, "arrayIndexOf");
  d.prototype.includes = a(function(e, t, n) {
    return this.indexOf(
      e,
      t,
      n
    ) !== -1;
  }, "includes");
  d.prototype.indexOf = a(function(e, t, n) {
    return Zn(this, e, t, n, true);
  }, "indexOf");
  d.prototype.lastIndexOf = a(function(e, t, n) {
    return Zn(this, e, t, n, false);
  }, "lastIndexOf");
  function Ko(r, e, t, n) {
    t = Number(t) || 0;
    let i = r.length - t;
    n ? (n = Number(n), n > i && (n = i)) : n = i;
    let s = e.length;
    n > s / 2 && (n = s / 2);
    let o;
    for (o = 0; o < n; ++o) {
      let u = parseInt(e.substr(o * 2, 2), 16);
      if (Kt(u)) return o;
      r[t + o] = u;
    }
    return o;
  }
  a(Ko, "hexWrite");
  function Yo(r, e, t, n) {
    return ht($t(e, r.length - t), r, t, n);
  }
  a(Yo, "utf8Write");
  function Zo(r, e, t, n) {
    return ht(ca(e), r, t, n);
  }
  a(
    Zo,
    "asciiWrite"
  );
  function Jo(r, e, t, n) {
    return ht(si(e), r, t, n);
  }
  a(Jo, "base64Write");
  function Xo(r, e, t, n) {
    return ht(
      la(e, r.length - t),
      r,
      t,
      n
    );
  }
  a(Xo, "ucs2Write");
  d.prototype.write = a(function(e, t, n, i) {
    if (t === void 0) i = "utf8", n = this.length, t = 0;
    else if (n === void 0 && typeof t == "string") i = t, n = this.length, t = 0;
    else if (isFinite(t))
      t = t >>> 0, isFinite(n) ? (n = n >>> 0, i === void 0 && (i = "utf8")) : (i = n, n = void 0);
    else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    let s = this.length - t;
    if ((n === void 0 || n > s) && (n = s), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
    i || (i = "utf8");
    let o = false;
    for (; ; ) switch (i) {
      case "hex":
        return Ko(this, e, t, n);
      case "utf8":
      case "utf-8":
        return Yo(this, e, t, n);
      case "ascii":
      case "latin1":
      case "binary":
        return Zo(this, e, t, n);
      case "base64":
        return Jo(this, e, t, n);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Xo(this, e, t, n);
      default:
        if (o) throw new TypeError("Unknown encoding: " + i);
        i = ("" + i).toLowerCase(), o = true;
    }
  }, "write");
  d.prototype.toJSON = a(function() {
    return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
  }, "toJSON");
  function ea(r, e, t) {
    return e === 0 && t === r.length ? Wt.fromByteArray(r) : Wt.fromByteArray(r.slice(e, t));
  }
  a(ea, "base64Slice");
  function Jn(r, e, t) {
    t = Math.min(r.length, t);
    let n = [], i = e;
    for (; i < t; ) {
      let s = r[i], o = null, u = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
      if (i + u <= t) {
        let c, l, f, m;
        switch (u) {
          case 1:
            s < 128 && (o = s);
            break;
          case 2:
            c = r[i + 1], (c & 192) === 128 && (m = (s & 31) << 6 | c & 63, m > 127 && (o = m));
            break;
          case 3:
            c = r[i + 1], l = r[i + 2], (c & 192) === 128 && (l & 192) === 128 && (m = (s & 15) << 12 | (c & 63) << 6 | l & 63, m > 2047 && (m < 55296 || m > 57343) && (o = m));
            break;
          case 4:
            c = r[i + 1], l = r[i + 2], f = r[i + 3], (c & 192) === 128 && (l & 192) === 128 && (f & 192) === 128 && (m = (s & 15) << 18 | (c & 63) << 12 | (l & 63) << 6 | f & 63, m > 65535 && m < 1114112 && (o = m));
        }
      }
      o === null ? (o = 65533, u = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), n.push(o), i += u;
    }
    return ta(n);
  }
  a(Jn, "utf8Slice");
  var Gn = 4096;
  function ta(r) {
    let e = r.length;
    if (e <= Gn) return String.fromCharCode.apply(String, r);
    let t = "", n = 0;
    for (; n < e; ) t += String.fromCharCode.apply(String, r.slice(n, n += Gn));
    return t;
  }
  a(ta, "decodeCodePointsArray");
  function ra(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let i = e; i < t; ++i) n += String.fromCharCode(r[i] & 127);
    return n;
  }
  a(ra, "asciiSlice");
  function na(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let i = e; i < t; ++i) n += String.fromCharCode(r[i]);
    return n;
  }
  a(na, "latin1Slice");
  function ia(r, e, t) {
    let n = r.length;
    (!e || e < 0) && (e = 0), (!t || t < 0 || t > n) && (t = n);
    let i = "";
    for (let s = e; s < t; ++s) i += fa[r[s]];
    return i;
  }
  a(ia, "hexSlice");
  function sa(r, e, t) {
    let n = r.slice(e, t), i = "";
    for (let s = 0; s < n.length - 1; s += 2) i += String.fromCharCode(n[s] + n[s + 1] * 256);
    return i;
  }
  a(sa, "utf16leSlice");
  d.prototype.slice = a(function(e, t) {
    let n = this.length;
    e = ~~e, t = t === void 0 ? n : ~~t, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), t < e && (t = e);
    let i = this.subarray(e, t);
    return Object.setPrototypeOf(i, d.prototype), i;
  }, "slice");
  function U(r, e, t) {
    if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
    if (r + e > t) throw new RangeError("Trying to access beyond buffer length");
  }
  a(U, "checkOffset");
  d.prototype.readUintLE = d.prototype.readUIntLE = a(
    function(e, t, n) {
      e = e >>> 0, t = t >>> 0, n || U(e, t, this.length);
      let i = this[e], s = 1, o = 0;
      for (; ++o < t && (s *= 256); ) i += this[e + o] * s;
      return i;
    },
    "readUIntLE"
  );
  d.prototype.readUintBE = d.prototype.readUIntBE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(
      e,
      t,
      this.length
    );
    let i = this[e + --t], s = 1;
    for (; t > 0 && (s *= 256); ) i += this[e + --t] * s;
    return i;
  }, "readUIntBE");
  d.prototype.readUint8 = d.prototype.readUInt8 = a(
    function(e, t) {
      return e = e >>> 0, t || U(e, 1, this.length), this[e];
    },
    "readUInt8"
  );
  d.prototype.readUint16LE = d.prototype.readUInt16LE = a(function(e, t) {
    return e = e >>> 0, t || U(
      e,
      2,
      this.length
    ), this[e] | this[e + 1] << 8;
  }, "readUInt16LE");
  d.prototype.readUint16BE = d.prototype.readUInt16BE = a(function(e, t) {
    return e = e >>> 0, t || U(e, 2, this.length), this[e] << 8 | this[e + 1];
  }, "readUInt16BE");
  d.prototype.readUint32LE = d.prototype.readUInt32LE = a(function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
  }, "readUInt32LE");
  d.prototype.readUint32BE = d.prototype.readUInt32BE = a(function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
  }, "readUInt32BE");
  d.prototype.readBigUInt64LE = be(a(function(e) {
    e = e >>> 0, Le(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && We(e, this.length - 8);
    let i = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, s = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + n * 2 ** 24;
    return BigInt(i) + (BigInt(s) << BigInt(32));
  }, "readBigUInt64LE"));
  d.prototype.readBigUInt64BE = be(a(function(e) {
    e = e >>> 0, Le(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && We(e, this.length - 8);
    let i = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], s = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n;
    return (BigInt(i) << BigInt(
      32
    )) + BigInt(s);
  }, "readBigUInt64BE"));
  d.prototype.readIntLE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(
      e,
      t,
      this.length
    );
    let i = this[e], s = 1, o = 0;
    for (; ++o < t && (s *= 256); ) i += this[e + o] * s;
    return s *= 128, i >= s && (i -= Math.pow(2, 8 * t)), i;
  }, "readIntLE");
  d.prototype.readIntBE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(e, t, this.length);
    let i = t, s = 1, o = this[e + --i];
    for (; i > 0 && (s *= 256); ) o += this[e + --i] * s;
    return s *= 128, o >= s && (o -= Math.pow(2, 8 * t)), o;
  }, "readIntBE");
  d.prototype.readInt8 = a(function(e, t) {
    return e = e >>> 0, t || U(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
  }, "readInt8");
  d.prototype.readInt16LE = a(function(e, t) {
    e = e >>> 0, t || U(
      e,
      2,
      this.length
    );
    let n = this[e] | this[e + 1] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, "readInt16LE");
  d.prototype.readInt16BE = a(function(e, t) {
    e = e >>> 0, t || U(e, 2, this.length);
    let n = this[e + 1] | this[e] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, "readInt16BE");
  d.prototype.readInt32LE = a(function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
  }, "readInt32LE");
  d.prototype.readInt32BE = a(function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
  }, "readInt32BE");
  d.prototype.readBigInt64LE = be(a(function(e) {
    e = e >>> 0, Le(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && We(e, this.length - 8);
    let i = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (n << 24);
    return (BigInt(i) << BigInt(
      32
    )) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
  }, "readBigInt64LE"));
  d.prototype.readBigInt64BE = be(a(function(e) {
    e = e >>> 0, Le(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && We(e, this.length - 8);
    let i = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
    return (BigInt(i) << BigInt(32)) + BigInt(
      this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n
    );
  }, "readBigInt64BE"));
  d.prototype.readFloatLE = a(function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), Re.read(this, e, true, 23, 4);
  }, "readFloatLE");
  d.prototype.readFloatBE = a(function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), Re.read(this, e, false, 23, 4);
  }, "readFloatBE");
  d.prototype.readDoubleLE = a(function(e, t) {
    return e = e >>> 0, t || U(e, 8, this.length), Re.read(this, e, true, 52, 8);
  }, "readDoubleLE");
  d.prototype.readDoubleBE = a(function(e, t) {
    return e = e >>> 0, t || U(e, 8, this.length), Re.read(
      this,
      e,
      false,
      52,
      8
    );
  }, "readDoubleBE");
  function z(r, e, t, n, i, s) {
    if (!d.isBuffer(r)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (e > i || e < s) throw new RangeError('"value" argument is out of bounds');
    if (t + n > r.length) throw new RangeError("Index out of range");
  }
  a(z, "checkInt");
  d.prototype.writeUintLE = d.prototype.writeUIntLE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
      let u = Math.pow(2, 8 * n) - 1;
      z(
        this,
        e,
        t,
        n,
        u,
        0
      );
    }
    let s = 1, o = 0;
    for (this[t] = e & 255; ++o < n && (s *= 256); ) this[t + o] = e / s & 255;
    return t + n;
  }, "writeUIntLE");
  d.prototype.writeUintBE = d.prototype.writeUIntBE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
      let u = Math.pow(2, 8 * n) - 1;
      z(this, e, t, n, u, 0);
    }
    let s = n - 1, o = 1;
    for (this[t + s] = e & 255; --s >= 0 && (o *= 256); ) this[t + s] = e / o & 255;
    return t + n;
  }, "writeUIntBE");
  d.prototype.writeUint8 = d.prototype.writeUInt8 = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || z(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1;
  }, "writeUInt8");
  d.prototype.writeUint16LE = d.prototype.writeUInt16LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || z(this, e, t, 2, 65535, 0), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, "writeUInt16LE");
  d.prototype.writeUint16BE = d.prototype.writeUInt16BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || z(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, "writeUInt16BE");
  d.prototype.writeUint32LE = d.prototype.writeUInt32LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || z(
      this,
      e,
      t,
      4,
      4294967295,
      0
    ), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4;
  }, "writeUInt32LE");
  d.prototype.writeUint32BE = d.prototype.writeUInt32BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || z(
      this,
      e,
      t,
      4,
      4294967295,
      0
    ), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  }, "writeUInt32BE");
  function Xn(r, e, t, n, i) {
    ii(e, n, i, r, t, 7);
    let s = Number(e & BigInt(4294967295));
    r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s;
    let o = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, t;
  }
  a(Xn, "wrtBigUInt64LE");
  function ei(r, e, t, n, i) {
    ii(e, n, i, r, t, 7);
    let s = Number(e & BigInt(4294967295));
    r[t + 7] = s, s = s >> 8, r[t + 6] = s, s = s >> 8, r[t + 5] = s, s = s >> 8, r[t + 4] = s;
    let o = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t + 3] = o, o = o >> 8, r[t + 2] = o, o = o >> 8, r[t + 1] = o, o = o >> 8, r[t] = o, t + 8;
  }
  a(ei, "wrtBigUInt64BE");
  d.prototype.writeBigUInt64LE = be(a(function(e, t = 0) {
    return Xn(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }, "writeBigUInt64LE"));
  d.prototype.writeBigUInt64BE = be(a(function(e, t = 0) {
    return ei(this, e, t, BigInt(0), BigInt(
      "0xffffffffffffffff"
    ));
  }, "writeBigUInt64BE"));
  d.prototype.writeIntLE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, !i) {
      let c = Math.pow(2, 8 * n - 1);
      z(this, e, t, n, c - 1, -c);
    }
    let s = 0, o = 1, u = 0;
    for (this[t] = e & 255; ++s < n && (o *= 256); )
      e < 0 && u === 0 && this[t + s - 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
    return t + n;
  }, "writeIntLE");
  d.prototype.writeIntBE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, !i) {
      let c = Math.pow(2, 8 * n - 1);
      z(this, e, t, n, c - 1, -c);
    }
    let s = n - 1, o = 1, u = 0;
    for (this[t + s] = e & 255; --s >= 0 && (o *= 256); ) e < 0 && u === 0 && this[t + s + 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
    return t + n;
  }, "writeIntBE");
  d.prototype.writeInt8 = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || z(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1;
  }, "writeInt8");
  d.prototype.writeInt16LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || z(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, "writeInt16LE");
  d.prototype.writeInt16BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || z(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, "writeInt16BE");
  d.prototype.writeInt32LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || z(
      this,
      e,
      t,
      4,
      2147483647,
      -2147483648
    ), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
  }, "writeInt32LE");
  d.prototype.writeInt32BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || z(
      this,
      e,
      t,
      4,
      2147483647,
      -2147483648
    ), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  }, "writeInt32BE");
  d.prototype.writeBigInt64LE = be(a(function(e, t = 0) {
    return Xn(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }, "writeBigInt64LE"));
  d.prototype.writeBigInt64BE = be(
    a(function(e, t = 0) {
      return ei(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }, "writeBigInt64BE")
  );
  function ti(r, e, t, n, i, s) {
    if (t + n > r.length) throw new RangeError("Index out of range");
    if (t < 0) throw new RangeError("Index out of range");
  }
  a(ti, "checkIEEE754");
  function ri(r, e, t, n, i) {
    return e = +e, t = t >>> 0, i || ti(r, e, t, 4, 34028234663852886e22, -34028234663852886e22), Re.write(r, e, t, n, 23, 4), t + 4;
  }
  a(
    ri,
    "writeFloat"
  );
  d.prototype.writeFloatLE = a(function(e, t, n) {
    return ri(this, e, t, true, n);
  }, "writeFloatLE");
  d.prototype.writeFloatBE = a(function(e, t, n) {
    return ri(this, e, t, false, n);
  }, "writeFloatBE");
  function ni(r, e, t, n, i) {
    return e = +e, t = t >>> 0, i || ti(r, e, t, 8, 17976931348623157e292, -17976931348623157e292), Re.write(
      r,
      e,
      t,
      n,
      52,
      8
    ), t + 8;
  }
  a(ni, "writeDouble");
  d.prototype.writeDoubleLE = a(function(e, t, n) {
    return ni(this, e, t, true, n);
  }, "writeDoubleLE");
  d.prototype.writeDoubleBE = a(function(e, t, n) {
    return ni(this, e, t, false, n);
  }, "writeDoubleBE");
  d.prototype.copy = a(function(e, t, n, i) {
    if (!d.isBuffer(e)) throw new TypeError("argument should be a Buffer");
    if (n || (n = 0), !i && i !== 0 && (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < n && (i = n), i === n || e.length === 0 || this.length === 0) return 0;
    if (t < 0) throw new RangeError("targetStart out of bounds");
    if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
    if (i < 0) throw new RangeError("sourceEnd out of bounds");
    i > this.length && (i = this.length), e.length - t < i - n && (i = e.length - t + n);
    let s = i - n;
    return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, n, i) : Uint8Array.prototype.set.call(e, this.subarray(n, i), t), s;
  }, "copy");
  d.prototype.fill = a(function(e, t, n, i) {
    if (typeof e == "string") {
      if (typeof t == "string" ? (i = t, t = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), i !== void 0 && typeof i != "string") throw new TypeError("encoding must be a string");
      if (typeof i == "string" && !d.isEncoding(i)) throw new TypeError(
        "Unknown encoding: " + i
      );
      if (e.length === 1) {
        let o = e.charCodeAt(0);
        (i === "utf8" && o < 128 || i === "latin1") && (e = o);
      }
    } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
    if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
    if (n <= t) return this;
    t = t >>> 0, n = n === void 0 ? this.length : n >>> 0, e || (e = 0);
    let s;
    if (typeof e == "number") for (s = t; s < n; ++s) this[s] = e;
    else {
      let o = d.isBuffer(e) ? e : d.from(
        e,
        i
      ), u = o.length;
      if (u === 0) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
      for (s = 0; s < n - t; ++s) this[s + t] = o[s % u];
    }
    return this;
  }, "fill");
  var Pe = {};
  function zt(r, e, t) {
    var n;
    Pe[r] = (n = class extends t {
      constructor() {
        super(), Object.defineProperty(this, "message", { value: e.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${r}]`, this.stack, delete this.name;
      }
      get code() {
        return r;
      }
      set code(s) {
        Object.defineProperty(
          this,
          "code",
          { configurable: true, enumerable: true, value: s, writable: true }
        );
      }
      toString() {
        return `${this.name} [${r}]: ${this.message}`;
      }
    }, a(n, "NodeError"), n);
  }
  a(zt, "E");
  zt("ERR_BUFFER_OUT_OF_BOUNDS", function(r) {
    return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
  }, RangeError);
  zt(
    "ERR_INVALID_ARG_TYPE",
    function(r, e) {
      return `The "${r}" argument must be of type number. Received type ${typeof e}`;
    },
    TypeError
  );
  zt("ERR_OUT_OF_RANGE", function(r, e, t) {
    let n = `The value of "${r}" is out of range.`, i = t;
    return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? i = Vn(String(t)) : typeof t == "bigint" && (i = String(
      t
    ), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (i = Vn(i)), i += "n"), n += ` It must be ${e}. Received ${i}`, n;
  }, RangeError);
  function Vn(r) {
    let e = "", t = r.length, n = r[0] === "-" ? 1 : 0;
    for (; t >= n + 4; t -= 3) e = `_${r.slice(t - 3, t)}${e}`;
    return `${r.slice(0, t)}${e}`;
  }
  a(Vn, "addNumericalSeparator");
  function oa(r, e, t) {
    Le(e, "offset"), (r[e] === void 0 || r[e + t] === void 0) && We(e, r.length - (t + 1));
  }
  a(oa, "checkBounds");
  function ii(r, e, t, n, i, s) {
    if (r > t || r < e) {
      let o = typeof e == "bigint" ? "n" : "", u;
      throw s > 3 ? e === 0 || e === BigInt(0) ? u = `>= 0${o} and < 2${o} ** ${(s + 1) * 8}${o}` : u = `>= -(2${o} ** ${(s + 1) * 8 - 1}${o}) and < 2 ** ${(s + 1) * 8 - 1}${o}` : u = `>= ${e}${o} and <= ${t}${o}`, new Pe.ERR_OUT_OF_RANGE("value", u, r);
    }
    oa(n, i, s);
  }
  a(ii, "checkIntBI");
  function Le(r, e) {
    if (typeof r != "number") throw new Pe.ERR_INVALID_ARG_TYPE(e, "number", r);
  }
  a(Le, "validateNumber");
  function We(r, e, t) {
    throw Math.floor(r) !== r ? (Le(r, t), new Pe.ERR_OUT_OF_RANGE(t || "offset", "an integer", r)) : e < 0 ? new Pe.ERR_BUFFER_OUT_OF_BOUNDS() : new Pe.ERR_OUT_OF_RANGE(t || "offset", `>= ${t ? 1 : 0} and <= ${e}`, r);
  }
  a(We, "boundsError");
  var aa = /[^+/0-9A-Za-z-_]/g;
  function ua(r) {
    if (r = r.split("=")[0], r = r.trim().replace(aa, ""), r.length < 2) return "";
    for (; r.length % 4 !== 0; ) r = r + "=";
    return r;
  }
  a(ua, "base64clean");
  function $t(r, e) {
    e = e || 1 / 0;
    let t, n = r.length, i = null, s = [];
    for (let o = 0; o < n; ++o) {
      if (t = r.charCodeAt(o), t > 55295 && t < 57344) {
        if (!i) {
          if (t > 56319) {
            (e -= 3) > -1 && s.push(239, 191, 189);
            continue;
          } else if (o + 1 === n) {
            (e -= 3) > -1 && s.push(239, 191, 189);
            continue;
          }
          i = t;
          continue;
        }
        if (t < 56320) {
          (e -= 3) > -1 && s.push(239, 191, 189), i = t;
          continue;
        }
        t = (i - 55296 << 10 | t - 56320) + 65536;
      } else i && (e -= 3) > -1 && s.push(239, 191, 189);
      if (i = null, t < 128) {
        if ((e -= 1) < 0) break;
        s.push(t);
      } else if (t < 2048) {
        if ((e -= 2) < 0) break;
        s.push(t >> 6 | 192, t & 63 | 128);
      } else if (t < 65536) {
        if ((e -= 3) < 0) break;
        s.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
      } else if (t < 1114112) {
        if ((e -= 4) < 0) break;
        s.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
      } else throw new Error("Invalid code point");
    }
    return s;
  }
  a($t, "utf8ToBytes");
  function ca(r) {
    let e = [];
    for (let t = 0; t < r.length; ++t) e.push(r.charCodeAt(t) & 255);
    return e;
  }
  a(
    ca,
    "asciiToBytes"
  );
  function la(r, e) {
    let t, n, i, s = [];
    for (let o = 0; o < r.length && !((e -= 2) < 0); ++o) t = r.charCodeAt(
      o
    ), n = t >> 8, i = t % 256, s.push(i), s.push(n);
    return s;
  }
  a(la, "utf16leToBytes");
  function si(r) {
    return Wt.toByteArray(
      ua(r)
    );
  }
  a(si, "base64ToBytes");
  function ht(r, e, t, n) {
    let i;
    for (i = 0; i < n && !(i + t >= e.length || i >= r.length); ++i)
      e[i + t] = r[i];
    return i;
  }
  a(ht, "blitBuffer");
  function fe(r, e) {
    return r instanceof e || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === e.name;
  }
  a(fe, "isInstance");
  function Kt(r) {
    return r !== r;
  }
  a(Kt, "numberIsNaN");
  var fa = (function() {
    let r = "0123456789abcdef", e = new Array(256);
    for (let t = 0; t < 16; ++t) {
      let n = t * 16;
      for (let i = 0; i < 16; ++i) e[n + i] = r[t] + r[i];
    }
    return e;
  })();
  function be(r) {
    return typeof BigInt > "u" ? ha : r;
  }
  a(be, "defineBigIntMethod");
  function ha() {
    throw new Error("BigInt not supported");
  }
  a(ha, "BufferBigIntNotDefined");
});
var b;
var x;
var v;
var p;
var y;
var h = V(() => {
  "use strict";
  b = globalThis, x = globalThis.setImmediate ?? ((r) => setTimeout(r, 0)), v = globalThis.clearImmediate ?? ((r) => clearTimeout(r)), p = typeof globalThis.Buffer == "function" && typeof globalThis.Buffer.allocUnsafe == "function" ? globalThis.Buffer : oi().Buffer, y = globalThis.process ?? {};
  y.env ?? (y.env = {});
  try {
    y.nextTick(() => {
    });
  } catch {
    let e = Promise.resolve();
    y.nextTick = e.then.bind(e);
  }
});
var ve = T((Ef, Xt) => {
  "use strict";
  h();
  var Fe = typeof Reflect == "object" ? Reflect : null, mi = Fe && typeof Fe.apply == "function" ? Fe.apply : a(function(e, t, n) {
    return Function.prototype.apply.call(e, t, n);
  }, "ReflectApply"), bt;
  Fe && typeof Fe.ownKeys == "function" ? bt = Fe.ownKeys : Object.getOwnPropertySymbols ? bt = a(function(e) {
    return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
  }, "ReflectOwnKeys") : bt = a(function(e) {
    return Object.getOwnPropertyNames(e);
  }, "ReflectOwnKeys");
  function Ia(r) {
    console && console.warn && console.warn(r);
  }
  a(
    Ia,
    "ProcessEmitWarning"
  );
  var wi = Number.isNaN || a(function(e) {
    return e !== e;
  }, "NumberIsNaN");
  function P() {
    P.init.call(this);
  }
  a(P, "EventEmitter");
  Xt.exports = P;
  Xt.exports.once = Ba;
  P.EventEmitter = P;
  P.prototype._events = void 0;
  P.prototype._eventsCount = 0;
  P.prototype._maxListeners = void 0;
  var gi = 10;
  function xt(r) {
    if (typeof r != "function") throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof r);
  }
  a(xt, "checkListener");
  Object.defineProperty(P, "defaultMaxListeners", { enumerable: true, get: a(function() {
    return gi;
  }, "get"), set: a(
    function(r) {
      if (typeof r != "number" || r < 0 || wi(r)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + r + ".");
      gi = r;
    },
    "set"
  ) });
  P.init = function() {
    (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
  };
  P.prototype.setMaxListeners = a(function(e) {
    if (typeof e != "number" || e < 0 || wi(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
    return this._maxListeners = e, this;
  }, "setMaxListeners");
  function bi(r) {
    return r._maxListeners === void 0 ? P.defaultMaxListeners : r._maxListeners;
  }
  a(bi, "_getMaxListeners");
  P.prototype.getMaxListeners = a(function() {
    return bi(this);
  }, "getMaxListeners");
  P.prototype.emit = a(function(e) {
    for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
    var i = e === "error", s = this._events;
    if (s !== void 0) i = i && s.error === void 0;
    else if (!i) return false;
    if (i) {
      var o;
      if (t.length > 0 && (o = t[0]), o instanceof Error) throw o;
      var u = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
      throw u.context = o, u;
    }
    var c = s[e];
    if (c === void 0) return false;
    if (typeof c == "function") mi(c, this, t);
    else for (var l = c.length, f = Ai(c, l), n = 0; n < l; ++n) mi(f[n], this, t);
    return true;
  }, "emit");
  function xi(r, e, t, n) {
    var i, s, o;
    if (xt(
      t
    ), s = r._events, s === void 0 ? (s = r._events = /* @__PURE__ */ Object.create(null), r._eventsCount = 0) : (s.newListener !== void 0 && (r.emit("newListener", e, t.listener ? t.listener : t), s = r._events), o = s[e]), o === void 0) o = s[e] = t, ++r._eventsCount;
    else if (typeof o == "function" ? o = s[e] = n ? [t, o] : [o, t] : n ? o.unshift(t) : o.push(t), i = bi(r), i > 0 && o.length > i && !o.warned) {
      o.warned = true;
      var u = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      u.name = "MaxListenersExceededWarning", u.emitter = r, u.type = e, u.count = o.length, Ia(u);
    }
    return r;
  }
  a(xi, "_addListener");
  P.prototype.addListener = a(function(e, t) {
    return xi(this, e, t, false);
  }, "addListener");
  P.prototype.on = P.prototype.addListener;
  P.prototype.prependListener = a(function(e, t) {
    return xi(this, e, t, true);
  }, "prependListener");
  function Pa() {
    if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
  }
  a(Pa, "onceWrapper");
  function vi(r, e, t) {
    var n = {
      fired: false,
      wrapFn: void 0,
      target: r,
      type: e,
      listener: t
    }, i = Pa.bind(n);
    return i.listener = t, n.wrapFn = i, i;
  }
  a(vi, "_onceWrap");
  P.prototype.once = a(function(e, t) {
    return xt(t), this.on(e, vi(this, e, t)), this;
  }, "once");
  P.prototype.prependOnceListener = a(function(e, t) {
    return xt(t), this.prependListener(e, vi(this, e, t)), this;
  }, "prependOnceListener");
  P.prototype.removeListener = a(function(e, t) {
    var n, i, s, o, u;
    if (xt(t), i = this._events, i === void 0) return this;
    if (n = i[e], n === void 0) return this;
    if (n === t || n.listener === t) --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, n.listener || t));
    else if (typeof n != "function") {
      for (s = -1, o = n.length - 1; o >= 0; o--) if (n[o] === t || n[o].listener === t) {
        u = n[o].listener, s = o;
        break;
      }
      if (s < 0) return this;
      s === 0 ? n.shift() : Ra(n, s), n.length === 1 && (i[e] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", e, u || t);
    }
    return this;
  }, "removeListener");
  P.prototype.off = P.prototype.removeListener;
  P.prototype.removeAllListeners = a(function(e) {
    var t, n, i;
    if (n = this._events, n === void 0) return this;
    if (n.removeListener === void 0) return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[e]), this;
    if (arguments.length === 0) {
      var s = Object.keys(n), o;
      for (i = 0; i < s.length; ++i) o = s[i], o !== "removeListener" && this.removeAllListeners(
        o
      );
      return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
    }
    if (t = n[e], typeof t == "function") this.removeListener(e, t);
    else if (t !== void 0) for (i = t.length - 1; i >= 0; i--) this.removeListener(e, t[i]);
    return this;
  }, "removeAllListeners");
  function Si(r, e, t) {
    var n = r._events;
    if (n === void 0) return [];
    var i = n[e];
    return i === void 0 ? [] : typeof i == "function" ? t ? [i.listener || i] : [i] : t ? La(i) : Ai(i, i.length);
  }
  a(Si, "_listeners");
  P.prototype.listeners = a(function(e) {
    return Si(this, e, true);
  }, "listeners");
  P.prototype.rawListeners = a(function(e) {
    return Si(this, e, false);
  }, "rawListeners");
  P.listenerCount = function(r, e) {
    return typeof r.listenerCount == "function" ? r.listenerCount(e) : Ei.call(r, e);
  };
  P.prototype.listenerCount = Ei;
  function Ei(r) {
    var e = this._events;
    if (e !== void 0) {
      var t = e[r];
      if (typeof t == "function")
        return 1;
      if (t !== void 0) return t.length;
    }
    return 0;
  }
  a(Ei, "listenerCount");
  P.prototype.eventNames = a(function() {
    return this._eventsCount > 0 ? bt(this._events) : [];
  }, "eventNames");
  function Ai(r, e) {
    for (var t = new Array(e), n = 0; n < e; ++n) t[n] = r[n];
    return t;
  }
  a(Ai, "arrayClone");
  function Ra(r, e) {
    for (; e + 1 < r.length; e++) r[e] = r[e + 1];
    r.pop();
  }
  a(Ra, "spliceOne");
  function La(r) {
    for (var e = new Array(r.length), t = 0; t < e.length; ++t) e[t] = r[t].listener || r[t];
    return e;
  }
  a(La, "unwrapListeners");
  function Ba(r, e) {
    return new Promise(function(t, n) {
      function i(o) {
        r.removeListener(e, s), n(o);
      }
      a(i, "errorListener");
      function s() {
        typeof r.removeListener == "function" && r.removeListener("error", i), t([].slice.call(arguments));
      }
      a(s, "resolver"), Ci(r, e, s, { once: true }), e !== "error" && Fa(r, i, { once: true });
    });
  }
  a(Ba, "once");
  function Fa(r, e, t) {
    typeof r.on == "function" && Ci(r, "error", e, t);
  }
  a(
    Fa,
    "addErrorHandlerIfEventEmitter"
  );
  function Ci(r, e, t, n) {
    if (typeof r.on == "function") n.once ? r.once(e, t) : r.on(e, t);
    else if (typeof r.addEventListener == "function") r.addEventListener(e, a(function i(s) {
      n.once && r.removeEventListener(e, i), t(s);
    }, "wrapListener"));
    else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof r);
  }
  a(Ci, "eventTargetAgnosticAddListener");
});
var Ii = {};
se(Ii, { Socket: () => pe, isIP: () => Ma });
function Ma(r) {
  return 0;
}
var Ti;
var _i;
var A;
var pe;
var Ge = V(() => {
  "use strict";
  h();
  Ti = we(ve(), 1);
  a(Ma, "isIP");
  _i = /^[^.]+\./, A = class A2 extends Ti.EventEmitter {
    constructor() {
      super(...arguments);
      E(this, "opts", {});
      E(this, "connecting", false);
      E(this, "pending", true);
      E(
        this,
        "writable",
        true
      );
      E(this, "encrypted", false);
      E(this, "authorized", false);
      E(this, "destroyed", false);
      E(this, "ws", null);
      E(this, "writeBuffer");
      E(this, "tlsState", 0);
      E(this, "tlsRead");
      E(this, "tlsWrite");
    }
    static get poolQueryViaFetch() {
      return A2.opts.poolQueryViaFetch ?? A2.defaults.poolQueryViaFetch;
    }
    static set poolQueryViaFetch(t) {
      A2.opts.poolQueryViaFetch = t;
    }
    static get fetchEndpoint() {
      return A2.opts.fetchEndpoint ?? A2.defaults.fetchEndpoint;
    }
    static set fetchEndpoint(t) {
      A2.opts.fetchEndpoint = t;
    }
    static get fetchConnectionCache() {
      return true;
    }
    static set fetchConnectionCache(t) {
      console.warn("The `fetchConnectionCache` option is deprecated (now always `true`)");
    }
    static get fetchFunction() {
      return A2.opts.fetchFunction ?? A2.defaults.fetchFunction;
    }
    static set fetchFunction(t) {
      A2.opts.fetchFunction = t;
    }
    static get webSocketConstructor() {
      return A2.opts.webSocketConstructor ?? A2.defaults.webSocketConstructor;
    }
    static set webSocketConstructor(t) {
      A2.opts.webSocketConstructor = t;
    }
    get webSocketConstructor() {
      return this.opts.webSocketConstructor ?? A2.webSocketConstructor;
    }
    set webSocketConstructor(t) {
      this.opts.webSocketConstructor = t;
    }
    static get wsProxy() {
      return A2.opts.wsProxy ?? A2.defaults.wsProxy;
    }
    static set wsProxy(t) {
      A2.opts.wsProxy = t;
    }
    get wsProxy() {
      return this.opts.wsProxy ?? A2.wsProxy;
    }
    set wsProxy(t) {
      this.opts.wsProxy = t;
    }
    static get coalesceWrites() {
      return A2.opts.coalesceWrites ?? A2.defaults.coalesceWrites;
    }
    static set coalesceWrites(t) {
      A2.opts.coalesceWrites = t;
    }
    get coalesceWrites() {
      return this.opts.coalesceWrites ?? A2.coalesceWrites;
    }
    set coalesceWrites(t) {
      this.opts.coalesceWrites = t;
    }
    static get useSecureWebSocket() {
      return A2.opts.useSecureWebSocket ?? A2.defaults.useSecureWebSocket;
    }
    static set useSecureWebSocket(t) {
      A2.opts.useSecureWebSocket = t;
    }
    get useSecureWebSocket() {
      return this.opts.useSecureWebSocket ?? A2.useSecureWebSocket;
    }
    set useSecureWebSocket(t) {
      this.opts.useSecureWebSocket = t;
    }
    static get forceDisablePgSSL() {
      return A2.opts.forceDisablePgSSL ?? A2.defaults.forceDisablePgSSL;
    }
    static set forceDisablePgSSL(t) {
      A2.opts.forceDisablePgSSL = t;
    }
    get forceDisablePgSSL() {
      return this.opts.forceDisablePgSSL ?? A2.forceDisablePgSSL;
    }
    set forceDisablePgSSL(t) {
      this.opts.forceDisablePgSSL = t;
    }
    static get disableSNI() {
      return A2.opts.disableSNI ?? A2.defaults.disableSNI;
    }
    static set disableSNI(t) {
      A2.opts.disableSNI = t;
    }
    get disableSNI() {
      return this.opts.disableSNI ?? A2.disableSNI;
    }
    set disableSNI(t) {
      this.opts.disableSNI = t;
    }
    static get disableWarningInBrowsers() {
      return A2.opts.disableWarningInBrowsers ?? A2.defaults.disableWarningInBrowsers;
    }
    static set disableWarningInBrowsers(t) {
      A2.opts.disableWarningInBrowsers = t;
    }
    get disableWarningInBrowsers() {
      return this.opts.disableWarningInBrowsers ?? A2.disableWarningInBrowsers;
    }
    set disableWarningInBrowsers(t) {
      this.opts.disableWarningInBrowsers = t;
    }
    static get pipelineConnect() {
      return A2.opts.pipelineConnect ?? A2.defaults.pipelineConnect;
    }
    static set pipelineConnect(t) {
      A2.opts.pipelineConnect = t;
    }
    get pipelineConnect() {
      return this.opts.pipelineConnect ?? A2.pipelineConnect;
    }
    set pipelineConnect(t) {
      this.opts.pipelineConnect = t;
    }
    static get subtls() {
      return A2.opts.subtls ?? A2.defaults.subtls;
    }
    static set subtls(t) {
      A2.opts.subtls = t;
    }
    get subtls() {
      return this.opts.subtls ?? A2.subtls;
    }
    set subtls(t) {
      this.opts.subtls = t;
    }
    static get pipelineTLS() {
      return A2.opts.pipelineTLS ?? A2.defaults.pipelineTLS;
    }
    static set pipelineTLS(t) {
      A2.opts.pipelineTLS = t;
    }
    get pipelineTLS() {
      return this.opts.pipelineTLS ?? A2.pipelineTLS;
    }
    set pipelineTLS(t) {
      this.opts.pipelineTLS = t;
    }
    static get rootCerts() {
      return A2.opts.rootCerts ?? A2.defaults.rootCerts;
    }
    static set rootCerts(t) {
      A2.opts.rootCerts = t;
    }
    get rootCerts() {
      return this.opts.rootCerts ?? A2.rootCerts;
    }
    set rootCerts(t) {
      this.opts.rootCerts = t;
    }
    wsProxyAddrForHost(t, n) {
      let i = this.wsProxy;
      if (i === void 0) throw new Error("No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string");
      return typeof i == "function" ? i(t, n) : `${i}?address=${t}:${n}`;
    }
    setNoDelay() {
      return this;
    }
    setKeepAlive() {
      return this;
    }
    ref() {
      return this;
    }
    unref() {
      return this;
    }
    connect(t, n, i) {
      this.connecting = true, i && this.once("connect", i);
      let s = a(() => {
        this.connecting = false, this.pending = false, this.emit("connect"), this.emit("ready");
      }, "handleWebSocketOpen"), o = a((c, l = false) => {
        c.binaryType = "arraybuffer", c.addEventListener("error", (f) => {
          this.emit("error", f), this.emit("close");
        }), c.addEventListener("message", (f) => {
          if (this.tlsState === 0) {
            let m = p.from(f.data);
            this.emit("data", m);
          }
        }), c.addEventListener("close", () => {
          this.destroyed = true, this.emit("close");
        }), l ? s() : c.addEventListener("open", s);
      }, "configureWebSocket"), u;
      try {
        u = this.wsProxyAddrForHost(n, typeof t == "string" ? parseInt(t, 10) : t);
      } catch (c) {
        this.emit("error", c), this.emit("close");
        return;
      }
      try {
        let l = (this.useSecureWebSocket ? "wss:" : "ws:") + "//" + u;
        if (this.webSocketConstructor !== void 0) this.ws = new this.webSocketConstructor(l), o(this.ws);
        else try {
          this.ws = new WebSocket(l), o(this.ws);
        } catch {
          this.ws = new __unstable_WebSocket(l), o(
            this.ws
          );
        }
      } catch (c) {
        let f = (this.useSecureWebSocket ? "https:" : "http:") + "//" + u;
        fetch(f, { headers: { Upgrade: "websocket" } }).then((m) => {
          if (this.ws = m.webSocket, this.ws == null) throw c;
          this.ws.accept(), o(this.ws, true);
        }).catch((m) => {
          this.emit("error", new Error(`All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${m}`)), this.emit("close");
        });
      }
    }
    async startTls(t) {
      if (this.subtls === void 0) throw new Error("For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information.");
      this.tlsState = 1;
      let n = await this.subtls.TrustedCert.databaseFromPEM(this.rootCerts), i = new this.subtls.WebSocketReadQueue(this.ws), s = i.read.bind(i), o = this.rawWrite.bind(this), { read: u, write: c } = await this.subtls.startTls(t, n, s, o, { useSNI: !this.disableSNI, expectPreData: this.pipelineTLS ? new Uint8Array([83]) : void 0 });
      this.tlsRead = u, this.tlsWrite = c, this.tlsState = 2, this.encrypted = true, this.authorized = true, this.emit(
        "secureConnection",
        this
      ), this.tlsReadLoop().catch((l) => {
        this.destroyed || (this.destroyed = true, this.emit("error", l), this.ws?.close());
      });
    }
    async tlsReadLoop() {
      for (; ; ) {
        let t = await this.tlsRead();
        if (t === void 0) break;
        {
          let n = p.from(t);
          this.emit("data", n);
        }
      }
    }
    rawWrite(t) {
      if (!this.coalesceWrites) {
        this.ws && this.ws.send(t);
        return;
      }
      if (this.writeBuffer === void 0) this.writeBuffer = t, setTimeout(() => {
        this.ws && this.ws.send(this.writeBuffer), this.writeBuffer = void 0;
      }, 0);
      else {
        let n = new Uint8Array(this.writeBuffer.length + t.length);
        n.set(this.writeBuffer), n.set(t, this.writeBuffer.length), this.writeBuffer = n;
      }
    }
    write(t, n = "utf8", i = (s) => {
    }) {
      return t.length === 0 ? (i(), true) : (typeof t == "string" && (t = p.from(t, n)), this.tlsState === 0 ? (this.rawWrite(t), i()) : this.tlsState === 1 ? this.once("secureConnection", () => {
        this.write(t, n, i);
      }) : (this.tlsWrite(t), i()), true);
    }
    end(t = p.alloc(0), n = "utf8", i = () => {
    }) {
      return this.write(t, n, () => {
        this.ws?.close(), i();
      }), this;
    }
    destroy() {
      return this.destroyed = true, this.end();
    }
  };
  a(A, "Socket"), E(A, "defaults", {
    poolQueryViaFetch: false,
    fetchEndpoint: a((t, n, i) => {
      let s;
      return i?.jwtAuth ? s = t.replace(_i, "apiauth.") : s = t.replace(_i, "api."), "https://" + s + "/sql";
    }, "fetchEndpoint"),
    fetchConnectionCache: true,
    fetchFunction: void 0,
    webSocketConstructor: void 0,
    wsProxy: a((t) => t + "/v2", "wsProxy"),
    useSecureWebSocket: true,
    forceDisablePgSSL: true,
    coalesceWrites: true,
    pipelineConnect: "password",
    subtls: void 0,
    rootCerts: "",
    pipelineTLS: false,
    disableSNI: false,
    disableWarningInBrowsers: false
  }), E(A, "opts", {});
  pe = A;
});
var tr = T((Pi) => {
  "use strict";
  h();
  Pi.parse = function(r, e) {
    return new er(r, e).parse();
  };
  var St = class St2 {
    constructor(e, t) {
      this.source = e, this.transform = t || ka, this.position = 0, this.entries = [], this.recorded = [], this.dimension = 0;
    }
    isEof() {
      return this.position >= this.source.length;
    }
    nextCharacter() {
      var e = this.source[this.position++];
      return e === "\\" ? { value: this.source[this.position++], escaped: true } : { value: e, escaped: false };
    }
    record(e) {
      this.recorded.push(
        e
      );
    }
    newEntry(e) {
      var t;
      (this.recorded.length > 0 || e) && (t = this.recorded.join(""), t === "NULL" && !e && (t = null), t !== null && (t = this.transform(t)), this.entries.push(t), this.recorded = []);
    }
    consumeDimensions() {
      if (this.source[0] === "[") for (; !this.isEof(); ) {
        var e = this.nextCharacter();
        if (e.value === "=") break;
      }
    }
    parse(e) {
      var t, n, i;
      for (this.consumeDimensions(); !this.isEof(); ) if (t = this.nextCharacter(), t.value === "{" && !i) this.dimension++, this.dimension > 1 && (n = new St2(this.source.substr(this.position - 1), this.transform), this.entries.push(n.parse(
        true
      )), this.position += n.position - 2);
      else if (t.value === "}" && !i) {
        if (this.dimension--, !this.dimension && (this.newEntry(), e)) return this.entries;
      } else t.value === '"' && !t.escaped ? (i && this.newEntry(true), i = !i) : t.value === "," && !i ? this.newEntry() : this.record(t.value);
      if (this.dimension !== 0) throw new Error("array dimension not balanced");
      return this.entries;
    }
  };
  a(St, "ArrayParser");
  var er = St;
  function ka(r) {
    return r;
  }
  a(ka, "identity");
});
var rr = T((Ff, Ri) => {
  h();
  var Oa = tr();
  Ri.exports = { create: a(function(r, e) {
    return { parse: a(function() {
      return Oa.parse(r, e);
    }, "parse") };
  }, "create") };
});
var Fi = T((Of, Bi) => {
  "use strict";
  h();
  var Ua = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/, Qa = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/, Da = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/, qa = /^-?infinity$/;
  Bi.exports = a(function(e) {
    if (qa.test(e)) return Number(e.replace("i", "I"));
    var t = Ua.exec(e);
    if (!t) return Na(
      e
    ) || null;
    var n = !!t[8], i = parseInt(t[1], 10);
    n && (i = Li(i));
    var s = parseInt(t[2], 10) - 1, o = t[3], u = parseInt(
      t[4],
      10
    ), c = parseInt(t[5], 10), l = parseInt(t[6], 10), f = t[7];
    f = f ? 1e3 * parseFloat(f) : 0;
    var m, g = Wa(e);
    return g != null ? (m = new Date(Date.UTC(i, s, o, u, c, l, f)), nr(i) && m.setUTCFullYear(i), g !== 0 && m.setTime(m.getTime() - g)) : (m = new Date(i, s, o, u, c, l, f), nr(i) && m.setFullYear(i)), m;
  }, "parseDate");
  function Na(r) {
    var e = Qa.exec(r);
    if (e) {
      var t = parseInt(e[1], 10), n = !!e[4];
      n && (t = Li(t));
      var i = parseInt(e[2], 10) - 1, s = e[3], o = new Date(t, i, s);
      return nr(
        t
      ) && o.setFullYear(t), o;
    }
  }
  a(Na, "getDate");
  function Wa(r) {
    if (r.endsWith("+00")) return 0;
    var e = Da.exec(r.split(" ")[1]);
    if (e) {
      var t = e[1];
      if (t === "Z") return 0;
      var n = t === "-" ? -1 : 1, i = parseInt(e[2], 10) * 3600 + parseInt(
        e[3] || 0,
        10
      ) * 60 + parseInt(e[4] || 0, 10);
      return i * n * 1e3;
    }
  }
  a(Wa, "timeZoneOffset");
  function Li(r) {
    return -(r - 1);
  }
  a(Li, "bcYearToNegativeYear");
  function nr(r) {
    return r >= 0 && r < 100;
  }
  a(nr, "is0To99");
});
var ki = T((Df, Mi) => {
  h();
  Mi.exports = Ha;
  var ja = Object.prototype.hasOwnProperty;
  function Ha(r) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var n in t) ja.call(t, n) && (r[n] = t[n]);
    }
    return r;
  }
  a(Ha, "extend");
});
var Qi = T((Wf, Ui) => {
  "use strict";
  h();
  var $a = ki();
  Ui.exports = Me;
  function Me(r) {
    if (!(this instanceof Me))
      return new Me(r);
    $a(this, nu(r));
  }
  a(Me, "PostgresInterval");
  var Ga = [
    "seconds",
    "minutes",
    "hours",
    "days",
    "months",
    "years"
  ];
  Me.prototype.toPostgres = function() {
    var r = Ga.filter(this.hasOwnProperty, this);
    return this.milliseconds && r.indexOf("seconds") < 0 && r.push("seconds"), r.length === 0 ? "0" : r.map(function(e) {
      var t = this[e] || 0;
      return e === "seconds" && this.milliseconds && (t = (t + this.milliseconds / 1e3).toFixed(6).replace(
        /\.?0+$/,
        ""
      )), t + " " + e;
    }, this).join(" ");
  };
  var Va = { years: "Y", months: "M", days: "D", hours: "H", minutes: "M", seconds: "S" }, za = ["years", "months", "days"], Ka = ["hours", "minutes", "seconds"];
  Me.prototype.toISOString = Me.prototype.toISO = function() {
    var r = za.map(t, this).join(""), e = Ka.map(t, this).join("");
    return "P" + r + "T" + e;
    function t(n) {
      var i = this[n] || 0;
      return n === "seconds" && this.milliseconds && (i = (i + this.milliseconds / 1e3).toFixed(6).replace(
        /0+$/,
        ""
      )), i + Va[n];
    }
  };
  var ir = "([+-]?\\d+)", Ya = ir + "\\s+years?", Za = ir + "\\s+mons?", Ja = ir + "\\s+days?", Xa = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?", eu = new RegExp([Ya, Za, Ja, Xa].map(function(r) {
    return "(" + r + ")?";
  }).join("\\s*")), Oi = { years: 2, months: 4, days: 6, hours: 9, minutes: 10, seconds: 11, milliseconds: 12 }, tu = ["hours", "minutes", "seconds", "milliseconds"];
  function ru(r) {
    var e = r + "000000".slice(r.length);
    return parseInt(
      e,
      10
    ) / 1e3;
  }
  a(ru, "parseMilliseconds");
  function nu(r) {
    if (!r) return {};
    var e = eu.exec(r), t = e[8] === "-";
    return Object.keys(Oi).reduce(function(n, i) {
      var s = Oi[i], o = e[s];
      return !o || (o = i === "milliseconds" ? ru(o) : parseInt(o, 10), !o) || (t && ~tu.indexOf(i) && (o *= -1), n[i] = o), n;
    }, {});
  }
  a(nu, "parse");
});
var Ni = T(($f, qi) => {
  "use strict";
  h();
  var Di = p.from || p;
  qi.exports = a(function(e) {
    if (/^\\x/.test(e)) return Di(
      e.substr(2),
      "hex"
    );
    for (var t = "", n = 0; n < e.length; ) if (e[n] !== "\\") t += e[n], ++n;
    else if (/[0-7]{3}/.test(e.substr(n + 1, 3))) t += String.fromCharCode(parseInt(e.substr(n + 1, 3), 8)), n += 4;
    else {
      for (var i = 1; n + i < e.length && e[n + i] === "\\"; ) i++;
      for (var s = 0; s < Math.floor(i / 2); ++s) t += "\\";
      n += Math.floor(i / 2) * 2;
    }
    return Di(t, "binary");
  }, "parseBytea");
});
var zi = T((zf, Vi) => {
  h();
  var Ve = tr(), ze = rr(), Et = Fi(), ji = Qi(), Hi = Ni();
  function At(r) {
    return a(function(t) {
      return t === null ? t : r(t);
    }, "nullAllowed");
  }
  a(At, "allowNull");
  function $i(r) {
    return r === null ? r : r === "TRUE" || r === "t" || r === "true" || r === "y" || r === "yes" || r === "on" || r === "1";
  }
  a($i, "parseBool");
  function iu(r) {
    return r ? Ve.parse(r, $i) : null;
  }
  a(iu, "parseBoolArray");
  function su(r) {
    return parseInt(r, 10);
  }
  a(su, "parseBaseTenInt");
  function sr(r) {
    return r ? Ve.parse(r, At(su)) : null;
  }
  a(sr, "parseIntegerArray");
  function ou(r) {
    return r ? Ve.parse(r, At(function(e) {
      return Gi(e).trim();
    })) : null;
  }
  a(ou, "parseBigIntegerArray");
  var au = a(function(r) {
    if (!r) return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = cr(t)), t;
    });
    return e.parse();
  }, "parsePointArray"), or2 = a(function(r) {
    if (!r) return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = parseFloat(t)), t;
    });
    return e.parse();
  }, "parseFloatArray"), ee = a(function(r) {
    if (!r) return null;
    var e = ze.create(r);
    return e.parse();
  }, "parseStringArray"), ar = a(function(r) {
    if (!r) return null;
    var e = ze.create(
      r,
      function(t) {
        return t !== null && (t = Et(t)), t;
      }
    );
    return e.parse();
  }, "parseDateArray"), uu = a(function(r) {
    if (!r)
      return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = ji(t)), t;
    });
    return e.parse();
  }, "parseIntervalArray"), cu = a(function(r) {
    return r ? Ve.parse(r, At(Hi)) : null;
  }, "parseByteAArray"), ur = a(function(r) {
    return parseInt(r, 10);
  }, "parseInteger"), Gi = a(function(r) {
    var e = String(r);
    return /^\d+$/.test(e) ? e : r;
  }, "parseBigInteger"), Wi = a(function(r) {
    return r ? Ve.parse(r, At(JSON.parse)) : null;
  }, "parseJsonArray"), cr = a(
    function(r) {
      return r[0] !== "(" ? null : (r = r.substring(1, r.length - 1).split(","), { x: parseFloat(r[0]), y: parseFloat(
        r[1]
      ) });
    },
    "parsePoint"
  ), lu = a(function(r) {
    if (r[0] !== "<" && r[1] !== "(") return null;
    for (var e = "(", t = "", n = false, i = 2; i < r.length - 1; i++) {
      if (n || (e += r[i]), r[i] === ")") {
        n = true;
        continue;
      } else if (!n) continue;
      r[i] !== "," && (t += r[i]);
    }
    var s = cr(e);
    return s.radius = parseFloat(t), s;
  }, "parseCircle"), fu = a(function(r) {
    r(20, Gi), r(21, ur), r(23, ur), r(26, ur), r(700, parseFloat), r(701, parseFloat), r(16, $i), r(1082, Et), r(1114, Et), r(1184, Et), r(
      600,
      cr
    ), r(651, ee), r(718, lu), r(1e3, iu), r(1001, cu), r(1005, sr), r(1007, sr), r(1028, sr), r(1016, ou), r(1017, au), r(1021, or2), r(1022, or2), r(1231, or2), r(1014, ee), r(1015, ee), r(1008, ee), r(1009, ee), r(1040, ee), r(1041, ee), r(
      1115,
      ar
    ), r(1182, ar), r(1185, ar), r(1186, ji), r(1187, uu), r(17, Hi), r(114, JSON.parse.bind(JSON)), r(3802, JSON.parse.bind(JSON)), r(199, Wi), r(3807, Wi), r(3907, ee), r(2951, ee), r(791, ee), r(1183, ee), r(1270, ee);
  }, "init");
  Vi.exports = { init: fu };
});
var Yi = T((Zf, Ki) => {
  "use strict";
  h();
  var K = 1e6;
  function hu(r) {
    var e = r.readInt32BE(0), t = r.readUInt32BE(
      4
    ), n = "";
    e < 0 && (e = ~e + (t === 0), t = ~t + 1 >>> 0, n = "-");
    var i = "", s, o, u, c, l, f;
    {
      if (s = e % K, e = e / K >>> 0, o = 4294967296 * s + t, t = o / K >>> 0, u = "" + (o - K * t), t === 0 && e === 0) return n + u + i;
      for (c = "", l = 6 - u.length, f = 0; f < l; f++) c += "0";
      i = c + u + i;
    }
    {
      if (s = e % K, e = e / K >>> 0, o = 4294967296 * s + t, t = o / K >>> 0, u = "" + (o - K * t), t === 0 && e === 0) return n + u + i;
      for (c = "", l = 6 - u.length, f = 0; f < l; f++) c += "0";
      i = c + u + i;
    }
    {
      if (s = e % K, e = e / K >>> 0, o = 4294967296 * s + t, t = o / K >>> 0, u = "" + (o - K * t), t === 0 && e === 0) return n + u + i;
      for (c = "", l = 6 - u.length, f = 0; f < l; f++) c += "0";
      i = c + u + i;
    }
    return s = e % K, o = 4294967296 * s + t, u = "" + o % K, n + u + i;
  }
  a(hu, "readInt8");
  Ki.exports = hu;
});
var ts = T((eh, es) => {
  h();
  var du = Yi(), B = a(function(r, e, t, n, i) {
    t = t || 0, n = n || false, i = i || function(w, S, k) {
      return w * Math.pow(2, k) + S;
    };
    var s = t >> 3, o = a(function(w) {
      return n ? ~w & 255 : w;
    }, "inv"), u = 255, c = 8 - t % 8;
    e < c && (u = 255 << 8 - e & 255, c = e), t && (u = u >> t % 8);
    var l = 0;
    t % 8 + e >= 8 && (l = i(0, o(r[s]) & u, c));
    for (var f = e + t >> 3, m = s + 1; m < f; m++) l = i(l, o(
      r[m]
    ), 8);
    var g = (e + t) % 8;
    return g > 0 && (l = i(l, o(r[f]) >> 8 - g, g)), l;
  }, "parseBits"), Xi = a(function(r, e, t) {
    var n = Math.pow(2, t - 1) - 1, i = B(r, 1), s = B(r, t, 1);
    if (s === 0) return 0;
    var o = 1, u = a(function(l, f, m) {
      l === 0 && (l = 1);
      for (var g = 1; g <= m; g++) o /= 2, (f & 1 << m - g) > 0 && (l += o);
      return l;
    }, "parsePrecisionBits"), c = B(r, e, t + 1, false, u);
    return s == Math.pow(
      2,
      t + 1
    ) - 1 ? c === 0 ? i === 0 ? 1 / 0 : -1 / 0 : NaN : (i === 0 ? 1 : -1) * Math.pow(2, s - n) * c;
  }, "parseFloatFromBits"), pu = a(function(r) {
    return B(r, 1) == 1 ? -1 * (B(r, 15, 1, true) + 1) : B(r, 15, 1);
  }, "parseInt16"), Zi = a(function(r) {
    return B(r, 1) == 1 ? -1 * (B(
      r,
      31,
      1,
      true
    ) + 1) : B(r, 31, 1);
  }, "parseInt32"), yu = a(function(r) {
    return Xi(r, 23, 8);
  }, "parseFloat32"), mu = a(function(r) {
    return Xi(r, 52, 11);
  }, "parseFloat64"), gu = a(function(r) {
    var e = B(r, 16, 32);
    if (e == 49152) return NaN;
    for (var t = Math.pow(1e4, B(r, 16, 16)), n = 0, i = [], s = B(r, 16), o = 0; o < s; o++) n += B(r, 16, 64 + 16 * o) * t, t /= 1e4;
    var u = Math.pow(10, B(
      r,
      16,
      48
    ));
    return (e === 0 ? 1 : -1) * Math.round(n * u) / u;
  }, "parseNumeric"), Ji = a(function(r, e) {
    var t = B(e, 1), n = B(
      e,
      63,
      1
    ), i = new Date((t === 0 ? 1 : -1) * n / 1e3 + 9466848e5);
    return r || i.setTime(i.getTime() + i.getTimezoneOffset() * 6e4), i.usec = n % 1e3, i.getMicroSeconds = function() {
      return this.usec;
    }, i.setMicroSeconds = function(s) {
      this.usec = s;
    }, i.getUTCMicroSeconds = function() {
      return this.usec;
    }, i;
  }, "parseDate"), Ke = a(
    function(r) {
      for (var e = B(
        r,
        32
      ), t = B(r, 32, 32), n = B(r, 32, 64), i = 96, s = [], o = 0; o < e; o++) s[o] = B(r, 32, i), i += 32, i += 32;
      var u = a(function(l) {
        var f = B(r, 32, i);
        if (i += 32, f == 4294967295) return null;
        var m;
        if (l == 23 || l == 20) return m = B(r, f * 8, i), i += f * 8, m;
        if (l == 25) return m = r.toString(this.encoding, i >> 3, (i += f << 3) >> 3), m;
        console.log("ERROR: ElementType not implemented: " + l);
      }, "parseElement"), c = a(function(l, f) {
        var m = [], g;
        if (l.length > 1) {
          var w = l.shift();
          for (g = 0; g < w; g++) m[g] = c(l, f);
          l.unshift(w);
        } else for (g = 0; g < l[0]; g++) m[g] = u(f);
        return m;
      }, "parse");
      return c(s, n);
    },
    "parseArray"
  ), wu = a(function(r) {
    return r.toString("utf8");
  }, "parseText"), bu = a(function(r) {
    return r === null ? null : B(r, 8) > 0;
  }, "parseBool"), xu = a(function(r) {
    r(20, du), r(21, pu), r(23, Zi), r(26, Zi), r(1700, gu), r(700, yu), r(701, mu), r(16, bu), r(1114, Ji.bind(null, false)), r(1184, Ji.bind(null, true)), r(1e3, Ke), r(1007, Ke), r(1016, Ke), r(1008, Ke), r(1009, Ke), r(25, wu);
  }, "init");
  es.exports = { init: xu };
});
var ns = T((nh, rs) => {
  h();
  rs.exports = {
    BOOL: 16,
    BYTEA: 17,
    CHAR: 18,
    INT8: 20,
    INT2: 21,
    INT4: 23,
    REGPROC: 24,
    TEXT: 25,
    OID: 26,
    TID: 27,
    XID: 28,
    CID: 29,
    JSON: 114,
    XML: 142,
    PG_NODE_TREE: 194,
    SMGR: 210,
    PATH: 602,
    POLYGON: 604,
    CIDR: 650,
    FLOAT4: 700,
    FLOAT8: 701,
    ABSTIME: 702,
    RELTIME: 703,
    TINTERVAL: 704,
    CIRCLE: 718,
    MACADDR8: 774,
    MONEY: 790,
    MACADDR: 829,
    INET: 869,
    ACLITEM: 1033,
    BPCHAR: 1042,
    VARCHAR: 1043,
    DATE: 1082,
    TIME: 1083,
    TIMESTAMP: 1114,
    TIMESTAMPTZ: 1184,
    INTERVAL: 1186,
    TIMETZ: 1266,
    BIT: 1560,
    VARBIT: 1562,
    NUMERIC: 1700,
    REFCURSOR: 1790,
    REGPROCEDURE: 2202,
    REGOPER: 2203,
    REGOPERATOR: 2204,
    REGCLASS: 2205,
    REGTYPE: 2206,
    UUID: 2950,
    TXID_SNAPSHOT: 2970,
    PG_LSN: 3220,
    PG_NDISTINCT: 3361,
    PG_DEPENDENCIES: 3402,
    TSVECTOR: 3614,
    TSQUERY: 3615,
    GTSVECTOR: 3642,
    REGCONFIG: 3734,
    REGDICTIONARY: 3769,
    JSONB: 3802,
    REGNAMESPACE: 4089,
    REGROLE: 4096
  };
});
var Je = T((Ze) => {
  h();
  var vu = zi(), Su = ts(), Eu = rr(), Au = ns();
  Ze.getTypeParser = Cu;
  Ze.setTypeParser = _u;
  Ze.arrayParser = Eu;
  Ze.builtins = Au;
  var Ye = { text: {}, binary: {} };
  function is2(r) {
    return String(r);
  }
  a(is2, "noParse");
  function Cu(r, e) {
    return e = e || "text", Ye[e] && Ye[e][r] || is2;
  }
  a(Cu, "getTypeParser");
  function _u(r, e, t) {
    typeof e == "function" && (t = e, e = "text"), Ye[e][r] = t;
  }
  a(_u, "setTypeParser");
  vu.init(function(r, e) {
    Ye.text[r] = e;
  });
  Su.init(function(r, e) {
    Ye.binary[r] = e;
  });
});
var _t = T((uh, ss) => {
  "use strict";
  h();
  var Tu = Je();
  function Ct(r) {
    this._types = r || Tu, this.text = {}, this.binary = {};
  }
  a(Ct, "TypeOverrides");
  Ct.prototype.getOverrides = function(r) {
    switch (r) {
      case "text":
        return this.text;
      case "binary":
        return this.binary;
      default:
        return {};
    }
  };
  Ct.prototype.setTypeParser = function(r, e, t) {
    typeof e == "function" && (t = e, e = "text"), this.getOverrides(e)[r] = t;
  };
  Ct.prototype.getTypeParser = function(r, e) {
    return e = e || "text", this.getOverrides(e)[r] || this._types.getTypeParser(r, e);
  };
  ss.exports = Ct;
});
function Xe(r) {
  let e = 1779033703, t = 3144134277, n = 1013904242, i = 2773480762, s = 1359893119, o = 2600822924, u = 528734635, c = 1541459225, l = 0, f = 0, m = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ], g = a((I, C) => I >>> C | I << 32 - C, "rrot"), w = new Uint32Array(64), S = new Uint8Array(64), k = a(() => {
    for (let R = 0, $ = 0; R < 16; R++, $ += 4) w[R] = S[$] << 24 | S[$ + 1] << 16 | S[$ + 2] << 8 | S[$ + 3];
    for (let R = 16; R < 64; R++) {
      let $ = g(w[R - 15], 7) ^ g(w[R - 15], 18) ^ w[R - 15] >>> 3, Ee = g(
        w[R - 2],
        17
      ) ^ g(w[R - 2], 19) ^ w[R - 2] >>> 10;
      w[R] = w[R - 16] + $ + w[R - 7] + Ee | 0;
    }
    let I = e, C = t, re = n, ne2 = i, H = s, oe = o, ae = u, me = c;
    for (let R = 0; R < 64; R++) {
      let $ = g(H, 6) ^ g(H, 11) ^ g(H, 25), Ee = H & oe ^ ~H & ae, ue = me + $ + Ee + m[R] + w[R] | 0, Te = g(I, 2) ^ g(
        I,
        13
      ) ^ g(I, 22), ce = I & C ^ I & re ^ C & re, G = Te + ce | 0;
      me = ae, ae = oe, oe = H, H = ne2 + ue | 0, ne2 = re, re = C, C = I, I = ue + G | 0;
    }
    e = e + I | 0, t = t + C | 0, n = n + re | 0, i = i + ne2 | 0, s = s + H | 0, o = o + oe | 0, u = u + ae | 0, c = c + me | 0, f = 0;
  }, "process"), D = a(
    (I) => {
      typeof I == "string" && (I = new TextEncoder().encode(I));
      for (let C = 0; C < I.length; C++) S[f++] = I[C], f === 64 && k();
      l += I.length;
    },
    "add"
  ), he = a(() => {
    if (S[f++] = 128, f == 64 && k(), f + 8 > 64) {
      for (; f < 64; ) S[f++] = 0;
      k();
    }
    for (; f < 58; ) S[f++] = 0;
    let I = l * 8;
    S[f++] = I / 1099511627776 & 255, S[f++] = I / 4294967296 & 255, S[f++] = I >>> 24, S[f++] = I >>> 16 & 255, S[f++] = I >>> 8 & 255, S[f++] = I & 255, k();
    let C = new Uint8Array(32);
    return C[0] = e >>> 24, C[1] = e >>> 16 & 255, C[2] = e >>> 8 & 255, C[3] = e & 255, C[4] = t >>> 24, C[5] = t >>> 16 & 255, C[6] = t >>> 8 & 255, C[7] = t & 255, C[8] = n >>> 24, C[9] = n >>> 16 & 255, C[10] = n >>> 8 & 255, C[11] = n & 255, C[12] = i >>> 24, C[13] = i >>> 16 & 255, C[14] = i >>> 8 & 255, C[15] = i & 255, C[16] = s >>> 24, C[17] = s >>> 16 & 255, C[18] = s >>> 8 & 255, C[19] = s & 255, C[20] = o >>> 24, C[21] = o >>> 16 & 255, C[22] = o >>> 8 & 255, C[23] = o & 255, C[24] = u >>> 24, C[25] = u >>> 16 & 255, C[26] = u >>> 8 & 255, C[27] = u & 255, C[28] = c >>> 24, C[29] = c >>> 16 & 255, C[30] = c >>> 8 & 255, C[31] = c & 255, C;
  }, "digest");
  return r === void 0 ? { add: D, digest: he } : (D(r), he());
}
var os = V(() => {
  "use strict";
  h();
  a(Xe, "sha256");
});
var M;
var et;
var as = V(() => {
  "use strict";
  h();
  M = class M2 {
    constructor() {
      E(this, "_dataLength", 0);
      E(this, "_bufferLength", 0);
      E(this, "_state", new Int32Array(4));
      E(this, "_buffer", new ArrayBuffer(68));
      E(this, "_buffer8");
      E(this, "_buffer32");
      this._buffer8 = new Uint8Array(this._buffer, 0, 68), this._buffer32 = new Uint32Array(this._buffer, 0, 17), this.start();
    }
    static hashByteArray(e, t = false) {
      return this.onePassHasher.start().appendByteArray(
        e
      ).end(t);
    }
    static hashStr(e, t = false) {
      return this.onePassHasher.start().appendStr(e).end(t);
    }
    static hashAsciiStr(e, t = false) {
      return this.onePassHasher.start().appendAsciiStr(e).end(t);
    }
    static _hex(e) {
      let t = M2.hexChars, n = M2.hexOut, i, s, o, u;
      for (u = 0; u < 4; u += 1) for (s = u * 8, i = e[u], o = 0; o < 8; o += 2) n[s + 1 + o] = t.charAt(i & 15), i >>>= 4, n[s + 0 + o] = t.charAt(
        i & 15
      ), i >>>= 4;
      return n.join("");
    }
    static _md5cycle(e, t) {
      let n = e[0], i = e[1], s = e[2], o = e[3];
      n += (i & s | ~i & o) + t[0] - 680876936 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[1] - 389564586 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[2] + 606105819 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[3] - 1044525330 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[4] - 176418897 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[5] + 1200080426 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[6] - 1473231341 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[7] - 45705983 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[8] + 1770035416 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[9] - 1958414417 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[10] - 42063 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[11] - 1990404162 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[12] + 1804603682 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[13] - 40341101 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[14] - 1502002290 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[15] + 1236535329 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & o | s & ~o) + t[1] - 165796510 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[6] - 1069501632 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[11] + 643717713 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[0] - 373897302 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[5] - 701558691 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[10] + 38016083 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[15] - 660478335 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[4] - 405537848 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[9] + 568446438 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[14] - 1019803690 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[3] - 187363961 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[8] + 1163531501 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[13] - 1444681467 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[2] - 51403784 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[7] + 1735328473 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[12] - 1926607734 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i ^ s ^ o) + t[5] - 378558 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[8] - 2022574463 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[11] + 1839030562 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[14] - 35309556 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[1] - 1530992060 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[4] + 1272893353 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[7] - 155497632 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[10] - 1094730640 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[13] + 681279174 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[0] - 358537222 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[3] - 722521979 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[6] + 76029189 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[9] - 640364487 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[12] - 421815835 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[15] + 530742520 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[2] - 995338651 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (s ^ (i | ~o)) + t[0] - 198630844 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[7] + 1126891415 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[14] - 1416354905 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[5] - 57434055 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[12] + 1700485571 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[3] - 1894986606 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[10] - 1051523 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[1] - 2054922799 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[8] + 1873313359 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[15] - 30611744 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[6] - 1560198380 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[13] + 1309151649 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[4] - 145523070 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[11] - 1120210379 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[2] + 718787259 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[9] - 343485551 | 0, i = (i << 21 | i >>> 11) + s | 0, e[0] = n + e[0] | 0, e[1] = i + e[1] | 0, e[2] = s + e[2] | 0, e[3] = o + e[3] | 0;
    }
    start() {
      return this._dataLength = 0, this._bufferLength = 0, this._state.set(M2.stateIdentity), this;
    }
    appendStr(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o;
      for (o = 0; o < e.length; o += 1) {
        if (s = e.charCodeAt(o), s < 128) t[i++] = s;
        else if (s < 2048) t[i++] = (s >>> 6) + 192, t[i++] = s & 63 | 128;
        else if (s < 55296 || s > 56319) t[i++] = (s >>> 12) + 224, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
        else {
          if (s = (s - 55296) * 1024 + (e.charCodeAt(++o) - 56320) + 65536, s > 1114111) throw new Error(
            "Unicode standard supports code points up to U+10FFFF"
          );
          t[i++] = (s >>> 18) + 240, t[i++] = s >>> 12 & 63 | 128, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
        }
        i >= 64 && (this._dataLength += 64, M2._md5cycle(this._state, n), i -= 64, n[0] = n[16]);
      }
      return this._bufferLength = i, this;
    }
    appendAsciiStr(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
      for (; ; ) {
        for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e.charCodeAt(o++);
        if (i < 64) break;
        this._dataLength += 64, M2._md5cycle(this._state, n), i = 0;
      }
      return this._bufferLength = i, this;
    }
    appendByteArray(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
      for (; ; ) {
        for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e[o++];
        if (i < 64) break;
        this._dataLength += 64, M2._md5cycle(this._state, n), i = 0;
      }
      return this._bufferLength = i, this;
    }
    getState() {
      let e = this._state;
      return { buffer: String.fromCharCode.apply(null, Array.from(this._buffer8)), buflen: this._bufferLength, length: this._dataLength, state: [e[0], e[1], e[2], e[3]] };
    }
    setState(e) {
      let t = e.buffer, n = e.state, i = this._state, s;
      for (this._dataLength = e.length, this._bufferLength = e.buflen, i[0] = n[0], i[1] = n[1], i[2] = n[2], i[3] = n[3], s = 0; s < t.length; s += 1) this._buffer8[s] = t.charCodeAt(s);
    }
    end(e = false) {
      let t = this._bufferLength, n = this._buffer8, i = this._buffer32, s = (t >> 2) + 1;
      this._dataLength += t;
      let o = this._dataLength * 8;
      if (n[t] = 128, n[t + 1] = n[t + 2] = n[t + 3] = 0, i.set(M2.buffer32Identity.subarray(s), s), t > 55 && (M2._md5cycle(this._state, i), i.set(M2.buffer32Identity)), o <= 4294967295) i[14] = o;
      else {
        let u = o.toString(16).match(/(.*?)(.{0,8})$/);
        if (u === null) return;
        let c = parseInt(
          u[2],
          16
        ), l = parseInt(u[1], 16) || 0;
        i[14] = c, i[15] = l;
      }
      return M2._md5cycle(this._state, i), e ? this._state : M2._hex(
        this._state
      );
    }
  };
  a(M, "Md5"), E(M, "stateIdentity", new Int32Array([1732584193, -271733879, -1732584194, 271733878])), E(M, "buffer32Identity", new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])), E(M, "hexChars", "0123456789abcdef"), E(M, "hexOut", []), E(M, "onePassHasher", new M());
  et = M;
});
var lr = {};
se(lr, { createHash: () => Pu, createHmac: () => Ru, randomBytes: () => Iu });
function Iu(r) {
  return crypto.getRandomValues(p.alloc(r));
}
function Pu(r) {
  if (r === "sha256") return { update: a(function(e) {
    return { digest: a(
      function() {
        return p.from(Xe(e));
      },
      "digest"
    ) };
  }, "update") };
  if (r === "md5") return { update: a(function(e) {
    return {
      digest: a(function() {
        return typeof e == "string" ? et.hashStr(e) : et.hashByteArray(e);
      }, "digest")
    };
  }, "update") };
  throw new Error(`Hash type '${r}' not supported`);
}
function Ru(r, e) {
  if (r !== "sha256") throw new Error(`Only sha256 is supported (requested: '${r}')`);
  return { update: a(function(t) {
    return { digest: a(
      function() {
        typeof e == "string" && (e = new TextEncoder().encode(e)), typeof t == "string" && (t = new TextEncoder().encode(
          t
        ));
        let n = e.length;
        if (n > 64) e = Xe(e);
        else if (n < 64) {
          let c = new Uint8Array(64);
          c.set(e), e = c;
        }
        let i = new Uint8Array(
          64
        ), s = new Uint8Array(64);
        for (let c = 0; c < 64; c++) i[c] = 54 ^ e[c], s[c] = 92 ^ e[c];
        let o = new Uint8Array(t.length + 64);
        o.set(i, 0), o.set(t, 64);
        let u = new Uint8Array(96);
        return u.set(s, 0), u.set(Xe(o), 64), p.from(Xe(u));
      },
      "digest"
    ) };
  }, "update") };
}
var fr = V(() => {
  "use strict";
  h();
  os();
  as();
  a(Iu, "randomBytes");
  a(Pu, "createHash");
  a(Ru, "createHmac");
});
var tt = T((vh, hr) => {
  "use strict";
  h();
  hr.exports = {
    host: "localhost",
    user: y.platform === "win32" ? y.env.USERNAME : y.env.USER,
    database: void 0,
    password: null,
    connectionString: void 0,
    port: 5432,
    rows: 0,
    binary: false,
    max: 10,
    idleTimeoutMillis: 3e4,
    client_encoding: "",
    ssl: false,
    application_name: void 0,
    fallback_application_name: void 0,
    options: void 0,
    parseInputDatesAsUTC: false,
    statement_timeout: false,
    lock_timeout: false,
    idle_in_transaction_session_timeout: false,
    query_timeout: false,
    connect_timeout: 0,
    keepalives: 1,
    keepalives_idle: 0
  };
  var ke = Je(), Lu = ke.getTypeParser(20, "text"), Bu = ke.getTypeParser(
    1016,
    "text"
  );
  hr.exports.__defineSetter__("parseInt8", function(r) {
    ke.setTypeParser(20, "text", r ? ke.getTypeParser(
      23,
      "text"
    ) : Lu), ke.setTypeParser(1016, "text", r ? ke.getTypeParser(1007, "text") : Bu);
  });
});
var rt = T((Eh, cs) => {
  "use strict";
  h();
  var Fu = (fr(), O(lr)), Mu = tt();
  function ku(r) {
    var e = r.replace(
      /\\/g,
      "\\\\"
    ).replace(/"/g, '\\"');
    return '"' + e + '"';
  }
  a(ku, "escapeElement");
  function us(r) {
    for (var e = "{", t = 0; t < r.length; t++) t > 0 && (e = e + ","), r[t] === null || typeof r[t] > "u" ? e = e + "NULL" : Array.isArray(r[t]) ? e = e + us(r[t]) : r[t] instanceof p ? e += "\\\\x" + r[t].toString("hex") : e += ku(Tt(r[t]));
    return e = e + "}", e;
  }
  a(us, "arrayString");
  var Tt = a(function(r, e) {
    if (r == null) return null;
    if (r instanceof p) return r;
    if (ArrayBuffer.isView(r)) {
      var t = p.from(r.buffer, r.byteOffset, r.byteLength);
      return t.length === r.byteLength ? t : t.slice(r.byteOffset, r.byteOffset + r.byteLength);
    }
    return r instanceof Date ? Mu.parseInputDatesAsUTC ? Qu(r) : Uu(r) : Array.isArray(r) ? us(r) : typeof r == "object" ? Ou(r, e) : r.toString();
  }, "prepareValue");
  function Ou(r, e) {
    if (r && typeof r.toPostgres == "function") {
      if (e = e || [], e.indexOf(r) !== -1) throw new Error('circular reference detected while preparing "' + r + '" for query');
      return e.push(r), Tt(r.toPostgres(Tt), e);
    }
    return JSON.stringify(r);
  }
  a(Ou, "prepareObject");
  function W(r, e) {
    for (r = "" + r; r.length < e; ) r = "0" + r;
    return r;
  }
  a(W, "pad");
  function Uu(r) {
    var e = -r.getTimezoneOffset(), t = r.getFullYear(), n = t < 1;
    n && (t = Math.abs(t) + 1);
    var i = W(t, 4) + "-" + W(r.getMonth() + 1, 2) + "-" + W(r.getDate(), 2) + "T" + W(
      r.getHours(),
      2
    ) + ":" + W(r.getMinutes(), 2) + ":" + W(r.getSeconds(), 2) + "." + W(r.getMilliseconds(), 3);
    return e < 0 ? (i += "-", e *= -1) : i += "+", i += W(Math.floor(e / 60), 2) + ":" + W(e % 60, 2), n && (i += " BC"), i;
  }
  a(Uu, "dateToString");
  function Qu(r) {
    var e = r.getUTCFullYear(), t = e < 1;
    t && (e = Math.abs(e) + 1);
    var n = W(e, 4) + "-" + W(r.getUTCMonth() + 1, 2) + "-" + W(r.getUTCDate(), 2) + "T" + W(r.getUTCHours(), 2) + ":" + W(r.getUTCMinutes(), 2) + ":" + W(r.getUTCSeconds(), 2) + "." + W(
      r.getUTCMilliseconds(),
      3
    );
    return n += "+00:00", t && (n += " BC"), n;
  }
  a(Qu, "dateToStringUTC");
  function Du(r, e, t) {
    return r = typeof r == "string" ? { text: r } : r, e && (typeof e == "function" ? r.callback = e : r.values = e), t && (r.callback = t), r;
  }
  a(Du, "normalizeQueryConfig");
  var dr = a(function(r) {
    return Fu.createHash("md5").update(r, "utf-8").digest("hex");
  }, "md5"), qu = a(
    function(r, e, t) {
      var n = dr(e + r), i = dr(p.concat([p.from(n), t]));
      return "md5" + i;
    },
    "postgresMd5PasswordHash"
  );
  cs.exports = {
    prepareValue: a(function(e) {
      return Tt(e);
    }, "prepareValueWrapper"),
    normalizeQueryConfig: Du,
    postgresMd5PasswordHash: qu,
    md5: dr
  };
});
var nt = {};
se(nt, { default: () => ju });
var ju;
var it = V(() => {
  "use strict";
  h();
  ju = {};
});
var xs = T((Dh, bs) => {
  "use strict";
  h();
  var pr = (fr(), O(lr));
  function Hu(r) {
    if (r.indexOf("SCRAM-SHA-256") === -1) throw new Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");
    let e = pr.randomBytes(
      18
    ).toString("base64");
    return { mechanism: "SCRAM-SHA-256", clientNonce: e, response: "n,,n=*,r=" + e, message: "SASLInitialResponse" };
  }
  a(Hu, "startSession");
  function $u(r, e, t) {
    if (r.message !== "SASLInitialResponse") throw new Error(
      "SASL: Last message was not SASLInitialResponse"
    );
    if (typeof e != "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");
    if (typeof t != "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
    let n = zu(t);
    if (n.nonce.startsWith(r.clientNonce)) {
      if (n.nonce.length === r.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
    var i = p.from(n.salt, "base64"), s = Zu(e, i, n.iteration), o = Oe(s, "Client Key"), u = Yu(
      o
    ), c = "n=*,r=" + r.clientNonce, l = "r=" + n.nonce + ",s=" + n.salt + ",i=" + n.iteration, f = "c=biws,r=" + n.nonce, m = c + "," + l + "," + f, g = Oe(u, m), w = ws(o, g), S = w.toString("base64"), k = Oe(s, "Server Key"), D = Oe(k, m);
    r.message = "SASLResponse", r.serverSignature = D.toString("base64"), r.response = f + ",p=" + S;
  }
  a($u, "continueSession");
  function Gu(r, e) {
    if (r.message !== "SASLResponse") throw new Error("SASL: Last message was not SASLResponse");
    if (typeof e != "string") throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
    let { serverSignature: t } = Ku(
      e
    );
    if (t !== r.serverSignature) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
  }
  a(Gu, "finalizeSession");
  function Vu(r) {
    if (typeof r != "string") throw new TypeError("SASL: text must be a string");
    return r.split("").map((e, t) => r.charCodeAt(t)).every((e) => e >= 33 && e <= 43 || e >= 45 && e <= 126);
  }
  a(Vu, "isPrintableChars");
  function ms(r) {
    return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(r);
  }
  a(ms, "isBase64");
  function gs(r) {
    if (typeof r != "string") throw new TypeError("SASL: attribute pairs text must be a string");
    return new Map(r.split(",").map((e) => {
      if (!/^.=/.test(e)) throw new Error("SASL: Invalid attribute pair entry");
      let t = e[0], n = e.substring(2);
      return [t, n];
    }));
  }
  a(gs, "parseAttributePairs");
  function zu(r) {
    let e = gs(r), t = e.get("r");
    if (t) {
      if (!Vu(t)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
    let n = e.get("s");
    if (n) {
      if (!ms(n)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
    let i = e.get("i");
    if (i) {
      if (!/^[1-9][0-9]*$/.test(i)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
    let s = parseInt(i, 10);
    return { nonce: t, salt: n, iteration: s };
  }
  a(zu, "parseServerFirstMessage");
  function Ku(r) {
    let t = gs(r).get("v");
    if (t) {
      if (!ms(t)) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
    } else throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");
    return { serverSignature: t };
  }
  a(Ku, "parseServerFinalMessage");
  function ws(r, e) {
    if (!p.isBuffer(r)) throw new TypeError("first argument must be a Buffer");
    if (!p.isBuffer(e)) throw new TypeError(
      "second argument must be a Buffer"
    );
    if (r.length !== e.length) throw new Error("Buffer lengths must match");
    if (r.length === 0) throw new Error("Buffers cannot be empty");
    return p.from(r.map((t, n) => r[n] ^ e[n]));
  }
  a(ws, "xorBuffers");
  function Yu(r) {
    return pr.createHash("sha256").update(r).digest();
  }
  a(Yu, "sha256");
  function Oe(r, e) {
    return pr.createHmac("sha256", r).update(e).digest();
  }
  a(Oe, "hmacSha256");
  function Zu(r, e, t) {
    for (var n = Oe(
      r,
      p.concat([e, p.from([0, 0, 0, 1])])
    ), i = n, s = 0; s < t - 1; s++) n = Oe(r, n), i = ws(i, n);
    return i;
  }
  a(Zu, "Hi");
  bs.exports = { startSession: Hu, continueSession: $u, finalizeSession: Gu };
});
var yr = {};
se(yr, { join: () => Ju });
function Ju(...r) {
  return r.join("/");
}
var mr = V(() => {
  "use strict";
  h();
  a(
    Ju,
    "join"
  );
});
var gr = {};
se(gr, { stat: () => Xu });
function Xu(r, e) {
  e(new Error("No filesystem"));
}
var wr = V(() => {
  "use strict";
  h();
  a(Xu, "stat");
});
var br = {};
se(br, { default: () => ec });
var ec;
var xr = V(() => {
  "use strict";
  h();
  ec = {};
});
var vs = {};
se(vs, { StringDecoder: () => vr });
var Sr;
var vr;
var Ss = V(() => {
  "use strict";
  h();
  Sr = class Sr {
    constructor(e) {
      E(this, "td");
      this.td = new TextDecoder(e);
    }
    write(e) {
      return this.td.decode(e, { stream: true });
    }
    end(e) {
      return this.td.decode(e);
    }
  };
  a(Sr, "StringDecoder");
  vr = Sr;
});
var _s = T((Kh, Cs) => {
  "use strict";
  h();
  var { Transform: tc } = (xr(), O(br)), { StringDecoder: rc } = (Ss(), O(vs)), Se = Symbol(
    "last"
  ), It = Symbol("decoder");
  function nc(r, e, t) {
    let n;
    if (this.overflow) {
      if (n = this[It].write(r).split(
        this.matcher
      ), n.length === 1) return t();
      n.shift(), this.overflow = false;
    } else this[Se] += this[It].write(r), n = this[Se].split(this.matcher);
    this[Se] = n.pop();
    for (let i = 0; i < n.length; i++) try {
      As(this, this.mapper(n[i]));
    } catch (s) {
      return t(s);
    }
    if (this.overflow = this[Se].length > this.maxLength, this.overflow && !this.skipOverflow) {
      t(new Error(
        "maximum buffer reached"
      ));
      return;
    }
    t();
  }
  a(nc, "transform");
  function ic(r) {
    if (this[Se] += this[It].end(), this[Se])
      try {
        As(this, this.mapper(this[Se]));
      } catch (e) {
        return r(e);
      }
    r();
  }
  a(ic, "flush");
  function As(r, e) {
    e !== void 0 && r.push(e);
  }
  a(As, "push");
  function Es(r) {
    return r;
  }
  a(Es, "noop");
  function sc(r, e, t) {
    switch (r = r || /\r?\n/, e = e || Es, t = t || {}, arguments.length) {
      case 1:
        typeof r == "function" ? (e = r, r = /\r?\n/) : typeof r == "object" && !(r instanceof RegExp) && !r[Symbol.split] && (t = r, r = /\r?\n/);
        break;
      case 2:
        typeof r == "function" ? (t = e, e = r, r = /\r?\n/) : typeof e == "object" && (t = e, e = Es);
    }
    t = Object.assign({}, t), t.autoDestroy = true, t.transform = nc, t.flush = ic, t.readableObjectMode = true;
    let n = new tc(t);
    return n[Se] = "", n[It] = new rc("utf8"), n.matcher = r, n.mapper = e, n.maxLength = t.maxLength, n.skipOverflow = t.skipOverflow || false, n.overflow = false, n._destroy = function(i, s) {
      this._writableState.errorEmitted = false, s(i);
    }, n;
  }
  a(sc, "split");
  Cs.exports = sc;
});
var Ps = T((Jh, ye) => {
  "use strict";
  h();
  var Ts = (mr(), O(yr)), oc = (xr(), O(br)).Stream, ac = _s(), Is = (it(), O(nt)), uc = 5432, Pt = y.platform === "win32", st = y.stderr, cc = 56, lc = 7, fc = 61440, hc = 32768;
  function dc(r) {
    return (r & fc) == hc;
  }
  a(dc, "isRegFile");
  var Ue = ["host", "port", "database", "user", "password"], Er = Ue.length, pc = Ue[Er - 1];
  function Ar() {
    var r = st instanceof oc && st.writable === true;
    if (r) {
      var e = Array.prototype.slice.call(arguments).concat(`
`);
      st.write(Is.format.apply(Is, e));
    }
  }
  a(Ar, "warn");
  Object.defineProperty(ye.exports, "isWin", { get: a(function() {
    return Pt;
  }, "get"), set: a(function(r) {
    Pt = r;
  }, "set") });
  ye.exports.warnTo = function(r) {
    var e = st;
    return st = r, e;
  };
  ye.exports.getFileName = function(r) {
    var e = r || y.env, t = e.PGPASSFILE || (Pt ? Ts.join(e.APPDATA || "./", "postgresql", "pgpass.conf") : Ts.join(e.HOME || "./", ".pgpass"));
    return t;
  };
  ye.exports.usePgPass = function(r, e) {
    return Object.prototype.hasOwnProperty.call(y.env, "PGPASSWORD") ? false : Pt ? true : (e = e || "<unkn>", dc(r.mode) ? r.mode & (cc | lc) ? (Ar('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', e), false) : true : (Ar('WARNING: password file "%s" is not a plain file', e), false));
  };
  var yc = ye.exports.match = function(r, e) {
    return Ue.slice(0, -1).reduce(function(t, n, i) {
      return i == 1 && Number(r[n] || uc) === Number(
        e[n]
      ) ? t && true : t && (e[n] === "*" || e[n] === r[n]);
    }, true);
  };
  ye.exports.getPassword = function(r, e, t) {
    var n, i = e.pipe(
      ac()
    );
    function s(c) {
      var l = mc(c);
      l && gc(l) && yc(r, l) && (n = l[pc], i.end());
    }
    a(s, "onLine");
    var o = a(function() {
      e.destroy(), t(n);
    }, "onEnd"), u = a(function(c) {
      e.destroy(), Ar("WARNING: error on reading file: %s", c), t(
        void 0
      );
    }, "onErr");
    e.on("error", u), i.on("data", s).on("end", o).on("error", u);
  };
  var mc = ye.exports.parseLine = function(r) {
    if (r.length < 11 || r.match(/^\s+#/)) return null;
    for (var e = "", t = "", n = 0, i = 0, s = 0, o = {}, u = false, c = a(
      function(f, m, g) {
        var w = r.substring(m, g);
        Object.hasOwnProperty.call(y.env, "PGPASS_NO_DEESCAPE") || (w = w.replace(/\\([:\\])/g, "$1")), o[Ue[f]] = w;
      },
      "addToObj"
    ), l = 0; l < r.length - 1; l += 1) {
      if (e = r.charAt(l + 1), t = r.charAt(
        l
      ), u = n == Er - 1, u) {
        c(n, i);
        break;
      }
      l >= 0 && e == ":" && t !== "\\" && (c(n, i, l + 1), i = l + 2, n += 1);
    }
    return o = Object.keys(o).length === Er ? o : null, o;
  }, gc = ye.exports.isValidEntry = function(r) {
    for (var e = { 0: function(o) {
      return o.length > 0;
    }, 1: function(o) {
      return o === "*" ? true : (o = Number(o), isFinite(o) && o > 0 && o < 9007199254740992 && Math.floor(o) === o);
    }, 2: function(o) {
      return o.length > 0;
    }, 3: function(o) {
      return o.length > 0;
    }, 4: function(o) {
      return o.length > 0;
    } }, t = 0; t < Ue.length; t += 1) {
      var n = e[t], i = r[Ue[t]] || "", s = n(i);
      if (!s) return false;
    }
    return true;
  };
});
var Ls = T((rd, Cr) => {
  "use strict";
  h();
  var td = (mr(), O(yr)), Rs = (wr(), O(gr)), Rt = Ps();
  Cr.exports = function(r, e) {
    var t = Rt.getFileName();
    Rs.stat(t, function(n, i) {
      if (n || !Rt.usePgPass(i, t)) return e(void 0);
      var s = Rs.createReadStream(
        t
      );
      Rt.getPassword(r, s, e);
    });
  };
  Cr.exports.warnTo = Rt.warnTo;
});
var Bs = {};
se(Bs, { default: () => wc });
var wc;
var Fs = V(() => {
  "use strict";
  h();
  wc = {};
});
var Ms = {};
se(Ms, { parse: () => bc });
function bc(r, e = false) {
  let { protocol: t } = new URL(r), n = "http:" + r.substring(
    t.length
  ), { username: i, password: s, host: o, hostname: u, port: c, pathname: l, search: f, searchParams: m, hash: g } = new URL(
    n
  );
  s = decodeURIComponent(s), i = decodeURIComponent(i), l = decodeURIComponent(l);
  let w = i + ":" + s, S = e ? Object.fromEntries(m.entries()) : f;
  return {
    href: r,
    protocol: t,
    auth: w,
    username: i,
    password: s,
    host: o,
    hostname: u,
    port: c,
    pathname: l,
    search: f,
    query: S,
    hash: g
  };
}
var ks = V(() => {
  "use strict";
  h();
  a(bc, "parse");
});
var Ir = T((ad, Os) => {
  "use strict";
  h();
  var xc = (ks(), O(Ms)), _r = (wr(), O(gr));
  function Tr(r) {
    if (r.charAt(0) === "/") {
      var t = r.split(" ");
      return { host: t[0], database: t[1] };
    }
    var e = xc.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(r) ? encodeURI(r).replace(/\%25(\d\d)/g, "%$1") : r, true), t = e.query;
    for (var n in t) Array.isArray(t[n]) && (t[n] = t[n][t[n].length - 1]);
    var i = (e.auth || ":").split(":");
    if (t.user = i[0], t.password = i.splice(1).join(
      ":"
    ), t.port = e.port, e.protocol == "socket:") return t.host = decodeURI(e.pathname), t.database = e.query.db, t.client_encoding = e.query.encoding, t;
    t.host || (t.host = e.hostname);
    var s = e.pathname;
    if (!t.host && s && /^%2f/i.test(s)) {
      var o = s.split("/");
      t.host = decodeURIComponent(o[0]), s = o.splice(1).join("/");
    }
    switch (s && s.charAt(
      0
    ) === "/" && (s = s.slice(1) || null), t.database = s && decodeURI(s), (t.ssl === "true" || t.ssl === "1") && (t.ssl = true), t.ssl === "0" && (t.ssl = false), (t.sslcert || t.sslkey || t.sslrootcert || t.sslmode) && (t.ssl = {}), t.sslcert && (t.ssl.cert = _r.readFileSync(t.sslcert).toString()), t.sslkey && (t.ssl.key = _r.readFileSync(t.sslkey).toString()), t.sslrootcert && (t.ssl.ca = _r.readFileSync(t.sslrootcert).toString()), t.sslmode) {
      case "disable": {
        t.ssl = false;
        break;
      }
      case "prefer":
      case "require":
      case "verify-ca":
      case "verify-full":
        break;
      case "no-verify": {
        t.ssl.rejectUnauthorized = false;
        break;
      }
    }
    return t;
  }
  a(Tr, "parse");
  Os.exports = Tr;
  Tr.parse = Tr;
});
var Lt = T((ld, Ds) => {
  "use strict";
  h();
  var vc = (Fs(), O(Bs)), Qs = tt(), Us = Ir().parse, j = a(function(r, e, t) {
    return t === void 0 ? t = y.env["PG" + r.toUpperCase()] : t === false || (t = y.env[t]), e[r] || t || Qs[r];
  }, "val"), Sc = a(function() {
    switch (y.env.PGSSLMODE) {
      case "disable":
        return false;
      case "prefer":
      case "require":
      case "verify-ca":
      case "verify-full":
        return true;
      case "no-verify":
        return { rejectUnauthorized: false };
    }
    return Qs.ssl;
  }, "readSSLConfigFromEnvironment"), Qe = a(function(r) {
    return "'" + ("" + r).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
  }, "quoteParamValue"), te = a(function(r, e, t) {
    var n = e[t];
    n != null && r.push(t + "=" + Qe(n));
  }, "add"), Rr = class Rr {
    constructor(e) {
      e = typeof e == "string" ? Us(e) : e || {}, e.connectionString && (e = Object.assign({}, e, Us(e.connectionString))), this.user = j("user", e), this.database = j("database", e), this.database === void 0 && (this.database = this.user), this.port = parseInt(j("port", e), 10), this.host = j("host", e), Object.defineProperty(this, "password", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: j("password", e)
      }), this.binary = j("binary", e), this.options = j("options", e), this.ssl = typeof e.ssl > "u" ? Sc() : e.ssl, typeof this.ssl == "string" && this.ssl === "true" && (this.ssl = true), this.ssl === "no-verify" && (this.ssl = { rejectUnauthorized: false }), this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this.client_encoding = j("client_encoding", e), this.replication = j("replication", e), this.isDomainSocket = !(this.host || "").indexOf("/"), this.application_name = j("application_name", e, "PGAPPNAME"), this.fallback_application_name = j("fallback_application_name", e, false), this.statement_timeout = j("statement_timeout", e, false), this.lock_timeout = j("lock_timeout", e, false), this.idle_in_transaction_session_timeout = j("idle_in_transaction_session_timeout", e, false), this.query_timeout = j("query_timeout", e, false), e.connectionTimeoutMillis === void 0 ? this.connect_timeout = y.env.PGCONNECT_TIMEOUT || 0 : this.connect_timeout = Math.floor(e.connectionTimeoutMillis / 1e3), e.keepAlive === false ? this.keepalives = 0 : e.keepAlive === true && (this.keepalives = 1), typeof e.keepAliveInitialDelayMillis == "number" && (this.keepalives_idle = Math.floor(e.keepAliveInitialDelayMillis / 1e3));
    }
    getLibpqConnectionString(e) {
      var t = [];
      te(t, this, "user"), te(t, this, "password"), te(t, this, "port"), te(t, this, "application_name"), te(
        t,
        this,
        "fallback_application_name"
      ), te(t, this, "connect_timeout"), te(t, this, "options");
      var n = typeof this.ssl == "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
      if (te(t, n, "sslmode"), te(t, n, "sslca"), te(t, n, "sslkey"), te(t, n, "sslcert"), te(t, n, "sslrootcert"), this.database && t.push("dbname=" + Qe(this.database)), this.replication && t.push("replication=" + Qe(this.replication)), this.host && t.push("host=" + Qe(this.host)), this.isDomainSocket) return e(null, t.join(" "));
      this.client_encoding && t.push("client_encoding=" + Qe(this.client_encoding)), vc.lookup(this.host, function(i, s) {
        return i ? e(i, null) : (t.push("hostaddr=" + Qe(s)), e(null, t.join(" ")));
      });
    }
  };
  a(Rr, "ConnectionParameters");
  var Pr = Rr;
  Ds.exports = Pr;
});
var Ws = T((dd, Ns) => {
  "use strict";
  h();
  var Ec = Je(), qs = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/, Br = class Br {
    constructor(e, t) {
      this.command = null, this.rowCount = null, this.oid = null, this.rows = [], this.fields = [], this._parsers = void 0, this._types = t, this.RowCtor = null, this.rowAsArray = e === "array", this.rowAsArray && (this.parseRow = this._parseRowAsArray);
    }
    addCommandComplete(e) {
      var t;
      e.text ? t = qs.exec(e.text) : t = qs.exec(e.command), t && (this.command = t[1], t[3] ? (this.oid = parseInt(
        t[2],
        10
      ), this.rowCount = parseInt(t[3], 10)) : t[2] && (this.rowCount = parseInt(t[2], 10)));
    }
    _parseRowAsArray(e) {
      for (var t = new Array(
        e.length
      ), n = 0, i = e.length; n < i; n++) {
        var s = e[n];
        s !== null ? t[n] = this._parsers[n](s) : t[n] = null;
      }
      return t;
    }
    parseRow(e) {
      for (var t = {}, n = 0, i = e.length; n < i; n++) {
        var s = e[n], o = this.fields[n].name;
        s !== null ? t[o] = this._parsers[n](
          s
        ) : t[o] = null;
      }
      return t;
    }
    addRow(e) {
      this.rows.push(e);
    }
    addFields(e) {
      this.fields = e, this.fields.length && (this._parsers = new Array(e.length));
      for (var t = 0; t < e.length; t++) {
        var n = e[t];
        this._types ? this._parsers[t] = this._types.getTypeParser(n.dataTypeID, n.format || "text") : this._parsers[t] = Ec.getTypeParser(n.dataTypeID, n.format || "text");
      }
    }
  };
  a(Br, "Result");
  var Lr = Br;
  Ns.exports = Lr;
});
var Gs = T((md, $s) => {
  "use strict";
  h();
  var { EventEmitter: Ac } = ve(), js = Ws(), Hs = rt(), Mr = class Mr extends Ac {
    constructor(e, t, n) {
      super(), e = Hs.normalizeQueryConfig(e, t, n), this.text = e.text, this.values = e.values, this.rows = e.rows, this.types = e.types, this.name = e.name, this.binary = e.binary, this.portal = e.portal || "", this.callback = e.callback, this._rowMode = e.rowMode, y.domain && e.callback && (this.callback = y.domain.bind(e.callback)), this._result = new js(this._rowMode, this.types), this._results = this._result, this.isPreparedStatement = false, this._canceledDueToError = false, this._promise = null;
    }
    requiresPreparation() {
      return this.name || this.rows ? true : !this.text || !this.values ? false : this.values.length > 0;
    }
    _checkForMultirow() {
      this._result.command && (Array.isArray(this._results) || (this._results = [this._result]), this._result = new js(this._rowMode, this.types), this._results.push(this._result));
    }
    handleRowDescription(e) {
      this._checkForMultirow(), this._result.addFields(e.fields), this._accumulateRows = this.callback || !this.listeners("row").length;
    }
    handleDataRow(e) {
      let t;
      if (!this._canceledDueToError) {
        try {
          t = this._result.parseRow(
            e.fields
          );
        } catch (n) {
          this._canceledDueToError = n;
          return;
        }
        this.emit("row", t, this._result), this._accumulateRows && this._result.addRow(t);
      }
    }
    handleCommandComplete(e, t) {
      this._checkForMultirow(), this._result.addCommandComplete(
        e
      ), this.rows && t.sync();
    }
    handleEmptyQuery(e) {
      this.rows && e.sync();
    }
    handleError(e, t) {
      if (this._canceledDueToError && (e = this._canceledDueToError, this._canceledDueToError = false), this.callback) return this.callback(e);
      this.emit("error", e);
    }
    handleReadyForQuery(e) {
      if (this._canceledDueToError) return this.handleError(
        this._canceledDueToError,
        e
      );
      if (this.callback) try {
        this.callback(null, this._results);
      } catch (t) {
        y.nextTick(() => {
          throw t;
        });
      }
      this.emit(
        "end",
        this._results
      );
    }
    submit(e) {
      if (typeof this.text != "string" && typeof this.name != "string") return new Error(
        "A query must have either text or a name. Supplying neither is unsupported."
      );
      let t = e.parsedStatements[this.name];
      return this.text && t && this.text !== t ? new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`) : this.values && !Array.isArray(this.values) ? new Error("Query values must be an array") : (this.requiresPreparation() ? this.prepare(e) : e.query(this.text), null);
    }
    hasBeenParsed(e) {
      return this.name && e.parsedStatements[this.name];
    }
    handlePortalSuspended(e) {
      this._getRows(e, this.rows);
    }
    _getRows(e, t) {
      e.execute({ portal: this.portal, rows: t }), t ? e.flush() : e.sync();
    }
    prepare(e) {
      this.isPreparedStatement = true, this.hasBeenParsed(e) || e.parse({ text: this.text, name: this.name, types: this.types });
      try {
        e.bind({ portal: this.portal, statement: this.name, values: this.values, binary: this.binary, valueMapper: Hs.prepareValue });
      } catch (t) {
        this.handleError(t, e);
        return;
      }
      e.describe({ type: "P", name: this.portal || "" }), this._getRows(e, this.rows);
    }
    handleCopyInResponse(e) {
      e.sendCopyFail("No source stream defined");
    }
    handleCopyData(e, t) {
    }
  };
  a(Mr, "Query");
  var Fr = Mr;
  $s.exports = Fr;
});
var ln = T((_) => {
  "use strict";
  h();
  Object.defineProperty(_, "__esModule", { value: true });
  _.NoticeMessage = _.DataRowMessage = _.CommandCompleteMessage = _.ReadyForQueryMessage = _.NotificationResponseMessage = _.BackendKeyDataMessage = _.AuthenticationMD5Password = _.ParameterStatusMessage = _.ParameterDescriptionMessage = _.RowDescriptionMessage = _.Field = _.CopyResponse = _.CopyDataMessage = _.DatabaseError = _.copyDone = _.emptyQuery = _.replicationStart = _.portalSuspended = _.noData = _.closeComplete = _.bindComplete = _.parseComplete = void 0;
  _.parseComplete = { name: "parseComplete", length: 5 };
  _.bindComplete = { name: "bindComplete", length: 5 };
  _.closeComplete = { name: "closeComplete", length: 5 };
  _.noData = { name: "noData", length: 5 };
  _.portalSuspended = { name: "portalSuspended", length: 5 };
  _.replicationStart = { name: "replicationStart", length: 4 };
  _.emptyQuery = { name: "emptyQuery", length: 4 };
  _.copyDone = { name: "copyDone", length: 4 };
  var Kr = class Kr extends Error {
    constructor(e, t, n) {
      super(e), this.length = t, this.name = n;
    }
  };
  a(Kr, "DatabaseError");
  var kr = Kr;
  _.DatabaseError = kr;
  var Yr = class Yr {
    constructor(e, t) {
      this.length = e, this.chunk = t, this.name = "copyData";
    }
  };
  a(Yr, "CopyDataMessage");
  var Or = Yr;
  _.CopyDataMessage = Or;
  var Zr = class Zr {
    constructor(e, t, n, i) {
      this.length = e, this.name = t, this.binary = n, this.columnTypes = new Array(i);
    }
  };
  a(Zr, "CopyResponse");
  var Ur = Zr;
  _.CopyResponse = Ur;
  var Jr = class Jr {
    constructor(e, t, n, i, s, o, u) {
      this.name = e, this.tableID = t, this.columnID = n, this.dataTypeID = i, this.dataTypeSize = s, this.dataTypeModifier = o, this.format = u;
    }
  };
  a(Jr, "Field");
  var Qr = Jr;
  _.Field = Qr;
  var Xr = class Xr {
    constructor(e, t) {
      this.length = e, this.fieldCount = t, this.name = "rowDescription", this.fields = new Array(this.fieldCount);
    }
  };
  a(Xr, "RowDescriptionMessage");
  var Dr = Xr;
  _.RowDescriptionMessage = Dr;
  var en = class en {
    constructor(e, t) {
      this.length = e, this.parameterCount = t, this.name = "parameterDescription", this.dataTypeIDs = new Array(this.parameterCount);
    }
  };
  a(en, "ParameterDescriptionMessage");
  var qr = en;
  _.ParameterDescriptionMessage = qr;
  var tn = class tn {
    constructor(e, t, n) {
      this.length = e, this.parameterName = t, this.parameterValue = n, this.name = "parameterStatus";
    }
  };
  a(tn, "ParameterStatusMessage");
  var Nr = tn;
  _.ParameterStatusMessage = Nr;
  var rn = class rn {
    constructor(e, t) {
      this.length = e, this.salt = t, this.name = "authenticationMD5Password";
    }
  };
  a(rn, "AuthenticationMD5Password");
  var Wr = rn;
  _.AuthenticationMD5Password = Wr;
  var nn = class nn {
    constructor(e, t, n) {
      this.length = e, this.processID = t, this.secretKey = n, this.name = "backendKeyData";
    }
  };
  a(nn, "BackendKeyDataMessage");
  var jr = nn;
  _.BackendKeyDataMessage = jr;
  var sn = class sn {
    constructor(e, t, n, i) {
      this.length = e, this.processId = t, this.channel = n, this.payload = i, this.name = "notification";
    }
  };
  a(sn, "NotificationResponseMessage");
  var Hr = sn;
  _.NotificationResponseMessage = Hr;
  var on = class on {
    constructor(e, t) {
      this.length = e, this.status = t, this.name = "readyForQuery";
    }
  };
  a(on, "ReadyForQueryMessage");
  var $r = on;
  _.ReadyForQueryMessage = $r;
  var an = class an {
    constructor(e, t) {
      this.length = e, this.text = t, this.name = "commandComplete";
    }
  };
  a(an, "CommandCompleteMessage");
  var Gr = an;
  _.CommandCompleteMessage = Gr;
  var un = class un {
    constructor(e, t) {
      this.length = e, this.fields = t, this.name = "dataRow", this.fieldCount = t.length;
    }
  };
  a(un, "DataRowMessage");
  var Vr = un;
  _.DataRowMessage = Vr;
  var cn = class cn {
    constructor(e, t) {
      this.length = e, this.message = t, this.name = "notice";
    }
  };
  a(cn, "NoticeMessage");
  var zr = cn;
  _.NoticeMessage = zr;
});
var Vs = T((Bt) => {
  "use strict";
  h();
  Object.defineProperty(Bt, "__esModule", { value: true });
  Bt.Writer = void 0;
  var hn = class hn {
    constructor(e = 256) {
      this.size = e, this.offset = 5, this.headerPosition = 0, this.buffer = p.allocUnsafe(e);
    }
    ensure(e) {
      if (this.buffer.length - this.offset < e) {
        let n = this.buffer, i = n.length + (n.length >> 1) + e;
        this.buffer = p.allocUnsafe(i), n.copy(
          this.buffer
        );
      }
    }
    addInt32(e) {
      return this.ensure(4), this.buffer[this.offset++] = e >>> 24 & 255, this.buffer[this.offset++] = e >>> 16 & 255, this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
    }
    addInt16(e) {
      return this.ensure(2), this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
    }
    addCString(e) {
      if (!e) this.ensure(1);
      else {
        let t = p.byteLength(e);
        this.ensure(t + 1), this.buffer.write(e, this.offset, "utf-8"), this.offset += t;
      }
      return this.buffer[this.offset++] = 0, this;
    }
    addString(e = "") {
      let t = p.byteLength(e);
      return this.ensure(t), this.buffer.write(e, this.offset), this.offset += t, this;
    }
    addInt32PrefixedString(e) {
      let t = p.byteLength(e);
      this.ensure(4 + t);
      let n = this.buffer, i = this.offset;
      return n[i++] = t >>> 24 & 255, n[i++] = t >>> 16 & 255, n[i++] = t >>> 8 & 255, n[i++] = t >>> 0 & 255, n.write(e, i, "utf-8"), this.offset = i + t, this;
    }
    add(e) {
      return this.ensure(e.length), e.copy(this.buffer, this.offset), this.offset += e.length, this;
    }
    join(e) {
      if (e) {
        this.buffer[this.headerPosition] = e;
        let t = this.offset - (this.headerPosition + 1);
        this.buffer.writeInt32BE(t, this.headerPosition + 1);
      }
      return this.buffer.slice(e ? 0 : 5, this.offset);
    }
    flush(e) {
      let t = this.join(e);
      return this.offset = 5, this.headerPosition = 0, this.buffer = p.allocUnsafe(this.size), t;
    }
    clear() {
      this.offset = 5, this.headerPosition = 0;
    }
  };
  a(hn, "Writer");
  var fn = hn;
  Bt.Writer = fn;
});
var Ks = T((Mt) => {
  "use strict";
  h();
  Object.defineProperty(Mt, "__esModule", { value: true });
  Mt.serialize = void 0;
  var dn = Vs(), L = new dn.Writer(), Cc = a((r) => {
    L.addInt16(3).addInt16(0);
    for (let n of Object.keys(r)) L.addCString(
      n
    ).addCString(r[n]);
    L.addCString("client_encoding").addCString("UTF8");
    let e = L.addCString("").flush(), t = e.length + 4;
    return new dn.Writer().addInt32(t).add(e).flush();
  }, "startup"), _c = a(() => {
    let r = p.allocUnsafe(
      8
    );
    return r.writeInt32BE(8, 0), r.writeInt32BE(80877103, 4), r;
  }, "requestSsl"), Tc = a((r) => L.addCString(r).flush(
    112
  ), "password"), Ic = a(function(r, e) {
    return L.addCString(r).addInt32PrefixedString(e), L.flush(112);
  }, "sendSASLInitialResponseMessage"), Pc = a(function(r) {
    return L.addString(r).flush(112);
  }, "sendSCRAMClientFinalMessage"), Rc = a((r) => L.addCString(r).flush(81), "query"), zs = [], Lc = a((r) => {
    let e = r.name || "";
    e.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", e, e.length), console.error("This can cause conflicts and silent errors executing queries"));
    let t = r.types || zs, n = t.length, i = L.addCString(e).addCString(r.text).addInt16(n);
    for (let s = 0; s < n; s++) i.addInt32(t[s]);
    return L.flush(80);
  }, "parse"), De = new dn.Writer(), Bc = a(function(r, e) {
    for (let t = 0; t < r.length; t++) {
      let n = e ? e(r[t], t) : r[t];
      n == null ? (L.addInt16(0), De.addInt32(-1)) : n instanceof p ? (L.addInt16(
        1
      ), De.addInt32(n.length), De.add(n)) : (L.addInt16(0), De.addInt32PrefixedString(n));
    }
  }, "writeValues"), Fc = a(
    (r = {}) => {
      let e = r.portal || "", t = r.statement || "", n = r.binary || false, i = r.values || zs, s = i.length;
      L.addCString(
        e
      ).addCString(t), L.addInt16(s);
      try {
        Bc(i, r.valueMapper);
      } catch (o) {
        throw L.clear(), De.clear(), o;
      }
      return L.addInt16(s), L.add(De.flush()), L.addInt16(1), L.addInt16(n ? 1 : 0), L.flush(66);
    },
    "bind"
  ), Mc = p.from([
    69,
    0,
    0,
    0,
    9,
    0,
    0,
    0,
    0,
    0
  ]), kc = a((r) => {
    if (!r || !r.portal && !r.rows) return Mc;
    let e = r.portal || "", t = r.rows || 0, n = p.byteLength(
      e
    ), i = 4 + n + 1 + 4, s = p.allocUnsafe(1 + i);
    return s[0] = 69, s.writeInt32BE(i, 1), s.write(e, 5, "utf-8"), s[n + 5] = 0, s.writeUInt32BE(t, s.length - 4), s;
  }, "execute"), Oc = a((r, e) => {
    let t = p.allocUnsafe(16);
    return t.writeInt32BE(
      16,
      0
    ), t.writeInt16BE(1234, 4), t.writeInt16BE(5678, 6), t.writeInt32BE(r, 8), t.writeInt32BE(e, 12), t;
  }, "cancel"), pn = a((r, e) => {
    let n = 4 + p.byteLength(e) + 1, i = p.allocUnsafe(1 + n);
    return i[0] = r, i.writeInt32BE(n, 1), i.write(e, 5, "utf-8"), i[n] = 0, i;
  }, "cstringMessage"), Uc = L.addCString("P").flush(68), Qc = L.addCString("S").flush(68), Dc = a((r) => r.name ? pn(68, `${r.type}${r.name || ""}`) : r.type === "P" ? Uc : Qc, "describe"), qc = a((r) => {
    let e = `${r.type}${r.name || ""}`;
    return pn(67, e);
  }, "close"), Nc = a((r) => L.add(r).flush(100), "copyData"), Wc = a((r) => pn(
    102,
    r
  ), "copyFail"), Ft = a((r) => p.from([r, 0, 0, 0, 4]), "codeOnlyBuffer"), jc = Ft(72), Hc = Ft(83), $c = Ft(88), Gc = Ft(99), Vc = {
    startup: Cc,
    password: Tc,
    requestSsl: _c,
    sendSASLInitialResponseMessage: Ic,
    sendSCRAMClientFinalMessage: Pc,
    query: Rc,
    parse: Lc,
    bind: Fc,
    execute: kc,
    describe: Dc,
    close: qc,
    flush: a(() => jc, "flush"),
    sync: a(() => Hc, "sync"),
    end: a(() => $c, "end"),
    copyData: Nc,
    copyDone: a(() => Gc, "copyDone"),
    copyFail: Wc,
    cancel: Oc
  };
  Mt.serialize = Vc;
});
var Ys = T((kt) => {
  "use strict";
  h();
  Object.defineProperty(kt, "__esModule", { value: true });
  kt.BufferReader = void 0;
  var mn = class mn {
    constructor(e = 0) {
      this.offset = e, this.buffer = p.allocUnsafe(0), this.encoding = "utf-8";
    }
    setBuffer(e, t) {
      this.offset = e, this.buffer = t;
    }
    int16() {
      let e = this.buffer.readInt16BE(this.offset);
      return this.offset += 2, e;
    }
    byte() {
      let e = this.buffer[this.offset];
      return this.offset++, e;
    }
    int32() {
      let e = this.buffer.readInt32BE(
        this.offset
      );
      return this.offset += 4, e;
    }
    uint32() {
      let e = this.buffer.readUInt32BE(this.offset);
      return this.offset += 4, e;
    }
    string(e) {
      let t = this.buffer.toString(this.encoding, this.offset, this.offset + e);
      return this.offset += e, t;
    }
    cstring() {
      let e = this.offset, t = e;
      for (; this.buffer[t++]; ) ;
      return this.offset = t, this.buffer.toString(this.encoding, e, t - 1);
    }
    bytes(e) {
      let t = this.buffer.slice(this.offset, this.offset + e);
      return this.offset += e, t;
    }
  };
  a(mn, "BufferReader");
  var yn = mn;
  kt.BufferReader = yn;
});
var eo = T((Ot) => {
  "use strict";
  h();
  Object.defineProperty(Ot, "__esModule", { value: true });
  Ot.Parser = void 0;
  var F = ln(), zc = Ys(), wn = 1, Kc = 4, Zs = wn + Kc, Z = -1, gn = p.allocUnsafe(0), xn = class xn {
    constructor(e) {
      if (this.buffer = gn, this.bufferLength = 0, this.bufferOffset = 0, this.reader = new zc.BufferReader(), e?.mode === "binary") throw new Error(
        "Binary mode not supported yet"
      );
      this.mode = e?.mode || "text";
    }
    parse(e, t) {
      this.mergeBuffer(e);
      let n = this.bufferOffset + this.bufferLength, i = this.bufferOffset;
      for (; i + Zs <= n; ) {
        let s = this.buffer[i], o = this.buffer.readUInt32BE(i + wn), u = wn + o;
        if (u + i <= n) {
          let c = this.handlePacket(i + Zs, s, o, this.buffer);
          t(c), i += u;
        } else break;
      }
      i === n ? (this.buffer = gn, this.bufferLength = 0, this.bufferOffset = 0) : (this.bufferLength = n - i, this.bufferOffset = i);
    }
    mergeBuffer(e) {
      if (this.bufferLength > 0) {
        let t = this.bufferLength + e.byteLength;
        if (t + this.bufferOffset > this.buffer.byteLength) {
          let i;
          if (t <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) i = this.buffer;
          else {
            let s = this.buffer.byteLength * 2;
            for (; t >= s; ) s *= 2;
            i = p.allocUnsafe(s);
          }
          this.buffer.copy(i, 0, this.bufferOffset, this.bufferOffset + this.bufferLength), this.buffer = i, this.bufferOffset = 0;
        }
        e.copy(
          this.buffer,
          this.bufferOffset + this.bufferLength
        ), this.bufferLength = t;
      } else this.buffer = e, this.bufferOffset = 0, this.bufferLength = e.byteLength;
    }
    handlePacket(e, t, n, i) {
      let { reader: s } = this;
      s.setBuffer(e, i);
      let o;
      switch (t) {
        case 50:
          o = F.bindComplete;
          break;
        case 49:
          o = F.parseComplete;
          break;
        case 51:
          o = F.closeComplete;
          break;
        case 110:
          o = F.noData;
          break;
        case 115:
          o = F.portalSuspended;
          break;
        case 99:
          o = F.copyDone;
          break;
        case 87:
          o = F.replicationStart;
          break;
        case 73:
          o = F.emptyQuery;
          break;
        case 68:
          o = sl(s);
          break;
        case 67:
          o = Zc(s);
          break;
        case 90:
          o = Yc(s);
          break;
        case 65:
          o = tl(s);
          break;
        case 82:
          o = ul(s, n);
          break;
        case 83:
          o = ol(s);
          break;
        case 75:
          o = al(s);
          break;
        case 69:
          o = Js(s, "error");
          break;
        case 78:
          o = Js(s, "notice");
          break;
        case 84:
          o = rl(s);
          break;
        case 116:
          o = il(s);
          break;
        case 71:
          o = Xc(
            s
          );
          break;
        case 72:
          o = el(s);
          break;
        case 100:
          o = Jc(s, n);
          break;
        default:
          return new F.DatabaseError("received invalid response: " + t.toString(16), n, "error");
      }
      return s.setBuffer(0, gn), o.length = n, o;
    }
  };
  a(xn, "Parser");
  var bn = xn;
  Ot.Parser = bn;
  var Yc = a((r) => {
    let e = r.string(1);
    return new F.ReadyForQueryMessage(Z, e);
  }, "parseReadyForQueryMessage"), Zc = a((r) => {
    let e = r.cstring();
    return new F.CommandCompleteMessage(Z, e);
  }, "parseCommandCompleteMessage"), Jc = a((r, e) => {
    let t = r.bytes(e - 4);
    return new F.CopyDataMessage(Z, t);
  }, "parseCopyData"), Xc = a((r) => Xs(r, "copyInResponse"), "parseCopyInMessage"), el = a((r) => Xs(r, "copyOutResponse"), "parseCopyOutMessage"), Xs = a((r, e) => {
    let t = r.byte() !== 0, n = r.int16(), i = new F.CopyResponse(Z, e, t, n);
    for (let s = 0; s < n; s++) i.columnTypes[s] = r.int16();
    return i;
  }, "parseCopyMessage"), tl = a((r) => {
    let e = r.int32(), t = r.cstring(), n = r.cstring();
    return new F.NotificationResponseMessage(Z, e, t, n);
  }, "parseNotificationMessage"), rl = a((r) => {
    let e = r.int16(), t = new F.RowDescriptionMessage(Z, e);
    for (let n = 0; n < e; n++) t.fields[n] = nl(r);
    return t;
  }, "parseRowDescriptionMessage"), nl = a((r) => {
    let e = r.cstring(), t = r.uint32(), n = r.int16(), i = r.uint32(), s = r.int16(), o = r.int32(), u = r.int16() === 0 ? "text" : "binary";
    return new F.Field(e, t, n, i, s, o, u);
  }, "parseField"), il = a((r) => {
    let e = r.int16(), t = new F.ParameterDescriptionMessage(Z, e);
    for (let n = 0; n < e; n++) t.dataTypeIDs[n] = r.uint32();
    return t;
  }, "parseParameterDescriptionMessage"), sl = a((r) => {
    let e = r.int16(), t = new Array(e);
    for (let n = 0; n < e; n++) {
      let i = r.int32();
      t[n] = i === -1 ? null : r.string(i);
    }
    return new F.DataRowMessage(Z, t);
  }, "parseDataRowMessage"), ol = a((r) => {
    let e = r.cstring(), t = r.cstring();
    return new F.ParameterStatusMessage(Z, e, t);
  }, "parseParameterStatusMessage"), al = a((r) => {
    let e = r.int32(), t = r.int32();
    return new F.BackendKeyDataMessage(
      Z,
      e,
      t
    );
  }, "parseBackendKeyData"), ul = a((r, e) => {
    let t = r.int32(), n = { name: "authenticationOk", length: e };
    switch (t) {
      case 0:
        break;
      case 3:
        n.length === 8 && (n.name = "authenticationCleartextPassword");
        break;
      case 5:
        if (n.length === 12) {
          n.name = "authenticationMD5Password";
          let i = r.bytes(4);
          return new F.AuthenticationMD5Password(Z, i);
        }
        break;
      case 10:
        {
          n.name = "authenticationSASL", n.mechanisms = [];
          let i;
          do
            i = r.cstring(), i && n.mechanisms.push(i);
          while (i);
        }
        break;
      case 11:
        n.name = "authenticationSASLContinue", n.data = r.string(e - 8);
        break;
      case 12:
        n.name = "authenticationSASLFinal", n.data = r.string(e - 8);
        break;
      default:
        throw new Error("Unknown authenticationOk message type " + t);
    }
    return n;
  }, "parseAuthenticationResponse"), Js = a((r, e) => {
    let t = {}, n = r.string(1);
    for (; n !== "\0"; ) t[n] = r.cstring(), n = r.string(1);
    let i = t.M, s = e === "notice" ? new F.NoticeMessage(Z, i) : new F.DatabaseError(
      i,
      Z,
      e
    );
    return s.severity = t.S, s.code = t.C, s.detail = t.D, s.hint = t.H, s.position = t.P, s.internalPosition = t.p, s.internalQuery = t.q, s.where = t.W, s.schema = t.s, s.table = t.t, s.column = t.c, s.dataType = t.d, s.constraint = t.n, s.file = t.F, s.line = t.L, s.routine = t.R, s;
  }, "parseErrorMessage");
});
var vn = T((_e) => {
  "use strict";
  h();
  Object.defineProperty(_e, "__esModule", { value: true });
  _e.DatabaseError = _e.serialize = void 0;
  _e.parse = hl;
  var cl = ln();
  Object.defineProperty(_e, "DatabaseError", { enumerable: true, get: a(
    function() {
      return cl.DatabaseError;
    },
    "get"
  ) });
  var ll = Ks();
  Object.defineProperty(_e, "serialize", {
    enumerable: true,
    get: a(function() {
      return ll.serialize;
    }, "get")
  });
  var fl = eo();
  function hl(r, e) {
    let t = new fl.Parser();
    return r.on("data", (n) => t.parse(n, e)), new Promise((n) => r.on("end", () => n()));
  }
  a(hl, "parse");
});
var to = {};
se(to, { connect: () => dl });
function dl({ socket: r, servername: e }) {
  return r.startTls(e), r;
}
var ro = V(
  () => {
    "use strict";
    h();
    a(dl, "connect");
  }
);
var An = T((Dd, so) => {
  "use strict";
  h();
  var no = (Ge(), O(Ii)), pl = ve().EventEmitter, { parse: yl, serialize: Q } = vn(), io = Q.flush(), ml = Q.sync(), gl = Q.end(), En = class En extends pl {
    constructor(e) {
      super(), e = e || {}, this.stream = e.stream || new no.Socket(), this._keepAlive = e.keepAlive, this._keepAliveInitialDelayMillis = e.keepAliveInitialDelayMillis, this.lastBuffer = false, this.parsedStatements = {}, this.ssl = e.ssl || false, this._ending = false, this._emitMessage = false;
      var t = this;
      this.on("newListener", function(n) {
        n === "message" && (t._emitMessage = true);
      });
    }
    connect(e, t) {
      var n = this;
      this._connecting = true, this.stream.setNoDelay(true), this.stream.connect(e, t), this.stream.once("connect", function() {
        n._keepAlive && n.stream.setKeepAlive(true, n._keepAliveInitialDelayMillis), n.emit("connect");
      });
      let i = a(function(s) {
        n._ending && (s.code === "ECONNRESET" || s.code === "EPIPE") || n.emit("error", s);
      }, "reportStreamError");
      if (this.stream.on("error", i), this.stream.on("close", function() {
        n.emit("end");
      }), !this.ssl) return this.attachListeners(
        this.stream
      );
      this.stream.once("data", function(s) {
        var o = s.toString("utf8");
        switch (o) {
          case "S":
            break;
          case "N":
            return n.stream.end(), n.emit("error", new Error("The server does not support SSL connections"));
          default:
            return n.stream.end(), n.emit("error", new Error("There was an error establishing an SSL connection"));
        }
        var u = (ro(), O(to));
        let c = { socket: n.stream };
        n.ssl !== true && (Object.assign(c, n.ssl), "key" in n.ssl && (c.key = n.ssl.key)), no.isIP(t) === 0 && (c.servername = t);
        try {
          n.stream = u.connect(c);
        } catch (l) {
          return n.emit(
            "error",
            l
          );
        }
        n.attachListeners(n.stream), n.stream.on("error", i), n.emit("sslconnect");
      });
    }
    attachListeners(e) {
      e.on(
        "end",
        () => {
          this.emit("end");
        }
      ), yl(e, (t) => {
        var n = t.name === "error" ? "errorMessage" : t.name;
        this._emitMessage && this.emit("message", t), this.emit(n, t);
      });
    }
    requestSsl() {
      this.stream.write(Q.requestSsl());
    }
    startup(e) {
      this.stream.write(Q.startup(e));
    }
    cancel(e, t) {
      this._send(Q.cancel(e, t));
    }
    password(e) {
      this._send(Q.password(e));
    }
    sendSASLInitialResponseMessage(e, t) {
      this._send(Q.sendSASLInitialResponseMessage(e, t));
    }
    sendSCRAMClientFinalMessage(e) {
      this._send(Q.sendSCRAMClientFinalMessage(
        e
      ));
    }
    _send(e) {
      return this.stream.writable ? this.stream.write(e) : false;
    }
    query(e) {
      this._send(Q.query(e));
    }
    parse(e) {
      this._send(Q.parse(e));
    }
    bind(e) {
      this._send(Q.bind(e));
    }
    execute(e) {
      this._send(Q.execute(e));
    }
    flush() {
      this.stream.writable && this.stream.write(io);
    }
    sync() {
      this._ending = true, this._send(io), this._send(ml);
    }
    ref() {
      this.stream.ref();
    }
    unref() {
      this.stream.unref();
    }
    end() {
      if (this._ending = true, !this._connecting || !this.stream.writable) {
        this.stream.end();
        return;
      }
      return this.stream.write(gl, () => {
        this.stream.end();
      });
    }
    close(e) {
      this._send(Q.close(e));
    }
    describe(e) {
      this._send(Q.describe(e));
    }
    sendCopyFromChunk(e) {
      this._send(Q.copyData(e));
    }
    endCopyFrom() {
      this._send(Q.copyDone());
    }
    sendCopyFail(e) {
      this._send(Q.copyFail(e));
    }
  };
  a(En, "Connection");
  var Sn = En;
  so.exports = Sn;
});
var uo = T((jd, ao) => {
  "use strict";
  h();
  var wl = ve().EventEmitter, Wd = (it(), O(nt)), bl = rt(), Cn = xs(), xl = Ls(), vl = _t(), Sl = Lt(), oo = Gs(), El = tt(), Al = An(), _n = class _n extends wl {
    constructor(e) {
      super(), this.connectionParameters = new Sl(e), this.user = this.connectionParameters.user, this.database = this.connectionParameters.database, this.port = this.connectionParameters.port, this.host = this.connectionParameters.host, Object.defineProperty(
        this,
        "password",
        { configurable: true, enumerable: false, writable: true, value: this.connectionParameters.password }
      ), this.replication = this.connectionParameters.replication;
      var t = e || {};
      this._Promise = t.Promise || b.Promise, this._types = new vl(t.types), this._ending = false, this._connecting = false, this._connected = false, this._connectionError = false, this._queryable = true, this.connection = t.connection || new Al({ stream: t.stream, ssl: this.connectionParameters.ssl, keepAlive: t.keepAlive || false, keepAliveInitialDelayMillis: t.keepAliveInitialDelayMillis || 0, encoding: this.connectionParameters.client_encoding || "utf8" }), this.queryQueue = [], this.binary = t.binary || El.binary, this.processID = null, this.secretKey = null, this.ssl = this.connectionParameters.ssl || false, this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this._connectionTimeoutMillis = t.connectionTimeoutMillis || 0;
    }
    _errorAllQueries(e) {
      let t = a((n) => {
        y.nextTick(() => {
          n.handleError(e, this.connection);
        });
      }, "enqueueError");
      this.activeQuery && (t(this.activeQuery), this.activeQuery = null), this.queryQueue.forEach(t), this.queryQueue.length = 0;
    }
    _connect(e) {
      var t = this, n = this.connection;
      if (this._connectionCallback = e, this._connecting || this._connected) {
        let i = new Error("Client has already been connected. You cannot reuse a client.");
        y.nextTick(
          () => {
            e(i);
          }
        );
        return;
      }
      this._connecting = true, this.connectionTimeoutHandle, this._connectionTimeoutMillis > 0 && (this.connectionTimeoutHandle = setTimeout(() => {
        n._ending = true, n.stream.destroy(new Error("timeout expired"));
      }, this._connectionTimeoutMillis)), this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
        t.ssl ? n.requestSsl() : n.startup(t.getStartupConf());
      }), n.on("sslconnect", function() {
        n.startup(t.getStartupConf());
      }), this._attachListeners(
        n
      ), n.once("end", () => {
        let i = this._ending ? new Error("Connection terminated") : new Error("Connection terminated unexpectedly");
        clearTimeout(this.connectionTimeoutHandle), this._errorAllQueries(i), this._ending || (this._connecting && !this._connectionError ? this._connectionCallback ? this._connectionCallback(i) : this._handleErrorEvent(i) : this._connectionError || this._handleErrorEvent(i)), y.nextTick(() => {
          this.emit("end");
        });
      });
    }
    connect(e) {
      if (e) {
        this._connect(e);
        return;
      }
      return new this._Promise((t, n) => {
        this._connect((i) => {
          i ? n(i) : t();
        });
      });
    }
    _attachListeners(e) {
      e.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this)), e.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this)), e.on("authenticationSASL", this._handleAuthSASL.bind(this)), e.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this)), e.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this)), e.on("backendKeyData", this._handleBackendKeyData.bind(this)), e.on("error", this._handleErrorEvent.bind(this)), e.on("errorMessage", this._handleErrorMessage.bind(this)), e.on("readyForQuery", this._handleReadyForQuery.bind(this)), e.on("notice", this._handleNotice.bind(this)), e.on("rowDescription", this._handleRowDescription.bind(this)), e.on("dataRow", this._handleDataRow.bind(this)), e.on("portalSuspended", this._handlePortalSuspended.bind(
        this
      )), e.on("emptyQuery", this._handleEmptyQuery.bind(this)), e.on("commandComplete", this._handleCommandComplete.bind(this)), e.on("parseComplete", this._handleParseComplete.bind(this)), e.on("copyInResponse", this._handleCopyInResponse.bind(this)), e.on("copyData", this._handleCopyData.bind(this)), e.on("notification", this._handleNotification.bind(this));
    }
    _checkPgPass(e) {
      let t = this.connection;
      typeof this.password == "function" ? this._Promise.resolve().then(() => this.password()).then((n) => {
        if (n !== void 0) {
          if (typeof n != "string") {
            t.emit("error", new TypeError(
              "Password must be a string"
            ));
            return;
          }
          this.connectionParameters.password = this.password = n;
        } else this.connectionParameters.password = this.password = null;
        e();
      }).catch((n) => {
        t.emit("error", n);
      }) : this.password !== null ? e() : xl(
        this.connectionParameters,
        (n) => {
          n !== void 0 && (this.connectionParameters.password = this.password = n), e();
        }
      );
    }
    _handleAuthCleartextPassword(e) {
      this._checkPgPass(() => {
        this.connection.password(this.password);
      });
    }
    _handleAuthMD5Password(e) {
      this._checkPgPass(
        () => {
          let t = bl.postgresMd5PasswordHash(this.user, this.password, e.salt);
          this.connection.password(t);
        }
      );
    }
    _handleAuthSASL(e) {
      this._checkPgPass(() => {
        this.saslSession = Cn.startSession(e.mechanisms), this.connection.sendSASLInitialResponseMessage(
          this.saslSession.mechanism,
          this.saslSession.response
        );
      });
    }
    _handleAuthSASLContinue(e) {
      Cn.continueSession(
        this.saslSession,
        this.password,
        e.data
      ), this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
    }
    _handleAuthSASLFinal(e) {
      Cn.finalizeSession(this.saslSession, e.data), this.saslSession = null;
    }
    _handleBackendKeyData(e) {
      this.processID = e.processID, this.secretKey = e.secretKey;
    }
    _handleReadyForQuery(e) {
      this._connecting && (this._connecting = false, this._connected = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback && (this._connectionCallback(null, this), this._connectionCallback = null), this.emit("connect"));
      let { activeQuery: t } = this;
      this.activeQuery = null, this.readyForQuery = true, t && t.handleReadyForQuery(this.connection), this._pulseQueryQueue();
    }
    _handleErrorWhileConnecting(e) {
      if (!this._connectionError) {
        if (this._connectionError = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback) return this._connectionCallback(e);
        this.emit("error", e);
      }
    }
    _handleErrorEvent(e) {
      if (this._connecting) return this._handleErrorWhileConnecting(e);
      this._queryable = false, this._errorAllQueries(e), this.emit("error", e);
    }
    _handleErrorMessage(e) {
      if (this._connecting) return this._handleErrorWhileConnecting(e);
      let t = this.activeQuery;
      if (!t) {
        this._handleErrorEvent(e);
        return;
      }
      this.activeQuery = null, t.handleError(
        e,
        this.connection
      );
    }
    _handleRowDescription(e) {
      this.activeQuery.handleRowDescription(e);
    }
    _handleDataRow(e) {
      this.activeQuery.handleDataRow(e);
    }
    _handlePortalSuspended(e) {
      this.activeQuery.handlePortalSuspended(this.connection);
    }
    _handleEmptyQuery(e) {
      this.activeQuery.handleEmptyQuery(this.connection);
    }
    _handleCommandComplete(e) {
      this.activeQuery.handleCommandComplete(e, this.connection);
    }
    _handleParseComplete(e) {
      this.activeQuery.name && (this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text);
    }
    _handleCopyInResponse(e) {
      this.activeQuery.handleCopyInResponse(this.connection);
    }
    _handleCopyData(e) {
      this.activeQuery.handleCopyData(
        e,
        this.connection
      );
    }
    _handleNotification(e) {
      this.emit("notification", e);
    }
    _handleNotice(e) {
      this.emit("notice", e);
    }
    getStartupConf() {
      var e = this.connectionParameters, t = { user: e.user, database: e.database }, n = e.application_name || e.fallback_application_name;
      return n && (t.application_name = n), e.replication && (t.replication = "" + e.replication), e.statement_timeout && (t.statement_timeout = String(parseInt(e.statement_timeout, 10))), e.lock_timeout && (t.lock_timeout = String(parseInt(e.lock_timeout, 10))), e.idle_in_transaction_session_timeout && (t.idle_in_transaction_session_timeout = String(parseInt(e.idle_in_transaction_session_timeout, 10))), e.options && (t.options = e.options), t;
    }
    cancel(e, t) {
      if (e.activeQuery === t) {
        var n = this.connection;
        this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
          n.cancel(
            e.processID,
            e.secretKey
          );
        });
      } else e.queryQueue.indexOf(t) !== -1 && e.queryQueue.splice(e.queryQueue.indexOf(t), 1);
    }
    setTypeParser(e, t, n) {
      return this._types.setTypeParser(e, t, n);
    }
    getTypeParser(e, t) {
      return this._types.getTypeParser(e, t);
    }
    escapeIdentifier(e) {
      return '"' + e.replace(/"/g, '""') + '"';
    }
    escapeLiteral(e) {
      for (var t = false, n = "'", i = 0; i < e.length; i++) {
        var s = e[i];
        s === "'" ? n += s + s : s === "\\" ? (n += s + s, t = true) : n += s;
      }
      return n += "'", t === true && (n = " E" + n), n;
    }
    _pulseQueryQueue() {
      if (this.readyForQuery === true) if (this.activeQuery = this.queryQueue.shift(), this.activeQuery) {
        this.readyForQuery = false, this.hasExecuted = true;
        let e = this.activeQuery.submit(this.connection);
        e && y.nextTick(() => {
          this.activeQuery.handleError(e, this.connection), this.readyForQuery = true, this._pulseQueryQueue();
        });
      } else this.hasExecuted && (this.activeQuery = null, this.emit("drain"));
    }
    query(e, t, n) {
      var i, s, o, u, c;
      if (e == null) throw new TypeError(
        "Client was passed a null or undefined query"
      );
      return typeof e.submit == "function" ? (o = e.query_timeout || this.connectionParameters.query_timeout, s = i = e, typeof t == "function" && (i.callback = i.callback || t)) : (o = this.connectionParameters.query_timeout, i = new oo(e, t, n), i.callback || (s = new this._Promise((l, f) => {
        i.callback = (m, g) => m ? f(m) : l(g);
      }))), o && (c = i.callback, u = setTimeout(() => {
        var l = new Error("Query read timeout");
        y.nextTick(
          () => {
            i.handleError(l, this.connection);
          }
        ), c(l), i.callback = () => {
        };
        var f = this.queryQueue.indexOf(i);
        f > -1 && this.queryQueue.splice(f, 1), this._pulseQueryQueue();
      }, o), i.callback = (l, f) => {
        clearTimeout(u), c(l, f);
      }), this.binary && !i.binary && (i.binary = true), i._result && !i._result._types && (i._result._types = this._types), this._queryable ? this._ending ? (y.nextTick(() => {
        i.handleError(new Error("Client was closed and is not queryable"), this.connection);
      }), s) : (this.queryQueue.push(i), this._pulseQueryQueue(), s) : (y.nextTick(() => {
        i.handleError(new Error("Client has encountered a connection error and is not queryable"), this.connection);
      }), s);
    }
    ref() {
      this.connection.ref();
    }
    unref() {
      this.connection.unref();
    }
    end(e) {
      if (this._ending = true, !this.connection._connecting) if (e) e();
      else return this._Promise.resolve();
      if (this.activeQuery || !this._queryable ? this.connection.stream.destroy() : this.connection.end(), e) this.connection.once("end", e);
      else return new this._Promise((t) => {
        this.connection.once("end", t);
      });
    }
  };
  a(_n, "Client");
  var Ut = _n;
  Ut.Query = oo;
  ao.exports = Ut;
});
var fo = T((Gd, lo) => {
  "use strict";
  h();
  var Cl = ve().EventEmitter, Tn = a(function() {
  }, "NOOP"), co = a((r, e) => {
    let t = r.findIndex(e);
    return t === -1 ? void 0 : r.splice(t, 1)[0];
  }, "removeWhere"), Rn = class Rn {
    constructor(e, t, n) {
      this.client = e, this.idleListener = t, this.timeoutId = n;
    }
  };
  a(Rn, "IdleItem");
  var In = Rn, Ln = class Ln {
    constructor(e) {
      this.callback = e;
    }
  };
  a(Ln, "PendingItem");
  var qe = Ln;
  function _l() {
    throw new Error("Release called on client which has already been released to the pool.");
  }
  a(_l, "throwOnDoubleRelease");
  function Qt(r, e) {
    if (e)
      return { callback: e, result: void 0 };
    let t, n, i = a(function(o, u) {
      o ? t(o) : n(u);
    }, "cb"), s = new r(function(o, u) {
      n = o, t = u;
    }).catch((o) => {
      throw Error.captureStackTrace(o), o;
    });
    return { callback: i, result: s };
  }
  a(Qt, "promisify");
  function Tl(r, e) {
    return a(function t(n) {
      n.client = e, e.removeListener("error", t), e.on("error", () => {
        r.log(
          "additional client error after disconnection due to error",
          n
        );
      }), r._remove(e), r.emit("error", n, e);
    }, "idleListener");
  }
  a(Tl, "makeIdleListener");
  var Bn = class Bn extends Cl {
    constructor(e, t) {
      super(), this.options = Object.assign({}, e), e != null && "password" in e && Object.defineProperty(this.options, "password", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: e.password
      }), e != null && e.ssl && e.ssl.key && Object.defineProperty(this.options.ssl, "key", { enumerable: false }), this.options.max = this.options.max || this.options.poolSize || 10, this.options.min = this.options.min || 0, this.options.maxUses = this.options.maxUses || 1 / 0, this.options.allowExitOnIdle = this.options.allowExitOnIdle || false, this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0, this.log = this.options.log || function() {
      }, this.Client = this.options.Client || t || ot().Client, this.Promise = this.options.Promise || b.Promise, typeof this.options.idleTimeoutMillis > "u" && (this.options.idleTimeoutMillis = 1e4), this._clients = [], this._idle = [], this._expired = /* @__PURE__ */ new WeakSet(), this._pendingQueue = [], this._endCallback = void 0, this.ending = false, this.ended = false;
    }
    _promiseTry(e) {
      let t = this.Promise;
      return typeof t.try == "function" ? t.try(e) : new t((n) => n(e()));
    }
    _isFull() {
      return this._clients.length >= this.options.max;
    }
    _isAboveMin() {
      return this._clients.length > this.options.min;
    }
    _pulseQueue() {
      if (this.log("pulse queue"), this.ended) {
        this.log("pulse queue ended");
        return;
      }
      if (this.ending) {
        this.log("pulse queue on ending"), this._idle.length && this._idle.slice().map((t) => {
          this._remove(t.client);
        }), this._clients.length || (this.ended = true, this._endCallback());
        return;
      }
      if (!this._pendingQueue.length) {
        this.log("no queued requests");
        return;
      }
      if (!this._idle.length && this._isFull())
        return;
      let e = this._pendingQueue.shift();
      if (this._idle.length) {
        let t = this._idle.pop();
        clearTimeout(t.timeoutId);
        let n = t.client;
        n.ref && n.ref();
        let i = t.idleListener;
        return this._acquireClient(n, e, i, false);
      }
      if (!this._isFull()) return this.newClient(e);
      throw new Error("unexpected condition");
    }
    _remove(e, t) {
      let n = co(this._idle, (s) => s.client === e);
      n !== void 0 && clearTimeout(n.timeoutId), this._clients = this._clients.filter((s) => s !== e);
      let i = this;
      e.end(() => {
        i.emit("remove", e), typeof t == "function" && t();
      });
    }
    connect(e) {
      if (this.ending) {
        let i = new Error(
          "Cannot use a pool after calling end on the pool"
        );
        return e ? e(i) : this.Promise.reject(i);
      }
      let t = Qt(this.Promise, e), n = t.result;
      if (this._isFull() || this._idle.length) {
        if (this._idle.length && y.nextTick(() => this._pulseQueue()), !this.options.connectionTimeoutMillis) return this._pendingQueue.push(new qe(t.callback)), n;
        let i = a((u, c, l) => {
          clearTimeout(o), t.callback(u, c, l);
        }, "queueCallback"), s = new qe(i), o = setTimeout(() => {
          co(this._pendingQueue, (u) => u.callback === i), s.timedOut = true, t.callback(new Error("timeout exceeded when trying to connect"));
        }, this.options.connectionTimeoutMillis);
        return o.unref && o.unref(), this._pendingQueue.push(s), n;
      }
      return this.newClient(new qe(t.callback)), n;
    }
    newClient(e) {
      let t = new this.Client(this.options);
      this._clients.push(t);
      let n = Tl(this, t);
      this.log("checking client timeout");
      let i, s = false;
      this.options.connectionTimeoutMillis && (i = setTimeout(() => {
        t.connection ? (this.log("ending client due to timeout"), s = true, t.connection.stream.destroy()) : t.isConnected() || (this.log("ending client due to timeout"), s = true, t.end());
      }, this.options.connectionTimeoutMillis)), this.log("connecting new client"), t.connect((o) => {
        if (i && clearTimeout(i), t.on("error", n), o) this.log("client failed to connect", o), this._clients = this._clients.filter((u) => u !== t), s && (o = new Error("Connection terminated due to connection timeout", { cause: o })), this._pulseQueue(), e.timedOut || e.callback(
          o,
          void 0,
          Tn
        );
        else {
          if (this.log("new client connected"), this.options.onConnect) {
            this._promiseTry(() => this.options.onConnect(t)).then(() => {
              this._afterConnect(t, e, n);
            }, (u) => {
              this._clients = this._clients.filter((c) => c !== t), t.end(() => {
                this._pulseQueue(), e.timedOut || e.callback(u, void 0, Tn);
              });
            });
            return;
          }
          return this._afterConnect(
            t,
            e,
            n
          );
        }
      });
    }
    _afterConnect(e, t, n) {
      if (this.options.maxLifetimeSeconds !== 0) {
        let i = setTimeout(() => {
          this.log(
            "ending client due to expired lifetime"
          ), this._expired.add(e), this._idle.findIndex((o) => o.client === e) !== -1 && this._acquireClient(e, new qe((o, u, c) => c()), n, false);
        }, this.options.maxLifetimeSeconds * 1e3);
        i.unref(), e.once("end", () => clearTimeout(i));
      }
      return this._acquireClient(e, t, n, true);
    }
    _acquireClient(e, t, n, i) {
      i && this.emit("connect", e), this.emit("acquire", e), e.release = this._releaseOnce(e, n), e.removeListener("error", n), t.timedOut ? i && this.options.verify ? this.options.verify(e, e.release) : e.release() : i && this.options.verify ? this.options.verify(e, (s) => {
        if (s) return e.release(s), t.callback(s, void 0, Tn);
        t.callback(void 0, e, e.release);
      }) : t.callback(void 0, e, e.release);
    }
    _releaseOnce(e, t) {
      let n = false;
      return (i) => {
        n && _l(), n = true, this._release(
          e,
          t,
          i
        );
      };
    }
    _release(e, t, n) {
      if (e.on("error", t), e._poolUseCount = (e._poolUseCount || 0) + 1, this.emit(
        "release",
        n,
        e
      ), n || this.ending || !e._queryable || e._ending || e._poolUseCount >= this.options.maxUses) return e._poolUseCount >= this.options.maxUses && this.log("remove expended client"), this._remove(e, this._pulseQueue.bind(this));
      if (this._expired.has(e)) return this.log("remove expired client"), this._expired.delete(e), this._remove(
        e,
        this._pulseQueue.bind(this)
      );
      let s;
      this.options.idleTimeoutMillis && this._isAboveMin() && (s = setTimeout(
        () => {
          this._isAboveMin() && (this.log("remove idle client"), this._remove(e, this._pulseQueue.bind(this)));
        },
        this.options.idleTimeoutMillis
      ), this.options.allowExitOnIdle && s.unref()), this.options.allowExitOnIdle && e.unref(), this._idle.push(new In(e, t, s)), this._pulseQueue();
    }
    query(e, t, n) {
      if (typeof e == "function") {
        let s = Qt(
          this.Promise,
          e
        );
        return x(function() {
          return s.callback(new Error("Passing a function as the first parameter to pool.query is not supported"));
        }), s.result;
      }
      typeof t == "function" && (n = t, t = void 0);
      let i = Qt(this.Promise, n);
      return n = i.callback, this.connect((s, o) => {
        if (s) return n(s);
        let u = false, c = a((l) => {
          u || (u = true, o.release(
            l
          ), n(l));
        }, "onError");
        o.once("error", c), this.log("dispatching query");
        try {
          o.query(e, t, (l, f) => {
            if (this.log("query dispatched"), o.removeListener("error", c), !u) return u = true, o.release(l), l ? n(l) : n(void 0, f);
          });
        } catch (l) {
          return o.release(l), n(l);
        }
      }), i.result;
    }
    end(e) {
      if (this.log("ending"), this.ending) {
        let n = new Error("Called end on pool more than once");
        return e ? e(n) : this.Promise.reject(n);
      }
      this.ending = true;
      let t = Qt(
        this.Promise,
        e
      );
      return this._endCallback = t.callback, this._pulseQueue(), t.result;
    }
    get waitingCount() {
      return this._pendingQueue.length;
    }
    get idleCount() {
      return this._idle.length;
    }
    get expiredCount() {
      return this._clients.reduce((e, t) => e + (this._expired.has(t) ? 1 : 0), 0);
    }
    get totalCount() {
      return this._clients.length;
    }
  };
  a(Bn, "Pool");
  var Pn = Bn;
  lo.exports = Pn;
});
var ho = {};
se(ho, { default: () => Il });
var Il;
var po = V(() => {
  "use strict";
  h();
  Il = {};
});
var yo = T((Yd, Pl) => {
  Pl.exports = { name: "pg", version: "8.8.0", description: "PostgreSQL client - pure javascript & libpq with the same API", keywords: [
    "database",
    "libpq",
    "pg",
    "postgre",
    "postgres",
    "postgresql",
    "rdbms"
  ], homepage: "https://github.com/brianc/node-postgres", repository: { type: "git", url: "git://github.com/brianc/node-postgres.git", directory: "packages/pg" }, author: "Brian Carlson <brian.m.carlson@gmail.com>", main: "./lib", dependencies: { "buffer-writer": "2.0.0", "packet-reader": "1.0.0", "pg-connection-string": "^2.5.0", "pg-pool": "^3.5.2", "pg-protocol": "^1.5.0", "pg-types": "^2.1.0", pgpass: "1.x" }, devDependencies: {
    async: "2.6.4",
    bluebird: "3.5.2",
    co: "4.6.0",
    "pg-copy-streams": "0.3.0"
  }, peerDependencies: { "pg-native": ">=3.0.1" }, peerDependenciesMeta: { "pg-native": { optional: true } }, scripts: { test: "make test-all" }, files: ["lib", "SPONSORS.md"], license: "MIT", engines: { node: ">= 8.0.0" }, gitHead: "c99fb2c127ddf8d712500db2c7b9a5491a178655" };
});
var wo = T((Zd, go) => {
  "use strict";
  h();
  var mo = ve().EventEmitter, Rl = (it(), O(nt)), Fn = rt(), Ne = go.exports = function(r, e, t) {
    mo.call(this), r = Fn.normalizeQueryConfig(r, e, t), this.text = r.text, this.values = r.values, this.name = r.name, this.callback = r.callback, this.state = "new", this._arrayMode = r.rowMode === "array", this._emitRowEvents = false, this.on("newListener", function(n) {
      n === "row" && (this._emitRowEvents = true);
    }.bind(this));
  };
  Rl.inherits(Ne, mo);
  var Ll = { sqlState: "code", statementPosition: "position", messagePrimary: "message", context: "where", schemaName: "schema", tableName: "table", columnName: "column", dataTypeName: "dataType", constraintName: "constraint", sourceFile: "file", sourceLine: "line", sourceFunction: "routine" };
  Ne.prototype.handleError = function(r) {
    var e = this.native.pq.resultErrorFields();
    if (e) for (var t in e) {
      var n = Ll[t] || t;
      r[n] = e[t];
    }
    this.callback ? this.callback(r) : this.emit("error", r), this.state = "error";
  };
  Ne.prototype.then = function(r, e) {
    return this._getPromise().then(
      r,
      e
    );
  };
  Ne.prototype.catch = function(r) {
    return this._getPromise().catch(r);
  };
  Ne.prototype._getPromise = function() {
    return this._promise ? this._promise : (this._promise = new Promise(function(r, e) {
      this._once("end", r), this._once("error", e);
    }.bind(this)), this._promise);
  };
  Ne.prototype.submit = function(r) {
    this.state = "running";
    var e = this;
    this.native = r.native, r.native.arrayMode = this._arrayMode;
    var t = a(function(s, o, u) {
      if (r.native.arrayMode = false, x(function() {
        e.emit("_done");
      }), s) return e.handleError(s);
      e._emitRowEvents && (u.length > 1 ? o.forEach(
        (c, l) => {
          c.forEach((f) => {
            e.emit("row", f, u[l]);
          });
        }
      ) : o.forEach(function(c) {
        e.emit("row", c, u);
      })), e.state = "end", e.emit("end", u), e.callback && e.callback(null, u);
    }, "after");
    if (y.domain && (t = y.domain.bind(t)), this.name) {
      this.name.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", this.name, this.name.length), console.error("This can cause conflicts and silent errors executing queries"));
      var n = (this.values || []).map(Fn.prepareValue);
      if (r.namedQueries[this.name]) {
        if (this.text && r.namedQueries[this.name] !== this.text) {
          let s = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
          return t(s);
        }
        return r.native.execute(this.name, n, t);
      }
      return r.native.prepare(this.name, this.text, n.length, function(s) {
        return s ? t(s) : (r.namedQueries[e.name] = e.text, e.native.execute(e.name, n, t));
      });
    } else if (this.values) {
      if (!Array.isArray(
        this.values
      )) {
        let s = new Error("Query values must be an array");
        return t(s);
      }
      var i = this.values.map(Fn.prepareValue);
      r.native.query(this.text, i, t);
    } else r.native.query(this.text, t);
  };
});
var So = T((tp, vo) => {
  "use strict";
  h();
  var Bl = (po(), O(ho)), Fl = _t(), ep = yo(), bo = ve().EventEmitter, Ml = (it(), O(nt)), kl = Lt(), xo = wo(), Y = vo.exports = function(r) {
    bo.call(this), r = r || {}, this._Promise = r.Promise || b.Promise, this._types = new Fl(r.types), this.native = new Bl({ types: this._types }), this._queryQueue = [], this._ending = false, this._connecting = false, this._connected = false, this._queryable = true;
    var e = this.connectionParameters = new kl(r);
    this.user = e.user, Object.defineProperty(this, "password", { configurable: true, enumerable: false, writable: true, value: e.password }), this.database = e.database, this.host = e.host, this.port = e.port, this.namedQueries = {};
  };
  Y.Query = xo;
  Ml.inherits(Y, bo);
  Y.prototype._errorAllQueries = function(r) {
    let e = a((t) => {
      y.nextTick(() => {
        t.native = this.native, t.handleError(r);
      });
    }, "enqueueError");
    this._hasActiveQuery() && (e(this._activeQuery), this._activeQuery = null), this._queryQueue.forEach(e), this._queryQueue.length = 0;
  };
  Y.prototype._connect = function(r) {
    var e = this;
    if (this._connecting) {
      y.nextTick(() => r(new Error("Client has already been connected. You cannot reuse a client.")));
      return;
    }
    this._connecting = true, this.connectionParameters.getLibpqConnectionString(function(t, n) {
      if (t) return r(t);
      e.native.connect(n, function(i) {
        if (i) return e.native.end(), r(i);
        e._connected = true, e.native.on("error", function(s) {
          e._queryable = false, e._errorAllQueries(s), e.emit("error", s);
        }), e.native.on("notification", function(s) {
          e.emit("notification", { channel: s.relname, payload: s.extra });
        }), e.emit("connect"), e._pulseQueryQueue(true), r();
      });
    });
  };
  Y.prototype.connect = function(r) {
    if (r) {
      this._connect(r);
      return;
    }
    return new this._Promise((e, t) => {
      this._connect((n) => {
        n ? t(n) : e();
      });
    });
  };
  Y.prototype.query = function(r, e, t) {
    var n, i, s, o, u;
    if (r == null) throw new TypeError("Client was passed a null or undefined query");
    if (typeof r.submit == "function") s = r.query_timeout || this.connectionParameters.query_timeout, i = n = r, typeof e == "function" && (r.callback = e);
    else if (s = this.connectionParameters.query_timeout, n = new xo(r, e, t), !n.callback) {
      let c, l;
      i = new this._Promise((f, m) => {
        c = f, l = m;
      }), n.callback = (f, m) => f ? l(f) : c(m);
    }
    return s && (u = n.callback, o = setTimeout(() => {
      var c = new Error(
        "Query read timeout"
      );
      y.nextTick(() => {
        n.handleError(c, this.connection);
      }), u(c), n.callback = () => {
      };
      var l = this._queryQueue.indexOf(n);
      l > -1 && this._queryQueue.splice(l, 1), this._pulseQueryQueue();
    }, s), n.callback = (c, l) => {
      clearTimeout(o), u(c, l);
    }), this._queryable ? this._ending ? (n.native = this.native, y.nextTick(() => {
      n.handleError(
        new Error("Client was closed and is not queryable")
      );
    }), i) : (this._queryQueue.push(n), this._pulseQueryQueue(), i) : (n.native = this.native, y.nextTick(() => {
      n.handleError(new Error("Client has encountered a connection error and is not queryable"));
    }), i);
  };
  Y.prototype.end = function(r) {
    var e = this;
    this._ending = true, this._connected || this.once("connect", this.end.bind(this, r));
    var t;
    return r || (t = new this._Promise(function(n, i) {
      r = a((s) => s ? i(s) : n(), "cb");
    })), this.native.end(function() {
      e._errorAllQueries(new Error("Connection terminated")), y.nextTick(() => {
        e.emit("end"), r && r();
      });
    }), t;
  };
  Y.prototype._hasActiveQuery = function() {
    return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
  };
  Y.prototype._pulseQueryQueue = function(r) {
    if (this._connected && !this._hasActiveQuery()) {
      var e = this._queryQueue.shift();
      if (!e) {
        r || this.emit("drain");
        return;
      }
      this._activeQuery = e, e.submit(this);
      var t = this;
      e.once("_done", function() {
        t._pulseQueryQueue();
      });
    }
  };
  Y.prototype.cancel = function(r) {
    this._activeQuery === r ? this.native.cancel(function() {
    }) : this._queryQueue.indexOf(r) !== -1 && this._queryQueue.splice(this._queryQueue.indexOf(r), 1);
  };
  Y.prototype.ref = function() {
  };
  Y.prototype.unref = function() {
  };
  Y.prototype.setTypeParser = function(r, e, t) {
    return this._types.setTypeParser(
      r,
      e,
      t
    );
  };
  Y.prototype.getTypeParser = function(r, e) {
    return this._types.getTypeParser(r, e);
  };
});
var Mn = T((ip, Eo) => {
  "use strict";
  h();
  Eo.exports = So();
});
var ot = T((op, at) => {
  "use strict";
  h();
  var Ol = uo(), Ul = tt(), Ql = An(), Dl = fo(), { DatabaseError: ql } = vn(), Nl = a(
    (r) => {
      var e;
      return e = class extends Dl {
        constructor(n) {
          super(n, r);
        }
      }, a(e, "BoundPool"), e;
    },
    "poolFactory"
  ), kn = a(
    function(r) {
      this.defaults = Ul, this.Client = r, this.Query = this.Client.Query, this.Pool = Nl(this.Client), this._pools = [], this.Connection = Ql, this.types = Je(), this.DatabaseError = ql;
    },
    "PG"
  );
  typeof y.env.NODE_PG_FORCE_NATIVE < "u" ? at.exports = new kn(Mn()) : (at.exports = new kn(Ol), Object.defineProperty(at.exports, "native", {
    configurable: true,
    enumerable: false,
    get() {
      var r = null;
      try {
        r = new kn(Mn());
      } catch (e) {
        if (e.code !== "MODULE_NOT_FOUND") throw e;
      }
      return Object.defineProperty(at.exports, "native", { value: r }), r;
    }
  }));
});
h();
h();
h();
var da = Object.defineProperty;
var pa = Object.defineProperties;
var ya = Object.getOwnPropertyDescriptors;
var ai = Object.getOwnPropertySymbols;
var ma = Object.prototype.hasOwnProperty;
var ga = Object.prototype.propertyIsEnumerable;
var ui = a(
  (r, e, t) => e in r ? da(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t,
  "__defNormalProp"
);
var wa = a((r, e) => {
  for (var t in e || (e = {})) ma.call(e, t) && ui(r, t, e[t]);
  if (ai) for (var t of ai(e)) ga.call(e, t) && ui(r, t, e[t]);
  return r;
}, "__spreadValues");
var ba = a((r, e) => pa(r, ya(e)), "__spreadProps");
var xa = 1008e3;
var ci = new Uint8Array(
  new Uint16Array([258]).buffer
)[0] === 2;
var va = new TextDecoder();
var Yt = new TextEncoder();
var dt = Yt.encode("0123456789abcdef");
var pt = Yt.encode("0123456789ABCDEF");
var Sa = Yt.encode("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
var li = Sa.slice();
li[62] = 45;
li[63] = 95;
var je;
var yt;
function Ea(r, { alphabet: e, scratchArr: t } = {}) {
  if (!je) if (je = new Uint16Array(256), yt = new Uint16Array(256), ci) for (let S = 0; S < 256; S++) je[S] = dt[S & 15] << 8 | dt[S >>> 4], yt[S] = pt[S & 15] << 8 | pt[S >>> 4];
  else for (let S = 0; S < 256; S++) je[S] = dt[S & 15] | dt[S >>> 4] << 8, yt[S] = pt[S & 15] | pt[S >>> 4] << 8;
  r.byteOffset % 4 !== 0 && (r = new Uint8Array(r));
  let n = r.length, i = n >>> 1, s = n >>> 2, o = t || new Uint16Array(n), u = new Uint32Array(
    r.buffer,
    r.byteOffset,
    s
  ), c = new Uint32Array(o.buffer, o.byteOffset, i), l = e === "upper" ? yt : je, f = 0, m = 0, g;
  if (ci)
    for (; f < s; ) g = u[f++], c[m++] = l[g >>> 8 & 255] << 16 | l[g & 255], c[m++] = l[g >>> 24] << 16 | l[g >>> 16 & 255];
  else for (; f < s; )
    g = u[f++], c[m++] = l[g >>> 24] << 16 | l[g >>> 16 & 255], c[m++] = l[g >>> 8 & 255] << 16 | l[g & 255];
  for (f <<= 2; f < n; ) o[f] = l[r[f++]];
  return va.decode(o.subarray(0, n));
}
a(Ea, "_toHex");
function Aa(r, e = {}) {
  let t = "", n = r.length, i = xa >>> 1, s = Math.ceil(n / i), o = new Uint16Array(s > 1 ? i : n), u = ba(wa({}, e), { scratchArr: o });
  for (let c = 0; c < s; c++) {
    let l = c * i, f = l + i;
    t += Ea(r.subarray(l, f), u);
  }
  return t;
}
a(Aa, "_toHexChunked");
function fi(r, e = {}) {
  return e.alphabet !== "upper" && typeof r.toHex == "function" ? r.toHex() : Aa(r, e);
}
a(fi, "toHex");
h();
h();
var Zt = class Zt2 {
  constructor(e, t, n) {
    E(this, "execute", e);
    E(this, "queryData", t);
    E(this, "opts", n);
  }
  then(e, t) {
    return this.execute(this.queryData, this.opts).then(e, t);
  }
  catch(e) {
    return this.execute(
      this.queryData,
      this.opts
    ).catch(e);
  }
  finally(e) {
    return this.execute(this.queryData, this.opts).finally(e);
  }
};
a(Zt, "NeonQueryPromise");
var xe = Zt;
var mt = class mt2 {
  constructor(e, t) {
    E(this, "strings", e);
    E(this, "values", t);
  }
  toParameterizedQuery(e = {
    query: "",
    params: []
  }) {
    let { strings: t, values: n } = this;
    for (let i = 0, s = t.length; i < s; i++) if (e.query += t[i], i < n.length) {
      let o = n[i];
      if (o instanceof $e) e.query += o.sql;
      else if (o instanceof xe) if (o.queryData instanceof mt2) o.queryData.toParameterizedQuery(e);
      else {
        if (o.queryData.params?.length) throw new Error("This query is not composable");
        e.query += o.queryData.query;
      }
      else {
        let { params: u } = e;
        u.push(o), e.query += "$" + u.length, (o instanceof p || ArrayBuffer.isView(o)) && (e.query += "::bytea");
      }
    }
    return e;
  }
};
a(mt, "SqlTemplate");
var He = mt;
var Jt = class Jt2 {
  constructor(e) {
    E(this, "sql", e);
  }
};
a(Jt, "UnsafeRawSql");
var $e = Jt;
h();
function gt2() {
  typeof window < "u" && typeof document < "u" && typeof console < "u" && typeof console.warn == "function" && console.warn(`          
        ************************************************************
        *                                                          *
        *  WARNING: Running SQL directly from the browser can have *
        *  security implications. Even if your database is         *
        *  protected by Row-Level Security (RLS), use it at your   *
        *  own risk. This approach is great for fast prototyping,  *
        *  but ensure proper safeguards are in place to prevent    *
        *  misuse or execution of expensive SQL queries by your    *
        *  end users.                                              *
        *                                                          *
        *  If you've assessed the risks, suppress this message     *
        *  using the disableWarningInBrowsers configuration        *
        *  parameter.                                              *
        *                                                          *
        ************************************************************`);
}
a(gt2, "warnIfBrowser");
h();
h();
var wt = class wt2 extends Error {
  constructor(t) {
    super(t);
    E(this, "name", "NeonDbError");
    E(this, "severity");
    E(this, "code");
    E(this, "detail");
    E(this, "hint");
    E(this, "position");
    E(this, "internalPosition");
    E(
      this,
      "internalQuery"
    );
    E(this, "where");
    E(this, "schema");
    E(this, "table");
    E(this, "column");
    E(this, "dataType");
    E(this, "constraint");
    E(this, "file");
    E(this, "line");
    E(this, "routine");
    E(this, "sourceError");
    "captureStackTrace" in Error && typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, wt2);
  }
};
a(
  wt,
  "NeonDbError"
);
var N = wt;
var hi = ["severity", "code", "detail", "hint", "position", "internalPosition", "internalQuery", "where", "schema", "table", "column", "dataType", "constraint", "file", "line", "routine"];
function di(r, e) {
  let t, n;
  try {
    t = new URL(r).protocol, n = new URL("http:" + r.slice(t.length));
  } catch {
    throw new N(
      `Database connection string provided to neon() is not a valid URL (connection string: ${r})`
    );
  }
  let {
    username: i,
    hostname: s,
    pathname: o
  } = n;
  if (t !== "postgres:" && t !== "postgresql:" || e && (!i || !s || s === "-" || !o || o === "/")) throw new N(
    "Wrong URL scheme or missing user, host or database in connection parameters"
  );
  return n;
}
a(di, "URLFromPgConnectionString");
function Ca(r) {
  return "postgresql:" + r.href.slice(r.protocol.length);
}
a(Ca, "pgConnectionStringFromURL");
var _a = ["connectionString", "user", "username", "password", "host", "hostname", "port", "database"];
var Ta = { database: "pathname", user: "username", host: "hostname" };
function pi(...r) {
  let e = {};
  for (let t of r) e = t.connectionString !== void 0 ? t : { ...e, ...t };
  return e;
}
a(pi, "mergeConnectionParams");
async function yi(r = "postgresql://-", e = {}, t = {}) {
  if (e.connectionString !== void 0 && (r = e.connectionString), typeof r == "function" && (r = await r()), typeof r != "string") throw new N("Connection string must be a string or a function resolving to one");
  if (e.user !== void 0 && e.username !== void 0) throw new N("Please specify one only of user and username");
  if (e.host !== void 0 && e.hostname !== void 0) throw new N("Please specify one only of host and hostname");
  let n = di(r, false);
  await Promise.all(_a.map(async (u) => {
    if (u === "connectionString") return;
    let c = e[u];
    if (typeof c == "function" && (c = await c()), c === void 0) return;
    if (typeof c != "string" && !(u === "port" && typeof c == "number")) {
      let f = u === "port" ? " or a number" : "";
      throw new N(`Connection parameter "${u}" must be a string${f} or a function resolving to one`);
    }
    let l = Ta[u] ?? u;
    n[l] = c;
  }));
  let { searchParams: i } = n;
  for (let u in t) i.has(u) || i.append(u, t[u]);
  let s = Ca(n), o = di(s, true);
  return { resolvedConnectionString: s, resolvedURL: o };
}
a(yi, "resolveConnectionParams");
Ge();
h();
var vt = "pkg:npm/%40neondatabase/serverless@1.2.0";
var ds = we(_t());
var ps = we(rt());
var ls = "transaction() expects an array of queries, or a function returning an array of queries";
function Nu(r) {
  return r instanceof p ? "\\x" + fi(r) : r;
}
a(Nu, "encodeBuffersAsBytea");
function fs(r) {
  let { query: e, params: t } = r instanceof He ? r.toParameterizedQuery() : r;
  return { query: e, params: t.map((n) => Nu((0, ps.prepareValue)(n))) };
}
a(fs, "prepareQuery");
function ys(r, e = {}) {
  typeof r != "string" && (e = r ?? {}, r = void 0);
  let {
    arrayMode: t,
    fullResults: n,
    fetchOptions: i,
    isolationLevel: s,
    readOnly: o,
    deferrable: u,
    authToken: c,
    disableWarningInBrowsers: l
  } = e;
  function f(g, ...w) {
    if (!(Array.isArray(g) && Array.isArray(g.raw) && Array.isArray(w))) throw new Error('This function can now be called only as a tagged-template function: sql`SELECT ${value}`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).');
    return new xe(m, new He(g, w));
  }
  a(f, "templateFn"), f.query = (g, w, S) => new xe(
    m,
    { query: g, params: w ?? [] },
    S
  ), f.unsafe = (g) => new $e(g), f.transaction = async (g, w) => {
    if (typeof g == "function" && (g = g(f)), !Array.isArray(g)) throw new Error(ls);
    g.forEach((D) => {
      if (!(D instanceof xe)) throw new Error(ls);
    });
    let S = g.map((D) => D.queryData), k = g.map((D) => D.opts ?? {});
    return m(S, k, w);
  };
  async function m(g, w, S) {
    let {
      fetchEndpoint: k,
      fetchFunction: D
    } = pe, he = Array.isArray(g) ? { queries: g.map((G) => fs(G)) } : fs(g), I = i ?? {}, C = t ?? false, re = n ?? false, ne2 = s, H = o, oe = u;
    S !== void 0 && (S.fetchOptions !== void 0 && (I = { ...I, ...S.fetchOptions }), S.arrayMode !== void 0 && (C = S.arrayMode), S.fullResults !== void 0 && (re = S.fullResults), S.isolationLevel !== void 0 && (ne2 = S.isolationLevel), S.readOnly !== void 0 && (H = S.readOnly), S.deferrable !== void 0 && (oe = S.deferrable)), w !== void 0 && !Array.isArray(
      w
    ) && w.fetchOptions !== void 0 && (I = { ...I, ...w.fetchOptions });
    let ae = c;
    !Array.isArray(w) && w?.authToken !== void 0 && (ae = w.authToken);
    let me = pi(e, S ?? {}, Array.isArray(w) || !w ? {} : w), { resolvedConnectionString: R, resolvedURL: $ } = await yi(
      r,
      me,
      { application_name: vt }
    ), Ee = typeof k == "function" ? k($.hostname, $.port, { jwtAuth: ae !== void 0 }) : k, ue = {
      "Neon-Connection-String": R,
      "Neon-Raw-Text-Output": "true",
      "Neon-Array-Mode": "true"
    }, Te = await Wu(ae);
    Te && (ue.Authorization = `Bearer ${Te}`), Array.isArray(g) && (ne2 !== void 0 && (ue["Neon-Batch-Isolation-Level"] = ne2), H !== void 0 && (ue["Neon-Batch-Read-Only"] = String(H)), oe !== void 0 && (ue["Neon-Batch-Deferrable"] = String(
      oe
    ))), l || pe.disableWarningInBrowsers || gt2();
    let ce;
    try {
      ce = await (D ?? fetch)(Ee, { method: "POST", body: JSON.stringify(he), headers: ue, ...I });
    } catch (G) {
      let q = new N(`Error connecting to database: ${G}`);
      throw q.sourceError = G, q;
    }
    if (ce.ok) {
      let G = await ce.json();
      if (Array.isArray(g)) {
        let q = G.results;
        if (!Array.isArray(q)) throw new N(
          "Neon internal error: unexpected result format"
        );
        return q.map((ge, J) => {
          let ie = w[J] ?? {}, Dt = ie.arrayMode ?? C, Io = ie.fullResults ?? re;
          return hs(ge, { arrayMode: Dt, fullResults: Io, types: ie.types });
        });
      } else {
        let q = w ?? {}, ge = q.arrayMode ?? C, J = q.fullResults ?? re;
        return hs(G, { arrayMode: ge, fullResults: J, types: q.types });
      }
    } else {
      let { status: G } = ce;
      if (G === 400) {
        let q = await ce.json(), ge = new N(q.message);
        for (let J of hi) ge[J] = q[J] ?? void 0;
        throw ge;
      } else {
        let q = await ce.text();
        throw new N(`Server error (HTTP status ${G}): ${q}`);
      }
    }
  }
  return a(
    m,
    "execute"
  ), f;
}
a(ys, "neon");
function hs(r, { arrayMode: e, fullResults: t, types: n }) {
  let i = new ds.default(
    n
  ), s = r.fields.map((c) => c.name), o = r.fields.map((c) => i.getTypeParser(c.dataTypeID)), u = e === true ? r.rows.map((c) => c.map((l, f) => l === null ? null : o[f](l))) : r.rows.map((c) => Object.fromEntries(c.map((l, f) => [s[f], l === null ? null : o[f](l)])));
  return t ? (r.viaNeonFetch = true, r.rowAsArray = e, r.rows = u, r._parsers = o, r._types = i, r) : u;
}
a(hs, "processQueryResult");
async function Wu(r) {
  if (typeof r == "string") return r;
  if (typeof r == "function") try {
    return await Promise.resolve(r());
  } catch (e) {
    let t = new N("Error getting auth token.");
    throw e instanceof Error && (t = new N(`Error getting auth token: ${e.message}`)), t;
  }
}
a(Wu, "getAuthToken");
h();
h();
var Co = we(ot());
h();
var Ao = we(ot());
var On = class On2 extends Ao.Client {
  constructor(t) {
    let n = typeof t == "string" ? { connectionString: t } : {
      ...t,
      ...t && "password" in t ? { password: t.password } : {}
    };
    super({ fallback_application_name: vt, ...n });
    E(this, "config", t);
  }
  get neonConfig() {
    return this.connection.stream;
  }
  connect(t) {
    let { neonConfig: n } = this;
    n.forceDisablePgSSL && (this.ssl = this.connection.ssl = false), this.ssl && n.useSecureWebSocket && console.warn("SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true.");
    let i = typeof this.config != "string" && this.config?.host !== void 0 || typeof this.config != "string" && this.config?.connectionString !== void 0 || y.env.PGHOST !== void 0, s = y.env.USER ?? y.env.USERNAME;
    if (!i && this.host === "localhost" && this.user === s && this.database === s && this.password === null) throw new Error(`No database host or connection string was set, and key parameters have default values (host: localhost, user: ${s}, db: ${s}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`);
    let o = super.connect(
      t
    ), u = n.pipelineTLS && this.ssl, c = n.pipelineConnect === "password";
    if (!u && !n.pipelineConnect) return o;
    let l = this.connection;
    if (u && l.on("connect", () => l.stream.emit("data", "S")), c) {
      l.removeAllListeners("authenticationCleartextPassword"), l.removeAllListeners("readyForQuery"), l.once("readyForQuery", () => l.on("readyForQuery", this._handleReadyForQuery.bind(this)));
      let f = this.password, m = Promise.resolve(typeof f == "function" ? f() : f), g = this.ssl ? "sslconnect" : "connect";
      l.on(g, () => {
        this.neonConfig.disableWarningInBrowsers || gt2(), m.then((w) => {
          this.password = w, this._handleAuthCleartextPassword(), this._handleReadyForQuery();
        }).catch(
          (w) => l.emit("error", w)
        );
      });
    }
    return o;
  }
  async _handleAuthSASLContinue(t) {
    if (typeof crypto > "u" || crypto.subtle === void 0 || crypto.subtle.importKey === void 0) throw new Error("Cannot use SASL auth when `crypto.subtle` is not defined");
    let n = crypto.subtle, i = this.saslSession, s = this.password, o = t.data;
    if (i.message !== "SASLInitialResponse" || typeof s != "string" || typeof o != "string") throw new Error("SASL: protocol error");
    let u = Object.fromEntries(o.split(",").map((J) => {
      if (!/^.=/.test(J)) throw new Error("SASL: Invalid attribute pair entry");
      let ie = J[0], Dt = J.substring(2);
      return [ie, Dt];
    })), c = u.r, l = u.s, f = u.i;
    if (!c || !/^[!-+--~]+$/.test(c))
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable");
    if (!l || !/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(l)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64");
    if (!f || !/^[1-9][0-9]*$/.test(f)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count");
    if (!c.startsWith(
      i.clientNonce
    )) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
    if (c.length === i.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
    let m = parseInt(f, 10), g = p.from(l, "base64"), w = new TextEncoder(), S = w.encode(s), k = await n.importKey("raw", S, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]), D = new Uint8Array(await n.sign("HMAC", k, p.concat([g, p.from([0, 0, 0, 1])]))), he = D;
    for (var I = 0; I < m - 1; I++) D = new Uint8Array(await n.sign("HMAC", k, D)), he = p.from(he.map((J, ie) => he[ie] ^ D[ie]));
    let C = he, re = await n.importKey("raw", C, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]), ne2 = new Uint8Array(await n.sign("HMAC", re, w.encode("Client Key"))), H = await n.digest("SHA-256", ne2), oe = "n=*,r=" + i.clientNonce, ae = "r=" + c + ",s=" + l + ",i=" + m, me = "c=biws,r=" + c, R = oe + "," + ae + "," + me, $ = await n.importKey("raw", H, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
    var Ee = new Uint8Array(await n.sign("HMAC", $, w.encode(R))), ue = p.from(ne2.map((J, ie) => ne2[ie] ^ Ee[ie])), Te = ue.toString("base64");
    let ce = await n.importKey("raw", C, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]), G = await n.sign("HMAC", ce, w.encode("Server Key")), q = await n.importKey("raw", G, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
    var ge = p.from(await n.sign("HMAC", q, w.encode(R)));
    i.message = "SASLResponse", i.serverSignature = ge.toString("base64"), i.response = me + ",p=" + Te, this.connection.sendSCRAMClientFinalMessage(
      this.saslSession.response
    );
  }
};
a(On, "NeonClient");
var ut = On;
Ge();
var _o = we(Lt());
function Wl(r, e) {
  if (e) return { callback: e, result: void 0 };
  let t, n, i = a(function(o, u) {
    o ? t(o) : n(u);
  }, "cb"), s = new r(function(o, u) {
    n = o, t = u;
  });
  return { callback: i, result: s };
}
a(Wl, "promisify");
var Qn = class Qn2 extends Co.Pool {
  constructor() {
    super(...arguments);
    E(this, "Client", ut);
    E(this, "hasFetchUnsupportedListeners", false);
    E(this, "addListener", this.on);
  }
  on(t, n) {
    return t !== "error" && (this.hasFetchUnsupportedListeners = true), super.on(t, n);
  }
  query(t, n, i) {
    if (!pe.poolQueryViaFetch || this.hasFetchUnsupportedListeners || typeof t == "function") return super.query(
      t,
      n,
      i
    );
    typeof n == "function" && (i = n, n = void 0);
    let s = Wl(this.Promise, i);
    i = s.callback;
    try {
      let o = new _o.default(
        this.options
      ), u = encodeURIComponent, c = encodeURI, l = `postgresql://${u(o.user)}:${u(o.password)}@${u(o.host)}/${c(o.database)}`, f = typeof t == "string" ? t : t.text, m = n ?? t.values ?? [];
      ys(l, { fullResults: true, arrayMode: t.rowMode === "array" }).query(f, m, { types: t.types ?? this.options?.types }).then((w) => i(void 0, w)).catch((w) => i(
        w
      ));
    } catch (o) {
      i(o);
    }
    return s.result;
  }
};
a(Qn, "NeonPool");
Ge();
var ct = we(ot());
h();
var To = we(Ir());
function jl(r) {
  return Object.entries(r).reduce((t, [n, i]) => (i != null && (t[n] = i), t), /* @__PURE__ */ Object.create(null));
}
a(jl, "toConnectionOptions");
function Hl(r) {
  return Object.entries(r).reduce((t, [n, i]) => {
    if (n === "ssl") {
      let s = i;
      typeof s == "boolean" && (t[n] = s), typeof s == "object" && (t[n] = jl(s));
    } else if (i != null) if (n === "port") {
      if (i !== "") {
        let s = parseInt(i, 10);
        if (isNaN(s)) throw new Error(`Invalid ${n}: ${i}`);
        t[n] = s;
      }
    } else t[n] = i;
    return t;
  }, /* @__PURE__ */ Object.create(null));
}
a(Hl, "toClientConfig");
function $l(r) {
  return Hl((0, To.parse)(r));
}
a(
  $l,
  "parseIntoClientConfig"
);
var export_DatabaseError = ct.DatabaseError;
var export_defaults = ct.defaults;
var export_escapeIdentifier = ct.escapeIdentifier;
var export_escapeLiteral = ct.escapeLiteral;
var export_types = ct.types;

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler = class _SelectionProxyHandler {
  static [entityKind] = "SelectionProxyHandler";
  config;
  constructor(config) {
    this.config = { ...config };
  }
  get(subquery, prop) {
    if (prop === "_") {
      return {
        ...subquery["_"],
        selectedFields: new Proxy(
          subquery._.selectedFields,
          this
        )
      };
    }
    if (prop === ViewBaseConfig) {
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(
          subquery[ViewBaseConfig].selectedFields,
          this
        )
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if (is(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if (is(value, SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(
        `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    if (is(value, Column)) {
      if (this.config.alias) {
        return new Proxy(
          value,
          new ColumnAliasProxyHandler(
            new Proxy(
              value.table,
              new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
            )
          )
        );
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new _SelectionProxyHandler(this.config));
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/query-builders/delete.js
var PgDeleteBase = class extends QueryPromise {
  constructor(table, session, dialect, withList) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, withList };
  }
  static [entityKind] = "PgDelete";
  config;
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * await db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * await db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * await db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields = this.config.table[Table.Symbol.Columns]) {
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true);
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
  /** @internal */
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(
      this.config.returningFields,
      new SelectionProxyHandler({
        alias: getTableName(this.config.table),
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      })
    ) : void 0;
  }
  $dynamic() {
    return this;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.reduce((acc, word, i) => {
    const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
    return acc + formattedWord;
  }, "");
}
function noopCase(input) {
  return input;
}
var CasingCache = class {
  static [entityKind] = "CasingCache";
  /** @internal */
  cache = {};
  cachedTables = {};
  convert;
  constructor(casing) {
    this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
  }
  getColumnCasing(column) {
    if (!column.keyAsName)
      return column.name;
    const schema = column.table[Table.Symbol.Schema] ?? "public";
    const tableName = column.table[Table.Symbol.OriginalName];
    const key = `${schema}.${tableName}.${column.name}`;
    if (!this.cache[key]) {
      this.cacheTable(column.table);
    }
    return this.cache[key];
  }
  cacheTable(table) {
    const schema = table[Table.Symbol.Schema] ?? "public";
    const tableName = table[Table.Symbol.OriginalName];
    const tableKey = `${schema}.${tableName}`;
    if (!this.cachedTables[tableKey]) {
      for (const column of Object.values(table[Table.Symbol.Columns])) {
        const columnKey = `${tableKey}.${column.name}`;
        this.cache[columnKey] = this.convert(column.name);
      }
      this.cachedTables[tableKey] = true;
    }
  }
  clearCache() {
    this.cache = {};
    this.cachedTables = {};
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/view-base.js
var PgViewBase = class extends View {
  static [entityKind] = "PgViewBase";
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/dialect.js
var PgDialect = class {
  static [entityKind] = "PgDialect";
  /** @internal */
  casing;
  constructor(config) {
    this.casing = new CasingCache(config?.casing);
  }
  async migrate(migrations, session, config) {
    const migrationsTable = typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
    const migrationsSchema = typeof config === "string" ? "drizzle" : config.migrationsSchema ?? "drizzle";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at bigint
			)
		`;
    await session.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(migrationsSchema)}`);
    await session.execute(migrationTableCreate);
    const dbMigrations = await session.all(
      sql`select id, hash, created_at from ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} order by created_at desc limit 1`
    );
    const lastDbMigration = dbMigrations[0];
    await session.transaction(async (tx) => {
      for await (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.execute(sql.raw(stmt));
          }
          await tx.execute(
            sql`insert into ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
    });
  }
  escapeName(name) {
    return `"${name}"`;
  }
  escapeParam(num) {
    return `$${num + 1}`;
  }
  escapeString(str2) {
    return `'${str2.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!queries?.length)
      return void 0;
    const withSqlChunks = [sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1) {
        withSqlChunks.push(sql`, `);
      }
    }
    withSqlChunks.push(sql` `);
    return sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table, where, returning, withList }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`${withSql}delete from ${table}${whereSql}${returningSql}`;
  }
  buildUpdateSet(table, set) {
    const tableColumns = table[Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter(
      (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
    );
    const setSize = columnNames.length;
    return sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const value = set[colName] ?? sql.param(col.onUpdateFn(), col);
      const res = sql`${sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
      if (i < setSize - 1) {
        return [res, sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning, withList, from, joins }) {
    const withSql = this.buildWithCTE(withList);
    const tableName = table[PgTable.Symbol.Name];
    const tableSchema = table[PgTable.Symbol.Schema];
    const origTableName = table[PgTable.Symbol.OriginalName];
    const alias = tableName === origTableName ? void 0 : tableName;
    const tableSql = sql`${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}`;
    const setSql = this.buildUpdateSet(table, set);
    const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
    const joinsSql = this.buildJoins(joins);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: !from })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`${withSql}update ${tableSql} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if (is(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is(field, SQL.Aliased) || is(field, SQL)) {
        const query = is(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(
            new SQL(
              query.queryChunks.map((c) => {
                if (is(c, PgColumn)) {
                  return sql.identifier(this.casing.getColumnCasing(c));
                }
                return c;
              })
            )
          );
        } else {
          chunk.push(query);
        }
        if (is(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is(field, Column)) {
        if (isSingleTable) {
          chunk.push(sql.identifier(this.casing.getColumnCasing(field)));
        } else {
          chunk.push(field);
        }
      }
      if (i < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.join(chunks);
  }
  buildJoins(joins) {
    if (!joins || joins.length === 0) {
      return void 0;
    }
    const joinsArray = [];
    for (const [index2, joinMeta] of joins.entries()) {
      if (index2 === 0) {
        joinsArray.push(sql` `);
      }
      const table = joinMeta.table;
      const lateralSql = joinMeta.lateral ? sql` lateral` : void 0;
      if (is(table, PgTable)) {
        const tableName = table[PgTable.Symbol.Name];
        const tableSchema = table[PgTable.Symbol.Schema];
        const origTableName = table[PgTable.Symbol.OriginalName];
        const alias = tableName === origTableName ? void 0 : joinMeta.alias;
        joinsArray.push(
          sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`
        );
      } else if (is(table, View)) {
        const viewName = table[ViewBaseConfig].name;
        const viewSchema = table[ViewBaseConfig].schema;
        const origViewName = table[ViewBaseConfig].originalName;
        const alias = viewName === origViewName ? void 0 : joinMeta.alias;
        joinsArray.push(
          sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${viewSchema ? sql`${sql.identifier(viewSchema)}.` : void 0}${sql.identifier(origViewName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`
        );
      } else {
        joinsArray.push(
          sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${table} on ${joinMeta.on}`
        );
      }
      if (index2 < joins.length - 1) {
        joinsArray.push(sql` `);
      }
    }
    return sql.join(joinsArray);
  }
  buildFromTable(table) {
    if (is(table, Table) && table[Table.Symbol.IsAlias]) {
      let fullName = sql`${sql.identifier(table[Table.Symbol.OriginalName])}`;
      if (table[Table.Symbol.Schema]) {
        fullName = sql`${sql.identifier(table[Table.Symbol.Schema])}.${fullName}`;
      }
      return sql`${fullName} ${sql.identifier(table[Table.Symbol.Name])}`;
    }
    return table;
  }
  buildSelectQuery({
    withList,
    fields,
    fieldsFlat,
    where,
    having,
    table,
    joins,
    orderBy,
    groupBy,
    limit,
    offset,
    lockingClause,
    distinct,
    setOperators
  }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f of fieldsList) {
      if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, PgViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins?.some(
        ({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])
      ))(f.field.table)) {
        const tableName = getTableName(f.field.table);
        throw new Error(
          `Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
        );
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    let distinctSql;
    if (distinct) {
      distinctSql = distinct === true ? sql` distinct` : sql` distinct on (${sql.join(distinct.on, sql`, `)})`;
    }
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = this.buildFromTable(table);
    const joinsSql = this.buildJoins(joins);
    const whereSql = where ? sql` where ${where}` : void 0;
    const havingSql = having ? sql` having ${having}` : void 0;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      orderBySql = sql` order by ${sql.join(orderBy, sql`, `)}`;
    }
    let groupBySql;
    if (groupBy && groupBy.length > 0) {
      groupBySql = sql` group by ${sql.join(groupBy, sql`, `)}`;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    const lockingClauseSql = sql.empty();
    if (lockingClause) {
      const clauseSql = sql` for ${sql.raw(lockingClause.strength)}`;
      if (lockingClause.config.of) {
        clauseSql.append(
          sql` of ${sql.join(
            Array.isArray(lockingClause.config.of) ? lockingClause.config.of : [lockingClause.config.of],
            sql`, `
          )}`
        );
      }
      if (lockingClause.config.noWait) {
        clauseSql.append(sql` no wait`);
      } else if (lockingClause.config.skipLocked) {
        clauseSql.append(sql` skip locked`);
      }
      lockingClauseSql.append(clauseSql);
    }
    const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClauseSql}`;
    if (setOperators.length > 0) {
      return this.buildSetOperations(finalQuery, setOperators);
    }
    return finalQuery;
  }
  buildSetOperations(leftSelect, setOperators) {
    const [setOperator, ...rest] = setOperators;
    if (!setOperator) {
      throw new Error("Cannot pass undefined values to any set operator");
    }
    if (rest.length === 0) {
      return this.buildSetOperationQuery({ leftSelect, setOperator });
    }
    return this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect, setOperator }),
      rest
    );
  }
  buildSetOperationQuery({
    leftSelect,
    setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
  }) {
    const leftChunk = sql`(${leftSelect.getSQL()}) `;
    const rightChunk = sql`(${rightSelect.getSQL()})`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const singleOrderBy of orderBy) {
        if (is(singleOrderBy, PgColumn)) {
          orderByValues.push(sql.identifier(singleOrderBy.name));
        } else if (is(singleOrderBy, SQL)) {
          for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
            const chunk = singleOrderBy.queryChunks[i];
            if (is(chunk, PgColumn)) {
              singleOrderBy.queryChunks[i] = sql.identifier(chunk.name);
            }
          }
          orderByValues.push(sql`${singleOrderBy}`);
        } else {
          orderByValues.push(sql`${singleOrderBy}`);
        }
      }
      orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)} `;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
    const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select, overridingSystemValue_ }) {
    const valuesSqlList = [];
    const columns = table[Table.Symbol.Columns];
    const colEntries = Object.entries(columns).filter(([_, col]) => !col.shouldDisableInsert());
    const insertOrder = colEntries.map(
      ([, column]) => sql.identifier(this.casing.getColumnCasing(column))
    );
    if (select) {
      const select2 = valuesOrSelect;
      if (is(select2, SQL)) {
        valuesSqlList.push(select2);
      } else {
        valuesSqlList.push(select2.getSQL());
      }
    } else {
      const values = valuesOrSelect;
      valuesSqlList.push(sql.raw("values "));
      for (const [valueIndex, value] of values.entries()) {
        const valueList = [];
        for (const [fieldName, col] of colEntries) {
          const colValue = value[fieldName];
          if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
            if (col.defaultFn !== void 0) {
              const defaultFnResult = col.defaultFn();
              const defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
              valueList.push(defaultValue);
            } else if (!col.default && col.onUpdateFn !== void 0) {
              const onUpdateFnResult = col.onUpdateFn();
              const newValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
              valueList.push(newValue);
            } else {
              valueList.push(sql`default`);
            }
          } else {
            valueList.push(colValue);
          }
        }
        valuesSqlList.push(valueList);
        if (valueIndex < values.length - 1) {
          valuesSqlList.push(sql`, `);
        }
      }
    }
    const withSql = this.buildWithCTE(withList);
    const valuesSql = sql.join(valuesSqlList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const onConflictSql = onConflict ? sql` on conflict ${onConflict}` : void 0;
    const overridingSql = overridingSystemValue_ === true ? sql`overriding system value ` : void 0;
    return sql`${withSql}insert into ${table} ${insertOrder} ${overridingSql}${valuesSql}${onConflictSql}${returningSql}`;
  }
  buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }) {
    const concurrentlySql = concurrently ? sql` concurrently` : void 0;
    const withNoDataSql = withNoData ? sql` with no data` : void 0;
    return sql`refresh materialized view${concurrentlySql} ${view}${withNoDataSql}`;
  }
  prepareTyping(encoder) {
    if (is(encoder, PgJsonb) || is(encoder, PgJson)) {
      return "json";
    } else if (is(encoder, PgNumeric)) {
      return "decimal";
    } else if (is(encoder, PgTime)) {
      return "time";
    } else if (is(encoder, PgTimestamp) || is(encoder, PgTimestampString)) {
      return "timestamp";
    } else if (is(encoder, PgDate) || is(encoder, PgDateString)) {
      return "date";
    } else if (is(encoder, PgUUID)) {
      return "uuid";
    } else {
      return "none";
    }
  }
  sqlToQuery(sql2, invokeSource) {
    return sql2.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      prepareTyping: this.prepareTyping,
      invokeSource
    });
  }
  // buildRelationalQueryWithPK({
  // 	fullSchema,
  // 	schema,
  // 	tableNamesMap,
  // 	table,
  // 	tableConfig,
  // 	queryConfig: config,
  // 	tableAlias,
  // 	isRoot = false,
  // 	joinOn,
  // }: {
  // 	fullSchema: Record<string, unknown>;
  // 	schema: TablesRelationalConfig;
  // 	tableNamesMap: Record<string, string>;
  // 	table: PgTable;
  // 	tableConfig: TableRelationalConfig;
  // 	queryConfig: true | DBQueryConfig<'many', true>;
  // 	tableAlias: string;
  // 	isRoot?: boolean;
  // 	joinOn?: SQL;
  // }): BuildRelationalQueryResult<PgTable, PgColumn> {
  // 	// For { "<relation>": true }, return a table with selection of all columns
  // 	if (config === true) {
  // 		const selectionEntries = Object.entries(tableConfig.columns);
  // 		const selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = selectionEntries.map((
  // 			[key, value],
  // 		) => ({
  // 			dbKey: value.name,
  // 			tsKey: key,
  // 			field: value as PgColumn,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 		return {
  // 			tableTsKey: tableConfig.tsName,
  // 			sql: table,
  // 			selection,
  // 		};
  // 	}
  // 	// let selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = [];
  // 	// let selectionForBuild = selection;
  // 	const aliasedColumns = Object.fromEntries(
  // 		Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)]),
  // 	);
  // 	const aliasedRelations = Object.fromEntries(
  // 		Object.entries(tableConfig.relations).map(([key, value]) => [key, aliasedRelation(value, tableAlias)]),
  // 	);
  // 	const aliasedFields = Object.assign({}, aliasedColumns, aliasedRelations);
  // 	let where, hasUserDefinedWhere;
  // 	if (config.where) {
  // 		const whereSql = typeof config.where === 'function' ? config.where(aliasedFields, operators) : config.where;
  // 		where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
  // 		hasUserDefinedWhere = !!where;
  // 	}
  // 	where = and(joinOn, where);
  // 	// const fieldsSelection: { tsKey: string; value: PgColumn | SQL.Aliased; isExtra?: boolean }[] = [];
  // 	let joins: Join[] = [];
  // 	let selectedColumns: string[] = [];
  // 	// Figure out which columns to select
  // 	if (config.columns) {
  // 		let isIncludeMode = false;
  // 		for (const [field, value] of Object.entries(config.columns)) {
  // 			if (value === undefined) {
  // 				continue;
  // 			}
  // 			if (field in tableConfig.columns) {
  // 				if (!isIncludeMode && value === true) {
  // 					isIncludeMode = true;
  // 				}
  // 				selectedColumns.push(field);
  // 			}
  // 		}
  // 		if (selectedColumns.length > 0) {
  // 			selectedColumns = isIncludeMode
  // 				? selectedColumns.filter((c) => config.columns?.[c] === true)
  // 				: Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
  // 		}
  // 	} else {
  // 		// Select all columns if selection is not specified
  // 		selectedColumns = Object.keys(tableConfig.columns);
  // 	}
  // 	// for (const field of selectedColumns) {
  // 	// 	const column = tableConfig.columns[field]! as PgColumn;
  // 	// 	fieldsSelection.push({ tsKey: field, value: column });
  // 	// }
  // 	let initiallySelectedRelations: {
  // 		tsKey: string;
  // 		queryConfig: true | DBQueryConfig<'many', false>;
  // 		relation: Relation;
  // 	}[] = [];
  // 	// let selectedRelations: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = [];
  // 	// Figure out which relations to select
  // 	if (config.with) {
  // 		initiallySelectedRelations = Object.entries(config.with)
  // 			.filter((entry): entry is [typeof entry[0], NonNullable<typeof entry[1]>] => !!entry[1])
  // 			.map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey]! }));
  // 	}
  // 	const manyRelations = initiallySelectedRelations.filter((r) =>
  // 		is(r.relation, Many)
  // 		&& (schema[tableNamesMap[r.relation.referencedTable[Table.Symbol.Name]]!]?.primaryKey.length ?? 0) > 0
  // 	);
  // 	// If this is the last Many relation (or there are no Many relations), we are on the innermost subquery level
  // 	const isInnermostQuery = manyRelations.length < 2;
  // 	const selectedExtras: {
  // 		tsKey: string;
  // 		value: SQL.Aliased;
  // 	}[] = [];
  // 	// Figure out which extras to select
  // 	if (isInnermostQuery && config.extras) {
  // 		const extras = typeof config.extras === 'function'
  // 			? config.extras(aliasedFields, { sql })
  // 			: config.extras;
  // 		for (const [tsKey, value] of Object.entries(extras)) {
  // 			selectedExtras.push({
  // 				tsKey,
  // 				value: mapColumnsInAliasedSQLToAlias(value, tableAlias),
  // 			});
  // 		}
  // 	}
  // 	// Transform `fieldsSelection` into `selection`
  // 	// `fieldsSelection` shouldn't be used after this point
  // 	// for (const { tsKey, value, isExtra } of fieldsSelection) {
  // 	// 	selection.push({
  // 	// 		dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey]!.name,
  // 	// 		tsKey,
  // 	// 		field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
  // 	// 		relationTableTsKey: undefined,
  // 	// 		isJson: false,
  // 	// 		isExtra,
  // 	// 		selection: [],
  // 	// 	});
  // 	// }
  // 	let orderByOrig = typeof config.orderBy === 'function'
  // 		? config.orderBy(aliasedFields, orderByOperators)
  // 		: config.orderBy ?? [];
  // 	if (!Array.isArray(orderByOrig)) {
  // 		orderByOrig = [orderByOrig];
  // 	}
  // 	const orderBy = orderByOrig.map((orderByValue) => {
  // 		if (is(orderByValue, Column)) {
  // 			return aliasedTableColumn(orderByValue, tableAlias) as PgColumn;
  // 		}
  // 		return mapColumnsInSQLToAlias(orderByValue, tableAlias);
  // 	});
  // 	const limit = isInnermostQuery ? config.limit : undefined;
  // 	const offset = isInnermostQuery ? config.offset : undefined;
  // 	// For non-root queries without additional config except columns, return a table with selection
  // 	if (
  // 		!isRoot
  // 		&& initiallySelectedRelations.length === 0
  // 		&& selectedExtras.length === 0
  // 		&& !where
  // 		&& orderBy.length === 0
  // 		&& limit === undefined
  // 		&& offset === undefined
  // 	) {
  // 		return {
  // 			tableTsKey: tableConfig.tsName,
  // 			sql: table,
  // 			selection: selectedColumns.map((key) => ({
  // 				dbKey: tableConfig.columns[key]!.name,
  // 				tsKey: key,
  // 				field: tableConfig.columns[key] as PgColumn,
  // 				relationTableTsKey: undefined,
  // 				isJson: false,
  // 				selection: [],
  // 			})),
  // 		};
  // 	}
  // 	const selectedRelationsWithoutPK:
  // 	// Process all relations without primary keys, because they need to be joined differently and will all be on the same query level
  // 	for (
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationConfigValue,
  // 			relation,
  // 		} of initiallySelectedRelations
  // 	) {
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTable = schema[relationTableTsName]!;
  // 		if (relationTable.primaryKey.length > 0) {
  // 			continue;
  // 		}
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelation = this.buildRelationalQueryWithoutPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationConfigValue,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 			nestedQueryRelation: relation,
  // 		});
  // 		const field = sql`${sql.identifier(relationTableAlias)}.${sql.identifier('data')}`.as(selectedRelationTsKey);
  // 		joins.push({
  // 			on: sql`true`,
  // 			table: new Subquery(builtRelation.sql as SQL, {}, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: true,
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelation.selection,
  // 		});
  // 	}
  // 	const oneRelations = initiallySelectedRelations.filter((r): r is typeof r & { relation: One } =>
  // 		is(r.relation, One)
  // 	);
  // 	// Process all One relations with PKs, because they can all be joined on the same level
  // 	for (
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationConfigValue,
  // 			relation,
  // 		} of oneRelations
  // 	) {
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const relationTable = schema[relationTableTsName]!;
  // 		if (relationTable.primaryKey.length === 0) {
  // 			continue;
  // 		}
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelation = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationConfigValue,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 		});
  // 		const field = sql`case when ${sql.identifier(relationTableAlias)} is null then null else json_build_array(${
  // 			sql.join(
  // 				builtRelation.selection.map(({ field }) =>
  // 					is(field, SQL.Aliased)
  // 						? sql`${sql.identifier(relationTableAlias)}.${sql.identifier(field.fieldAlias)}`
  // 						: is(field, Column)
  // 						? aliasedTableColumn(field, relationTableAlias)
  // 						: field
  // 				),
  // 				sql`, `,
  // 			)
  // 		}) end`.as(selectedRelationTsKey);
  // 		const isLateralJoin = is(builtRelation.sql, SQL);
  // 		joins.push({
  // 			on: isLateralJoin ? sql`true` : joinOn,
  // 			table: is(builtRelation.sql, SQL)
  // 				? new Subquery(builtRelation.sql, {}, relationTableAlias)
  // 				: aliasedTable(builtRelation.sql, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: is(builtRelation.sql, SQL),
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelation.selection,
  // 		});
  // 	}
  // 	let distinct: PgSelectConfig['distinct'];
  // 	let tableFrom: PgTable | Subquery = table;
  // 	// Process first Many relation - each one requires a nested subquery
  // 	const manyRelation = manyRelations[0];
  // 	if (manyRelation) {
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationQueryConfig,
  // 			relation,
  // 		} = manyRelation;
  // 		distinct = {
  // 			on: tableConfig.primaryKey.map((c) => aliasedTableColumn(c as PgColumn, tableAlias)),
  // 		};
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelationJoin = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationQueryConfig,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 		});
  // 		const builtRelationSelectionField = sql`case when ${
  // 			sql.identifier(relationTableAlias)
  // 		} is null then '[]' else json_agg(json_build_array(${
  // 			sql.join(
  // 				builtRelationJoin.selection.map(({ field }) =>
  // 					is(field, SQL.Aliased)
  // 						? sql`${sql.identifier(relationTableAlias)}.${sql.identifier(field.fieldAlias)}`
  // 						: is(field, Column)
  // 						? aliasedTableColumn(field, relationTableAlias)
  // 						: field
  // 				),
  // 				sql`, `,
  // 			)
  // 		})) over (partition by ${sql.join(distinct.on, sql`, `)}) end`.as(selectedRelationTsKey);
  // 		const isLateralJoin = is(builtRelationJoin.sql, SQL);
  // 		joins.push({
  // 			on: isLateralJoin ? sql`true` : joinOn,
  // 			table: isLateralJoin
  // 				? new Subquery(builtRelationJoin.sql as SQL, {}, relationTableAlias)
  // 				: aliasedTable(builtRelationJoin.sql as PgTable, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: isLateralJoin,
  // 		});
  // 		// Build the "from" subquery with the remaining Many relations
  // 		const builtTableFrom = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table,
  // 			tableConfig,
  // 			queryConfig: {
  // 				...config,
  // 				where: undefined,
  // 				orderBy: undefined,
  // 				limit: undefined,
  // 				offset: undefined,
  // 				with: manyRelations.slice(1).reduce<NonNullable<typeof config['with']>>(
  // 					(result, { tsKey, queryConfig: configValue }) => {
  // 						result[tsKey] = configValue;
  // 						return result;
  // 					},
  // 					{},
  // 				),
  // 			},
  // 			tableAlias,
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field: builtRelationSelectionField,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelationJoin.selection,
  // 		});
  // 		// selection = builtTableFrom.selection.map((item) =>
  // 		// 	is(item.field, SQL.Aliased)
  // 		// 		? { ...item, field: sql`${sql.identifier(tableAlias)}.${sql.identifier(item.field.fieldAlias)}` }
  // 		// 		: item
  // 		// );
  // 		// selectionForBuild = [{
  // 		// 	dbKey: '*',
  // 		// 	tsKey: '*',
  // 		// 	field: sql`${sql.identifier(tableAlias)}.*`,
  // 		// 	selection: [],
  // 		// 	isJson: false,
  // 		// 	relationTableTsKey: undefined,
  // 		// }];
  // 		// const newSelectionItem: (typeof selection)[number] = {
  // 		// 	dbKey: selectedRelationTsKey,
  // 		// 	tsKey: selectedRelationTsKey,
  // 		// 	field,
  // 		// 	relationTableTsKey: relationTableTsName,
  // 		// 	isJson: true,
  // 		// 	selection: builtRelationJoin.selection,
  // 		// };
  // 		// selection.push(newSelectionItem);
  // 		// selectionForBuild.push(newSelectionItem);
  // 		tableFrom = is(builtTableFrom.sql, PgTable)
  // 			? builtTableFrom.sql
  // 			: new Subquery(builtTableFrom.sql, {}, tableAlias);
  // 	}
  // 	if (selectedColumns.length === 0 && selectedRelations.length === 0 && selectedExtras.length === 0) {
  // 		throw new DrizzleError(`No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")`);
  // 	}
  // 	let selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'];
  // 	function prepareSelectedColumns() {
  // 		return selectedColumns.map((key) => ({
  // 			dbKey: tableConfig.columns[key]!.name,
  // 			tsKey: key,
  // 			field: tableConfig.columns[key] as PgColumn,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 	}
  // 	function prepareSelectedExtras() {
  // 		return selectedExtras.map((item) => ({
  // 			dbKey: item.value.fieldAlias,
  // 			tsKey: item.tsKey,
  // 			field: item.value,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 	}
  // 	if (isRoot) {
  // 		selection = [
  // 			...prepareSelectedColumns(),
  // 			...prepareSelectedExtras(),
  // 		];
  // 	}
  // 	if (hasUserDefinedWhere || orderBy.length > 0) {
  // 		tableFrom = new Subquery(
  // 			this.buildSelectQuery({
  // 				table: is(tableFrom, PgTable) ? aliasedTable(tableFrom, tableAlias) : tableFrom,
  // 				fields: {},
  // 				fieldsFlat: selectionForBuild.map(({ field }) => ({
  // 					path: [],
  // 					field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field,
  // 				})),
  // 				joins,
  // 				distinct,
  // 			}),
  // 			{},
  // 			tableAlias,
  // 		);
  // 		selectionForBuild = selection.map((item) =>
  // 			is(item.field, SQL.Aliased)
  // 				? { ...item, field: sql`${sql.identifier(tableAlias)}.${sql.identifier(item.field.fieldAlias)}` }
  // 				: item
  // 		);
  // 		joins = [];
  // 		distinct = undefined;
  // 	}
  // 	const result = this.buildSelectQuery({
  // 		table: is(tableFrom, PgTable) ? aliasedTable(tableFrom, tableAlias) : tableFrom,
  // 		fields: {},
  // 		fieldsFlat: selectionForBuild.map(({ field }) => ({
  // 			path: [],
  // 			field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field,
  // 		})),
  // 		where,
  // 		limit,
  // 		offset,
  // 		joins,
  // 		orderBy,
  // 		distinct,
  // 	});
  // 	return {
  // 		tableTsKey: tableConfig.tsName,
  // 		sql: result,
  // 		selection,
  // 	};
  // }
  buildRelationalQueryWithoutPK({
    fullSchema,
    schema,
    tableNamesMap,
    table,
    tableConfig,
    queryConfig: config,
    tableAlias,
    nestedQueryRelation,
    joinOn
  }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    const joins = [];
    if (config === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(
        Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)])
      );
      if (config.where) {
        const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, getOperators()) : config.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config.with) {
        selectedRelations = Object.entries(config.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig2]) => ({ tsKey, queryConfig: queryConfig2, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config.extras) {
        extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql }) : config.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, getOrderByOperators()) : config.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config.limit;
      offset = config.offset;
      for (const {
        tsKey: selectedRelationTsKey,
        queryConfig: selectedRelationConfigValue,
        relation
      } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
        const relationTableName = getTableUniqueName(relation.referencedTable);
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(
          ...normalizedRelation.fields.map(
            (field2, i) => eq(
              aliasedTableColumn(normalizedRelation.references[i], relationTableAlias),
              aliasedTableColumn(field2, tableAlias)
            )
          )
        );
        const builtRelation = this.buildRelationalQueryWithoutPK({
          fullSchema,
          schema,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = sql`${sql.identifier(relationTableAlias)}.${sql.identifier("data")}`.as(selectedRelationTsKey);
        joins.push({
          on: sql`true`,
          table: new Subquery(builtRelation.sql, {}, relationTableAlias),
          alias: relationTableAlias,
          joinType: "left",
          lateral: true
        });
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError({ message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")` });
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_build_array(${sql.join(
        selection.map(
          ({ field: field2, tsKey, isJson }) => isJson ? sql`${sql.identifier(`${tableAlias}_${tsKey}`)}.${sql.identifier("data")}` : is(field2, SQL.Aliased) ? field2.sql : field2
        ),
        sql`, `
      )})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`coalesce(json_agg(${field}${orderBy.length > 0 ? sql` order by ${sql.join(orderBy, sql`, `)}` : void 0}), '[]'::json)`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table, tableAlias),
          fields: {},
          fieldsFlat: [{
            path: [],
            field: sql.raw("*")
          }],
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = [];
      } else {
        result = aliasedTable(table, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, PgTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder = class {
  static [entityKind] = "TypedQueryBuilder";
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/query-builders/select.js
var PgSelectBuilder = class {
  static [entityKind] = "PgSelectBuilder";
  fields;
  session;
  dialect;
  withList = [];
  distinct;
  constructor(config) {
    this.fields = config.fields;
    this.session = config.session;
    this.dialect = config.dialect;
    if (config.withList) {
      this.withList = config.withList;
    }
    this.distinct = config.distinct;
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  /**
   * Specify the table, subquery, or other target that you're
   * building a select query against.
   *
   * {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM | Postgres from documentation}
   */
  from(source) {
    const isPartialSelect = !!this.fields;
    const src = source;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is(src, Subquery)) {
      fields = Object.fromEntries(
        Object.keys(src._.selectedFields).map((key) => [key, src[key]])
      );
    } else if (is(src, PgViewBase)) {
      fields = src[ViewBaseConfig].selectedFields;
    } else if (is(src, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(src);
    }
    return new PgSelectBase({
      table: src,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    }).setToken(this.authToken);
  }
};
var PgSelectQueryBuilderBase = class extends TypedQueryBuilder {
  static [entityKind] = "PgSelectQueryBuilder";
  _;
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table,
      fields: { ...fields },
      distinct,
      setOperators: []
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields
    };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  createJoin(joinType) {
    return (table, on) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is(table, SQL)) {
          const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on === "function") {
        on = on(
          new Proxy(
            this.config.fields,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      if (!this.config.joins) {
        this.config.joins = [];
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  /**
   * Executes a `left join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet | null }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  leftJoin = this.createJoin("left");
  /**
   * Executes a `right join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  rightJoin = this.createJoin("right");
  /**
   * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  innerJoin = this.createJoin("inner");
  /**
   * Executes a `full join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet | null }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  fullJoin = this.createJoin("full");
  createSetOperator(type, isAll) {
    return (rightSelection) => {
      const rightSelect = typeof rightSelection === "function" ? rightSelection(getPgSetOperators()) : rightSelection;
      if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
      this.config.setOperators.push({ type, isAll, rightSelect });
      return this;
    };
  }
  /**
   * Adds `union` set operator to the query.
   *
   * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
   *
   * @example
   *
   * ```ts
   * // Select all unique names from customers and users tables
   * await db.select({ name: users.name })
   *   .from(users)
   *   .union(
   *     db.select({ name: customers.name }).from(customers)
   *   );
   * // or
   * import { union } from 'drizzle-orm/pg-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */
  union = this.createSetOperator("union", false);
  /**
   * Adds `union all` set operator to the query.
   *
   * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
   *
   * @example
   *
   * ```ts
   * // Select all transaction ids from both online and in-store sales
   * await db.select({ transaction: onlineSales.transactionId })
   *   .from(onlineSales)
   *   .unionAll(
   *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   *   );
   * // or
   * import { unionAll } from 'drizzle-orm/pg-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */
  unionAll = this.createSetOperator("union", true);
  /**
   * Adds `intersect` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
   *
   * @example
   *
   * ```ts
   * // Select course names that are offered in both departments A and B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .intersect(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { intersect } from 'drizzle-orm/pg-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  intersect = this.createSetOperator("intersect", false);
  /**
   * Adds `intersect all` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets including all duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect-all}
   *
   * @example
   *
   * ```ts
   * // Select all products and quantities that are ordered by both regular and VIP customers
   * await db.select({
   *   productId: regularCustomerOrders.productId,
   *   quantityOrdered: regularCustomerOrders.quantityOrdered
   * })
   * .from(regularCustomerOrders)
   * .intersectAll(
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * // or
   * import { intersectAll } from 'drizzle-orm/pg-core'
   *
   * await intersectAll(
   *   db.select({
   *     productId: regularCustomerOrders.productId,
   *     quantityOrdered: regularCustomerOrders.quantityOrdered
   *   })
   *   .from(regularCustomerOrders),
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * ```
   */
  intersectAll = this.createSetOperator("intersect", true);
  /**
   * Adds `except` set operator to the query.
   *
   * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
   *
   * @example
   *
   * ```ts
   * // Select all courses offered in department A but not in department B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .except(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { except } from 'drizzle-orm/pg-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  except = this.createSetOperator("except", false);
  /**
   * Adds `except all` set operator to the query.
   *
   * Calling this method will retrieve all rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except-all}
   *
   * @example
   *
   * ```ts
   * // Select all products that are ordered by regular customers but not by VIP customers
   * await db.select({
   *   productId: regularCustomerOrders.productId,
   *   quantityOrdered: regularCustomerOrders.quantityOrdered,
   * })
   * .from(regularCustomerOrders)
   * .exceptAll(
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered,
   *   })
   *   .from(vipCustomerOrders)
   * );
   * // or
   * import { exceptAll } from 'drizzle-orm/pg-core'
   *
   * await exceptAll(
   *   db.select({
   *     productId: regularCustomerOrders.productId,
   *     quantityOrdered: regularCustomerOrders.quantityOrdered
   *   })
   *   .from(regularCustomerOrders),
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * ```
   */
  exceptAll = this.createSetOperator("except", true);
  /** @internal */
  addSetOperators(setOperators) {
    this.config.setOperators.push(...setOperators);
    return this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    if (typeof where === "function") {
      where = where(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.where = where;
    return this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(having) {
    if (typeof having === "function") {
      having = having(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    } else {
      const orderByArray = columns;
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(limit) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).limit = limit;
    } else {
      this.config.limit = limit;
    }
    return this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(offset) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).offset = offset;
    } else {
      this.config.offset = offset;
    }
    return this;
  }
  /**
   * Adds a `for` clause to the query.
   *
   * Calling this method will specify a lock strength for this query that controls how strictly it acquires exclusive access to the rows being queried.
   *
   * See docs: {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE}
   *
   * @param strength the lock strength.
   * @param config the lock configuration.
   */
  for(strength, config = {}) {
    this.config.lockingClause = { strength, config };
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    return new Proxy(
      new Subquery(this.getSQL(), this.config.fields, alias),
      new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
};
var PgSelectBase = class extends PgSelectQueryBuilderBase {
  static [entityKind] = "PgSelect";
  /** @internal */
  _prepare(name) {
    const { session, config, dialect, joinsNotNullableMap, authToken } = this;
    if (!session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const fieldsList = orderSelectedFields(config.fields);
      const query = session.prepareQuery(dialect.sqlToQuery(this.getSQL()), fieldsList, name, true);
      query.joinsNotNullableMap = joinsNotNullableMap;
      return query.setToken(authToken);
    });
  }
  /**
   * Create a prepared statement for this query. This allows
   * the database to remember this query for the given session
   * and call it by name, rather than specifying the full query.
   *
   * {@link https://www.postgresql.org/docs/current/sql-prepare.html | Postgres prepare documentation}
   */
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
};
applyMixins(PgSelectBase, [QueryPromise]);
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select) => ({
      type,
      isAll,
      rightSelect: select
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
var getPgSetOperators = () => ({
  union,
  unionAll,
  intersect,
  intersectAll,
  except,
  exceptAll
});
var union = createSetOperator("union", false);
var unionAll = createSetOperator("union", true);
var intersect = createSetOperator("intersect", false);
var intersectAll = createSetOperator("intersect", true);
var except = createSetOperator("except", false);
var exceptAll = createSetOperator("except", true);

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/query-builders/query-builder.js
var QueryBuilder = class {
  static [entityKind] = "PgQueryBuilder";
  dialect;
  dialectConfig;
  constructor(dialect) {
    this.dialect = is(dialect, PgDialect) ? dialect : void 0;
    this.dialectConfig = is(dialect, PgDialect) ? void 0 : dialect;
  }
  $with = (alias, selection) => {
    const queryBuilder = this;
    const as2 = (qb) => {
      if (typeof qb === "function") {
        qb = qb(queryBuilder);
      }
      return new Proxy(
        new WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    };
    return { as: as2 };
  };
  with(...queries) {
    const self = this;
    function select(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        distinct: true
      });
    }
    function selectDistinctOn(on, fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        distinct: { on }
      });
    }
    return { select, selectDistinct, selectDistinctOn };
  }
  select(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect()
    });
  }
  selectDistinct(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  selectDistinctOn(on, fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: { on }
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new PgDialect(this.dialectConfig);
    }
    return this.dialect;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/query-builders/insert.js
var PgInsertBuilder = class {
  constructor(table, session, dialect, withList, overridingSystemValue_) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
    this.overridingSystemValue_ = overridingSystemValue_;
  }
  static [entityKind] = "PgInsertBuilder";
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  overridingSystemValue() {
    this.overridingSystemValue_ = true;
    return this;
  }
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new PgInsertBase(
      this.table,
      mappedValues,
      this.session,
      this.dialect,
      this.withList,
      false,
      this.overridingSystemValue_
    ).setToken(this.authToken);
  }
  select(selectQuery) {
    const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
    if (!is(select, SQL) && !haveSameKeys(this.table[Columns], select._.selectedFields)) {
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    }
    return new PgInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
  }
};
var PgInsertBase = class extends QueryPromise {
  constructor(table, values, session, dialect, withList, select, overridingSystemValue_) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, values, withList, select, overridingSystemValue_ };
  }
  static [entityKind] = "PgInsert";
  config;
  returning(fields = this.config.table[Table.Symbol.Columns]) {
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(config = {}) {
    if (config.target === void 0) {
      this.config.onConflict = sql`do nothing`;
    } else {
      let targetColumn = "";
      targetColumn = Array.isArray(config.target) ? config.target.map((it2) => this.dialect.escapeName(this.dialect.casing.getColumnCasing(it2))).join(",") : this.dialect.escapeName(this.dialect.casing.getColumnCasing(config.target));
      const whereSql = config.where ? sql` where ${config.where}` : void 0;
      this.config.onConflict = sql`(${sql.raw(targetColumn)})${whereSql} do nothing`;
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     targetWhere: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(config) {
    if (config.where && (config.targetWhere || config.setWhere)) {
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    }
    const whereSql = config.where ? sql` where ${config.where}` : void 0;
    const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : void 0;
    const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : void 0;
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
    let targetColumn = "";
    targetColumn = Array.isArray(config.target) ? config.target.map((it2) => this.dialect.escapeName(this.dialect.casing.getColumnCasing(it2))).join(",") : this.dialect.escapeName(this.dialect.casing.getColumnCasing(config.target));
    this.config.onConflict = sql`(${sql.raw(targetColumn)})${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true);
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
  /** @internal */
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(
      this.config.returningFields,
      new SelectionProxyHandler({
        alias: getTableName(this.config.table),
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      })
    ) : void 0;
  }
  $dynamic() {
    return this;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/query-builders/refresh-materialized-view.js
var PgRefreshMaterializedView = class extends QueryPromise {
  constructor(view, session, dialect) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { view };
  }
  static [entityKind] = "PgRefreshMaterializedView";
  config;
  concurrently() {
    if (this.config.withNoData !== void 0) {
      throw new Error("Cannot use concurrently and withNoData together");
    }
    this.config.concurrently = true;
    return this;
  }
  withNoData() {
    if (this.config.concurrently !== void 0) {
      throw new Error("Cannot use concurrently and withNoData together");
    }
    this.config.withNoData = true;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildRefreshMaterializedViewQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), void 0, name, true);
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/query-builders/update.js
var PgUpdateBuilder = class {
  constructor(table, session, dialect, withList) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  static [entityKind] = "PgUpdateBuilder";
  authToken;
  setToken(token) {
    this.authToken = token;
    return this;
  }
  set(values) {
    return new PgUpdateBase(
      this.table,
      mapUpdateSet(this.table, values),
      this.session,
      this.dialect,
      this.withList
    ).setToken(this.authToken);
  }
};
var PgUpdateBase = class extends QueryPromise {
  constructor(table, set, session, dialect, withList) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { set, table, withList, joins: [] };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  static [entityKind] = "PgUpdate";
  config;
  tableName;
  joinsNotNullableMap;
  from(source) {
    const src = source;
    const tableName = getTableLikeName(src);
    if (typeof tableName === "string") {
      this.joinsNotNullableMap[tableName] = true;
    }
    this.config.from = src;
    return this;
  }
  getTableLikeFields(table) {
    if (is(table, PgTable)) {
      return table[Table.Symbol.Columns];
    } else if (is(table, Subquery)) {
      return table._.selectedFields;
    }
    return table[ViewBaseConfig].selectedFields;
  }
  createJoin(joinType) {
    return (table, on) => {
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (typeof on === "function") {
        const from = this.config.from && !is(this.config.from, SQL) ? this.getTableLikeFields(this.config.from) : void 0;
        on = on(
          new Proxy(
            this.config.table[Table.Symbol.Columns],
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          from && new Proxy(
            from,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * await db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * await db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * await db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * await db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields) {
    if (!fields) {
      fields = Object.assign({}, this.config.table[Table.Symbol.Columns]);
      if (this.config.from) {
        const tableName = getTableLikeName(this.config.from);
        if (typeof tableName === "string" && this.config.from && !is(this.config.from, SQL)) {
          const fromFields = this.getTableLikeFields(this.config.from);
          fields[tableName] = fromFields;
        }
        for (const join of this.config.joins) {
          const tableName2 = getTableLikeName(join.table);
          if (typeof tableName2 === "string" && !is(join.table, SQL)) {
            const fromFields = this.getTableLikeFields(join.table);
            fields[tableName2] = fromFields;
          }
        }
      }
    }
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    const query = this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true);
    query.joinsNotNullableMap = this.joinsNotNullableMap;
    return query;
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return this._prepare().execute(placeholderValues, this.authToken);
  };
  /** @internal */
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(
      this.config.returningFields,
      new SelectionProxyHandler({
        alias: getTableName(this.config.table),
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      })
    ) : void 0;
  }
  $dynamic() {
    return this;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/query-builders/count.js
var PgCountBuilder = class _PgCountBuilder extends SQL {
  constructor(params) {
    super(_PgCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
    this.params = params;
    this.mapWith(Number);
    this.session = params.session;
    this.sql = _PgCountBuilder.buildCount(
      params.source,
      params.filters
    );
  }
  sql;
  token;
  static [entityKind] = "PgCountBuilder";
  [Symbol.toStringTag] = "PgCountBuilder";
  session;
  static buildEmbeddedCount(source, filters) {
    return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
  }
  static buildCount(source, filters) {
    return sql`select count(*) as count from ${source}${sql.raw(" where ").if(filters)}${filters};`;
  }
  /** @intrnal */
  setToken(token) {
    this.token = token;
    return this;
  }
  then(onfulfilled, onrejected) {
    return Promise.resolve(this.session.count(this.sql, this.token)).then(
      onfulfilled,
      onrejected
    );
  }
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/query-builders/query.js
var RelationalQueryBuilder = class {
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
  }
  static [entityKind] = "PgRelationalQueryBuilder";
  findMany(config) {
    return new PgRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? config : {},
      "many"
    );
  }
  findFirst(config) {
    return new PgRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? { ...config, limit: 1 } : { limit: 1 },
      "first"
    );
  }
};
var PgRelationalQuery = class extends QueryPromise {
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
    super();
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config;
    this.mode = mode;
  }
  static [entityKind] = "PgRelationalQuery";
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const { query, builtQuery } = this._toSQL();
      return this.session.prepareQuery(
        builtQuery,
        void 0,
        name,
        true,
        (rawRows, mapColumnValue) => {
          const rows = rawRows.map(
            (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
          );
          if (this.mode === "first") {
            return rows[0];
          }
          return rows;
        }
      );
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  _getQuery() {
    return this.dialect.buildRelationalQueryWithoutPK({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
  }
  /** @internal */
  getSQL() {
    return this._getQuery().sql;
  }
  _toSQL() {
    const query = this._getQuery();
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return { query, builtQuery };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute() {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(void 0, this.authToken);
    });
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/query-builders/raw.js
var PgRaw = class extends QueryPromise {
  constructor(execute, sql2, query, mapBatchResult) {
    super();
    this.execute = execute;
    this.sql = sql2;
    this.query = query;
    this.mapBatchResult = mapBatchResult;
  }
  static [entityKind] = "PgRaw";
  /** @internal */
  getSQL() {
    return this.sql;
  }
  getQuery() {
    return this.query;
  }
  mapResult(result, isFromBatch) {
    return isFromBatch ? this.mapBatchResult(result) : result;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return false;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/db.js
var PgDatabase = class {
  constructor(dialect, session, schema) {
    this.dialect = dialect;
    this.session = session;
    this._ = schema ? {
      schema: schema.schema,
      fullSchema: schema.fullSchema,
      tableNamesMap: schema.tableNamesMap,
      session
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {},
      session
    };
    this.query = {};
    if (this._.schema) {
      for (const [tableName, columns] of Object.entries(this._.schema)) {
        this.query[tableName] = new RelationalQueryBuilder(
          schema.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          schema.fullSchema[tableName],
          columns,
          dialect,
          session
        );
      }
    }
  }
  static [entityKind] = "PgDatabase";
  query;
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with = (alias, selection) => {
    const self = this;
    const as2 = (qb) => {
      if (typeof qb === "function") {
        qb = qb(new QueryBuilder(self.dialect));
      }
      return new Proxy(
        new WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    };
    return { as: as2 };
  };
  $count(source, filters) {
    return new PgCountBuilder({ source, filters, session: this.session });
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...queries) {
    const self = this;
    function select(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: true
      });
    }
    function selectDistinctOn(on, fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: { on }
      });
    }
    function update(table) {
      return new PgUpdateBuilder(table, self.session, self.dialect, queries);
    }
    function insert(table) {
      return new PgInsertBuilder(table, self.session, self.dialect, queries);
    }
    function delete_(table) {
      return new PgDeleteBase(table, self.session, self.dialect, queries);
    }
    return { select, selectDistinct, selectDistinctOn, update, insert, delete: delete_ };
  }
  select(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect
    });
  }
  selectDistinct(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  selectDistinctOn(on, fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: { on }
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(table) {
    return new PgUpdateBuilder(table, this.session, this.dialect);
  }
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(table) {
    return new PgInsertBuilder(table, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(table) {
    return new PgDeleteBase(table, this.session, this.dialect);
  }
  refreshMaterializedView(view) {
    return new PgRefreshMaterializedView(view, this.session, this.dialect);
  }
  authToken;
  execute(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    const builtQuery = this.dialect.sqlToQuery(sequel);
    const prepared = this.session.prepareQuery(
      builtQuery,
      void 0,
      void 0,
      false
    );
    return new PgRaw(
      () => prepared.execute(void 0, this.authToken),
      sequel,
      builtQuery,
      (result) => prepared.mapResult(result, true)
    );
  }
  transaction(transaction, config) {
    return this.session.transaction(transaction, config);
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/indexes.js
var IndexBuilderOn = class {
  constructor(unique, name) {
    this.unique = unique;
    this.name = name;
  }
  static [entityKind] = "PgIndexBuilderOn";
  on(...columns) {
    return new IndexBuilder(
      columns.map((it2) => {
        if (is(it2, SQL)) {
          return it2;
        }
        it2 = it2;
        const clonedIndexedColumn = new IndexedColumn(it2.name, !!it2.keyAsName, it2.columnType, it2.indexConfig);
        it2.indexConfig = JSON.parse(JSON.stringify(it2.defaultConfig));
        return clonedIndexedColumn;
      }),
      this.unique,
      false,
      this.name
    );
  }
  onOnly(...columns) {
    return new IndexBuilder(
      columns.map((it2) => {
        if (is(it2, SQL)) {
          return it2;
        }
        it2 = it2;
        const clonedIndexedColumn = new IndexedColumn(it2.name, !!it2.keyAsName, it2.columnType, it2.indexConfig);
        it2.indexConfig = it2.defaultConfig;
        return clonedIndexedColumn;
      }),
      this.unique,
      true,
      this.name
    );
  }
  /**
   * Specify what index method to use. Choices are `btree`, `hash`, `gist`, `spgist`, `gin`, `brin`, or user-installed access methods like `bloom`. The default method is `btree.
   *
   * If you have the `pg_vector` extension installed in your database, you can use the `hnsw` and `ivfflat` options, which are predefined types.
   *
   * **You can always specify any string you want in the method, in case Drizzle doesn't have it natively in its types**
   *
   * @param method The name of the index method to be used
   * @param columns
   * @returns
   */
  using(method, ...columns) {
    return new IndexBuilder(
      columns.map((it2) => {
        if (is(it2, SQL)) {
          return it2;
        }
        it2 = it2;
        const clonedIndexedColumn = new IndexedColumn(it2.name, !!it2.keyAsName, it2.columnType, it2.indexConfig);
        it2.indexConfig = JSON.parse(JSON.stringify(it2.defaultConfig));
        return clonedIndexedColumn;
      }),
      this.unique,
      true,
      this.name,
      method
    );
  }
};
var IndexBuilder = class {
  static [entityKind] = "PgIndexBuilder";
  /** @internal */
  config;
  constructor(columns, unique, only, name, method = "btree") {
    this.config = {
      name,
      columns,
      unique,
      only,
      method
    };
  }
  concurrently() {
    this.config.concurrently = true;
    return this;
  }
  with(obj) {
    this.config.with = obj;
    return this;
  }
  where(condition) {
    this.config.where = condition;
    return this;
  }
  /** @internal */
  build(table) {
    return new Index(this.config, table);
  }
};
var Index = class {
  static [entityKind] = "PgIndex";
  config;
  constructor(config, table) {
    this.config = { ...config, table };
  }
};
function index(name) {
  return new IndexBuilderOn(false, name);
}
function uniqueIndex(name) {
  return new IndexBuilderOn(true, name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/pg-core/session.js
var PgPreparedQuery = class {
  constructor(query) {
    this.query = query;
  }
  authToken;
  getQuery() {
    return this.query;
  }
  mapResult(response, _isFromBatch) {
    return response;
  }
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  static [entityKind] = "PgPreparedQuery";
  /** @internal */
  joinsNotNullableMap;
};
var PgSession = class {
  constructor(dialect) {
    this.dialect = dialect;
  }
  static [entityKind] = "PgSession";
  /** @internal */
  execute(query, token) {
    return tracer.startActiveSpan("drizzle.operation", () => {
      const prepared = tracer.startActiveSpan("drizzle.prepareQuery", () => {
        return this.prepareQuery(
          this.dialect.sqlToQuery(query),
          void 0,
          void 0,
          false
        );
      });
      return prepared.setToken(token).execute(void 0, token);
    });
  }
  all(query) {
    return this.prepareQuery(
      this.dialect.sqlToQuery(query),
      void 0,
      void 0,
      false
    ).all();
  }
  /** @internal */
  async count(sql2, token) {
    const res = await this.execute(sql2, token);
    return Number(
      res[0]["count"]
    );
  }
};
var PgTransaction = class extends PgDatabase {
  constructor(dialect, session, schema, nestedIndex = 0) {
    super(dialect, session, schema);
    this.schema = schema;
    this.nestedIndex = nestedIndex;
  }
  static [entityKind] = "PgTransaction";
  rollback() {
    throw new TransactionRollbackError();
  }
  /** @internal */
  getTransactionConfigSQL(config) {
    const chunks = [];
    if (config.isolationLevel) {
      chunks.push(`isolation level ${config.isolationLevel}`);
    }
    if (config.accessMode) {
      chunks.push(config.accessMode);
    }
    if (typeof config.deferrable === "boolean") {
      chunks.push(config.deferrable ? "deferrable" : "not deferrable");
    }
    return sql.raw(chunks.join(" "));
  }
  setTransaction(config) {
    return this.session.execute(sql`set transaction ${this.getTransactionConfigSQL(config)}`);
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/neon-http/session.js
var rawQueryConfig = {
  arrayMode: false,
  fullResults: true
};
var queryConfig = {
  arrayMode: true,
  fullResults: true
};
var NeonHttpPreparedQuery = class extends PgPreparedQuery {
  constructor(client, query, logger, fields, _isResponseInArrayMode, customResultMapper) {
    super(query);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
    this.clientQuery = client.query ?? client;
  }
  static [entityKind] = "NeonHttpPreparedQuery";
  clientQuery;
  /** @internal */
  async execute(placeholderValues = {}, token = this.authToken) {
    const params = fillPlaceholders(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    const { fields, clientQuery, query, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return clientQuery(
        query.sql,
        params,
        token === void 0 ? rawQueryConfig : {
          ...rawQueryConfig,
          authToken: token
        }
      );
    }
    const result = await clientQuery(
      query.sql,
      params,
      token === void 0 ? queryConfig : {
        ...queryConfig,
        authToken: token
      }
    );
    return this.mapResult(result);
  }
  mapResult(result) {
    if (!this.fields && !this.customResultMapper) {
      return result;
    }
    const rows = result.rows;
    if (this.customResultMapper) {
      return this.customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(this.fields, row, this.joinsNotNullableMap));
  }
  all(placeholderValues = {}) {
    const params = fillPlaceholders(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    return this.clientQuery(
      this.query.sql,
      params,
      this.authToken === void 0 ? rawQueryConfig : {
        ...rawQueryConfig,
        authToken: this.authToken
      }
    ).then((result) => result.rows);
  }
  /** @internal */
  values(placeholderValues = {}, token) {
    const params = fillPlaceholders(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    return this.clientQuery(this.query.sql, params, { arrayMode: true, fullResults: true, authToken: token }).then((result) => result.rows);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
};
var NeonHttpSession = class extends PgSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.clientQuery = client.query ?? client;
    this.logger = options.logger ?? new NoopLogger();
  }
  static [entityKind] = "NeonHttpSession";
  clientQuery;
  logger;
  prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper) {
    return new NeonHttpPreparedQuery(
      this.client,
      query,
      this.logger,
      fields,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  async batch(queries) {
    const preparedQueries = [];
    const builtQueries = [];
    for (const query of queries) {
      const preparedQuery = query._prepare();
      const builtQuery = preparedQuery.getQuery();
      preparedQueries.push(preparedQuery);
      builtQueries.push(
        this.clientQuery(builtQuery.sql, builtQuery.params, {
          fullResults: true,
          arrayMode: preparedQuery.isResponseInArrayMode()
        })
      );
    }
    const batchResults = await this.client.transaction(builtQueries, queryConfig);
    return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
  }
  // change return type to QueryRows<true>
  async query(query, params) {
    this.logger.logQuery(query, params);
    const result = await this.clientQuery(query, params, { arrayMode: true, fullResults: true });
    return result;
  }
  // change return type to QueryRows<false>
  async queryObjects(query, params) {
    return this.clientQuery(query, params, { arrayMode: false, fullResults: true });
  }
  /** @internal */
  async count(sql2, token) {
    const res = await this.execute(sql2, token);
    return Number(
      res["rows"][0]["count"]
    );
  }
  async transaction(_transaction, _config = {}) {
    throw new Error("No transactions support in neon-http driver");
  }
};
var NeonTransaction = class extends PgTransaction {
  static [entityKind] = "NeonHttpTransaction";
  async transaction(_transaction) {
    throw new Error("No transactions support in neon-http driver");
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.41.0_@cloudflare+workers-types@4.20260317.1_@libsql+client@0.17.2_@neondatabase+serverless@1.2.0_gel@2.2.0/node_modules/drizzle-orm/neon-http/driver.js
var NeonHttpDriver = class {
  constructor(client, dialect, options = {}) {
    this.client = client;
    this.dialect = dialect;
    this.options = options;
    this.initMappers();
  }
  static [entityKind] = "NeonHttpDriver";
  createSession(schema) {
    return new NeonHttpSession(this.client, this.dialect, schema, { logger: this.options.logger });
  }
  initMappers() {
    export_types.setTypeParser(export_types.builtins.TIMESTAMPTZ, (val) => val);
    export_types.setTypeParser(export_types.builtins.TIMESTAMP, (val) => val);
    export_types.setTypeParser(export_types.builtins.DATE, (val) => val);
    export_types.setTypeParser(export_types.builtins.INTERVAL, (val) => val);
    export_types.setTypeParser(1231, (val) => val);
    export_types.setTypeParser(1115, (val) => val);
    export_types.setTypeParser(1185, (val) => val);
    export_types.setTypeParser(1187, (val) => val);
    export_types.setTypeParser(1182, (val) => val);
  }
};
function wrap(target, token, cb, deep) {
  return new Proxy(target, {
    get(target2, p2) {
      const element = target2[p2];
      if (typeof element !== "function" && (typeof element !== "object" || element === null))
        return element;
      if (deep)
        return wrap(element, token, cb);
      if (p2 === "query")
        return wrap(element, token, cb, true);
      return new Proxy(element, {
        apply(target3, thisArg, argArray) {
          const res = target3.call(thisArg, ...argArray);
          if (typeof res === "object" && res !== null && "setToken" in res && typeof res.setToken === "function") {
            res.setToken(token);
          }
          return cb(target3, p2, res);
        }
      });
    }
  });
}
var NeonHttpDatabase = class extends PgDatabase {
  static [entityKind] = "NeonHttpDatabase";
  $withAuth(token) {
    this.authToken = token;
    return wrap(this, token, (target, p2, res) => {
      if (p2 === "with") {
        return wrap(res, token, (_, __, res2) => res2);
      }
      return res;
    });
  }
  async batch(batch) {
    return this.session.batch(batch);
  }
};
function construct(client, config = {}) {
  const dialect = new PgDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const driver = new NeonHttpDriver(client, dialect, { logger });
  const session = driver.createSession(schema);
  const db2 = new NeonHttpDatabase(
    dialect,
    session,
    schema
  );
  db2.$client = client;
  return db2;
}
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = ys(params[0]);
    return construct(instance, params[1]);
  }
  if (isConfig(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client)
      return construct(client, drizzleConfig);
    if (typeof connection === "object") {
      const { connectionString, ...options } = connection;
      const instance2 = ys(connectionString, options);
      return construct(instance2, drizzleConfig);
    }
    const instance = ys(connection);
    return construct(instance, drizzleConfig);
  }
  return construct(params[0], params[1]);
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  articles: () => articles,
  feeds: () => feeds,
  folders: () => folders,
  users: () => users
});
var users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull()
    // Scoping uniques are per-user: two users may share a folder name or a feed URL.
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)]
);
var folders = pgTable(
  "folders",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull()
  },
  (table) => [uniqueIndex("folders_user_id_name_unique").on(table.userId, table.name)]
);
var feeds = pgTable(
  "feeds",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    url: text("url").notNull(),
    title: text("title"),
    siteUrl: text("site_url"),
    description: text("description"),
    imageUrl: text("image_url"),
    folderId: text("folder_id").references(() => folders.id, { onDelete: "set null" }),
    lastFetchedAt: bigint("last_fetched_at", { mode: "number" }),
    createdAt: bigint("created_at", { mode: "number" }).notNull()
  },
  (table) => [
    uniqueIndex("feeds_user_id_url_unique").on(table.userId, table.url),
    index("idx_feeds_user_id").on(table.userId)
  ]
);
var articles = pgTable(
  "articles",
  {
    id: text("id").primaryKey(),
    feedId: text("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    title: text("title"),
    summary: text("summary"),
    content: text("content"),
    publishedAt: bigint("published_at", { mode: "number" }),
    read: integer("read").notNull().default(0),
    createdAt: bigint("created_at", { mode: "number" }).notNull()
  },
  (table) => [
    uniqueIndex("articles_feed_id_url_unique").on(table.feedId, table.url),
    index("idx_articles_feed_id").on(table.feedId),
    index("idx_articles_read").on(table.read),
    index("idx_articles_published_at").on(table.publishedAt)
  ]
);

// src/db/client.ts
var db;
function getDb() {
  if (!db) {
    const url = (process.env.DATABASE_URL ?? "").trim();
    if (!url) {
      throw new Error("DATABASE_URL is not set. Set it to a Neon postgresql:// connection string.");
    }
    db = drizzle(ys(url), { schema: schema_exports });
  }
  return db;
}

// src/lib/auth.ts
var import_node_crypto = require("node:crypto");

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = (cookie, name) => {
  if (name && cookie.indexOf(name) === -1) {
    return {};
  }
  const pairs = cookie.trim().split(";");
  const parsedCookie = {};
  for (let pairStr of pairs) {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      continue;
    }
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      continue;
    }
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = cookieValue.indexOf("%") !== -1 ? tryDecode(cookieValue, decodeURIComponent_) : cookieValue;
      if (name) {
        break;
      }
    }
  }
  return parsedCookie;
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/helper/cookie/index.js
var getCookie = (c, key, prefix) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    let finalKey = key;
    if (prefix === "secure") {
      finalKey = "__Secure-" + key;
    } else if (prefix === "host") {
      finalKey = "__Host-" + key;
    }
    const obj2 = parse(cookie, finalKey);
    return obj2[finalKey];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/helper/factory/index.js
var createMiddleware = (middleware) => middleware;

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/encode.js
var decodeBase64Url = (str2) => {
  return decodeBase64(str2.replace(/_|-/g, (m) => ({ _: "/", "-": "+" })[m] ?? m));
};
var encodeBase64Url = (buf) => encodeBase64(buf).replace(/\/|\+/g, (m) => ({ "/": "_", "+": "-" })[m] ?? m);
var encodeBase64 = (buf) => {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0, len = bytes.length; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
var decodeBase64 = (str2) => {
  const binary = atob(str2);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  const half = binary.length / 2;
  for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
    bytes[i] = binary.charCodeAt(i);
    bytes[j] = binary.charCodeAt(j);
  }
  return bytes;
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/jwt/jwa.js
var AlgorithmTypes = /* @__PURE__ */ ((AlgorithmTypes2) => {
  AlgorithmTypes2["HS256"] = "HS256";
  AlgorithmTypes2["HS384"] = "HS384";
  AlgorithmTypes2["HS512"] = "HS512";
  AlgorithmTypes2["RS256"] = "RS256";
  AlgorithmTypes2["RS384"] = "RS384";
  AlgorithmTypes2["RS512"] = "RS512";
  AlgorithmTypes2["PS256"] = "PS256";
  AlgorithmTypes2["PS384"] = "PS384";
  AlgorithmTypes2["PS512"] = "PS512";
  AlgorithmTypes2["ES256"] = "ES256";
  AlgorithmTypes2["ES384"] = "ES384";
  AlgorithmTypes2["ES512"] = "ES512";
  AlgorithmTypes2["EdDSA"] = "EdDSA";
  return AlgorithmTypes2;
})(AlgorithmTypes || {});

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/helper/adapter/index.js
var knownUserAgents = {
  deno: "Deno",
  bun: "Bun",
  workerd: "Cloudflare-Workers",
  node: "Node.js"
};
var getRuntimeKey = () => {
  const global = globalThis;
  const userAgentSupported = typeof navigator !== "undefined" && typeof navigator.userAgent === "string";
  if (userAgentSupported) {
    for (const [runtimeKey, userAgent] of Object.entries(knownUserAgents)) {
      if (checkUserAgentEquals(userAgent)) {
        return runtimeKey;
      }
    }
  }
  if (typeof global?.EdgeRuntime === "string") {
    return "edge-light";
  }
  if (global?.fastly !== void 0) {
    return "fastly";
  }
  if (global?.process?.release?.name === "node") {
    return "node";
  }
  return "other";
};
var checkUserAgentEquals = (platform) => {
  const userAgent = navigator.userAgent;
  return userAgent.startsWith(platform);
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/jwt/types.js
var JwtAlgorithmNotImplemented = class extends Error {
  constructor(alg) {
    super(`${alg} is not an implemented algorithm`);
    this.name = "JwtAlgorithmNotImplemented";
  }
};
var JwtAlgorithmRequired = class extends Error {
  constructor() {
    super('JWT verification requires "alg" option to be specified');
    this.name = "JwtAlgorithmRequired";
  }
};
var JwtAlgorithmMismatch = class extends Error {
  constructor(expected, actual) {
    super(`JWT algorithm mismatch: expected "${expected}", got "${actual}"`);
    this.name = "JwtAlgorithmMismatch";
  }
};
var JwtTokenInvalid = class extends Error {
  constructor(token) {
    super(`invalid JWT token: ${token}`);
    this.name = "JwtTokenInvalid";
  }
};
var JwtTokenNotBefore = class extends Error {
  constructor(token) {
    super(`token (${token}) is being used before it's valid`);
    this.name = "JwtTokenNotBefore";
  }
};
var JwtTokenExpired = class extends Error {
  constructor(token) {
    super(`token (${token}) expired`);
    this.name = "JwtTokenExpired";
  }
};
var JwtTokenIssuedAt = class extends Error {
  constructor(currentTimestamp, iat) {
    super(
      `Invalid "iat" claim, must be a valid number lower than "${currentTimestamp}" (iat: "${iat}")`
    );
    this.name = "JwtTokenIssuedAt";
  }
};
var JwtTokenIssuer = class extends Error {
  constructor(expected, iss) {
    super(`expected issuer "${expected}", got ${iss ? `"${iss}"` : "none"} `);
    this.name = "JwtTokenIssuer";
  }
};
var JwtHeaderInvalid = class extends Error {
  constructor(header) {
    super(`jwt header is invalid: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderInvalid";
  }
};
var JwtHeaderRequiresKid = class extends Error {
  constructor(header) {
    super(`required "kid" in jwt header: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderRequiresKid";
  }
};
var JwtSymmetricAlgorithmNotAllowed = class extends Error {
  constructor(alg) {
    super(`symmetric algorithm "${alg}" is not allowed for JWK verification`);
    this.name = "JwtSymmetricAlgorithmNotAllowed";
  }
};
var JwtAlgorithmNotAllowed = class extends Error {
  constructor(alg, allowedAlgorithms) {
    super(`algorithm "${alg}" is not in the allowed list: [${allowedAlgorithms.join(", ")}]`);
    this.name = "JwtAlgorithmNotAllowed";
  }
};
var JwtTokenSignatureMismatched = class extends Error {
  constructor(token) {
    super(`token(${token}) signature mismatched`);
    this.name = "JwtTokenSignatureMismatched";
  }
};
var JwtPayloadRequiresAud = class extends Error {
  constructor(payload) {
    super(`required "aud" in jwt payload: ${JSON.stringify(payload)}`);
    this.name = "JwtPayloadRequiresAud";
  }
};
var JwtTokenAudience = class extends Error {
  constructor(expected, aud) {
    super(
      `expected audience "${Array.isArray(expected) ? expected.join(", ") : expected}", got "${aud}"`
    );
    this.name = "JwtTokenAudience";
  }
};
var CryptoKeyUsage = /* @__PURE__ */ ((CryptoKeyUsage2) => {
  CryptoKeyUsage2["Encrypt"] = "encrypt";
  CryptoKeyUsage2["Decrypt"] = "decrypt";
  CryptoKeyUsage2["Sign"] = "sign";
  CryptoKeyUsage2["Verify"] = "verify";
  CryptoKeyUsage2["DeriveKey"] = "deriveKey";
  CryptoKeyUsage2["DeriveBits"] = "deriveBits";
  CryptoKeyUsage2["WrapKey"] = "wrapKey";
  CryptoKeyUsage2["UnwrapKey"] = "unwrapKey";
  return CryptoKeyUsage2;
})(CryptoKeyUsage || {});

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/jwt/utf8.js
var utf8Encoder = new TextEncoder();
var utf8Decoder = new TextDecoder();

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/jwt/jws.js
async function signing(privateKey, alg, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPrivateKey(privateKey, algorithm);
  return await crypto.subtle.sign(algorithm, cryptoKey, data);
}
async function verifying(publicKey, alg, signature, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPublicKey(publicKey, algorithm);
  return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
}
function pemToBinary(pem) {
  return decodeBase64(pem.replace(/-+(BEGIN|END).*/g, "").replace(/\s/g, ""));
}
async function importPrivateKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type !== "private" && key.type !== "secret") {
      throw new Error(
        `unexpected key type: CryptoKey.type is ${key.type}, expected private or secret`
      );
    }
    return key;
  }
  const usages = [CryptoKeyUsage.Sign];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PRIVATE")) {
    return await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
async function importPublicKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type === "public" || key.type === "secret") {
      return key;
    }
    key = await exportPublicJwkFrom(key);
  }
  if (typeof key === "string" && key.includes("PRIVATE")) {
    const privateKey = await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, true, [
      CryptoKeyUsage.Sign
    ]);
    key = await exportPublicJwkFrom(privateKey);
  }
  const usages = [CryptoKeyUsage.Verify];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PUBLIC")) {
    return await crypto.subtle.importKey("spki", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
async function exportPublicJwkFrom(privateKey) {
  if (privateKey.type !== "private") {
    throw new Error(`unexpected key type: ${privateKey.type}`);
  }
  if (!privateKey.extractable) {
    throw new Error("unexpected private key is unextractable");
  }
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);
  const { kty } = jwk;
  const { alg, e, n } = jwk;
  const { crv, x: x2, y: y2 } = jwk;
  return { kty, alg, e, n, crv, x: x2, y: y2, key_ops: [CryptoKeyUsage.Verify] };
}
function getKeyAlgorithm(name) {
  switch (name) {
    case "HS256":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-256"
        }
      };
    case "HS384":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-384"
        }
      };
    case "HS512":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-512"
        }
      };
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-256"
        }
      };
    case "RS384":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-384"
        }
      };
    case "RS512":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-512"
        }
      };
    case "PS256":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256"
        },
        saltLength: 32
        // 256 >> 3
      };
    case "PS384":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-384"
        },
        saltLength: 48
        // 384 >> 3
      };
    case "PS512":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-512"
        },
        saltLength: 64
        // 512 >> 3,
      };
    case "ES256":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-256"
        },
        namedCurve: "P-256"
      };
    case "ES384":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-384"
        },
        namedCurve: "P-384"
      };
    case "ES512":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-512"
        },
        namedCurve: "P-521"
      };
    case "EdDSA":
      return {
        name: "Ed25519",
        namedCurve: "Ed25519"
      };
    default:
      throw new JwtAlgorithmNotImplemented(name);
  }
}
function isCryptoKey(key) {
  const runtime = getRuntimeKey();
  if (runtime === "node" && !!crypto.webcrypto) {
    return key instanceof crypto.webcrypto.CryptoKey;
  }
  return key instanceof CryptoKey;
}

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/jwt/jwt.js
var encodeJwtPart = (part) => encodeBase64Url(utf8Encoder.encode(JSON.stringify(part)).buffer).replace(/=/g, "");
var encodeSignaturePart = (buf) => encodeBase64Url(buf).replace(/=/g, "");
var decodeJwtPart = (part) => JSON.parse(utf8Decoder.decode(decodeBase64Url(part)));
function isTokenHeader(obj) {
  if (typeof obj === "object" && obj !== null) {
    const objWithAlg = obj;
    return "alg" in objWithAlg && Object.values(AlgorithmTypes).includes(objWithAlg.alg) && (!("typ" in objWithAlg) || objWithAlg.typ === "JWT");
  }
  return false;
}
var sign = async (payload, privateKey, alg = "HS256") => {
  const encodedPayload = encodeJwtPart(payload);
  let encodedHeader;
  if (typeof privateKey === "object" && "alg" in privateKey) {
    alg = privateKey.alg;
    encodedHeader = encodeJwtPart({ alg, typ: "JWT", kid: privateKey.kid });
  } else {
    encodedHeader = encodeJwtPart({ alg, typ: "JWT" });
  }
  const partialToken = `${encodedHeader}.${encodedPayload}`;
  const signaturePart = await signing(privateKey, alg, utf8Encoder.encode(partialToken));
  const signature = encodeSignaturePart(signaturePart);
  return `${partialToken}.${signature}`;
};
var verify = async (token, publicKey, algOrOptions) => {
  if (!algOrOptions) {
    throw new JwtAlgorithmRequired();
  }
  const {
    alg,
    iss,
    nbf = true,
    exp = true,
    iat = true,
    aud
  } = typeof algOrOptions === "string" ? { alg: algOrOptions } : algOrOptions;
  if (!alg) {
    throw new JwtAlgorithmRequired();
  }
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  const { header, payload } = decode(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  if (header.alg !== alg) {
    throw new JwtAlgorithmMismatch(alg, header.alg);
  }
  const now = Math.floor(Date.now() / 1e3);
  if (nbf && payload.nbf && payload.nbf > now) {
    throw new JwtTokenNotBefore(token);
  }
  if (exp && payload.exp && payload.exp <= now) {
    throw new JwtTokenExpired(token);
  }
  if (iat && payload.iat && now < payload.iat) {
    throw new JwtTokenIssuedAt(now, payload.iat);
  }
  if (iss) {
    if (!payload.iss) {
      throw new JwtTokenIssuer(iss, null);
    }
    if (typeof iss === "string" && payload.iss !== iss) {
      throw new JwtTokenIssuer(iss, payload.iss);
    }
    if (iss instanceof RegExp && !iss.test(payload.iss)) {
      throw new JwtTokenIssuer(iss, payload.iss);
    }
  }
  if (aud) {
    if (!payload.aud) {
      throw new JwtPayloadRequiresAud(payload);
    }
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    const matched = audiences.some(
      (payloadAud) => aud instanceof RegExp ? aud.test(payloadAud) : typeof aud === "string" ? payloadAud === aud : Array.isArray(aud) && aud.includes(payloadAud)
    );
    if (!matched) {
      throw new JwtTokenAudience(aud, payload.aud);
    }
  }
  const headerPayload = token.substring(0, token.lastIndexOf("."));
  const verified = await verifying(
    publicKey,
    alg,
    decodeBase64Url(tokenParts[2]),
    utf8Encoder.encode(headerPayload)
  );
  if (!verified) {
    throw new JwtTokenSignatureMismatched(token);
  }
  return payload;
};
var symmetricAlgorithms = [
  AlgorithmTypes.HS256,
  AlgorithmTypes.HS384,
  AlgorithmTypes.HS512
];
var verifyWithJwks = async (token, options, init) => {
  const verifyOpts = options.verification || {};
  const header = decodeHeader(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  if (!header.kid) {
    throw new JwtHeaderRequiresKid(header);
  }
  if (symmetricAlgorithms.includes(header.alg)) {
    throw new JwtSymmetricAlgorithmNotAllowed(header.alg);
  }
  if (!options.allowedAlgorithms.includes(header.alg)) {
    throw new JwtAlgorithmNotAllowed(header.alg, options.allowedAlgorithms);
  }
  let verifyKeys = options.keys ? [...options.keys] : void 0;
  if (options.jwks_uri) {
    const response = await fetch(options.jwks_uri, init);
    if (!response.ok) {
      throw new Error(`failed to fetch JWKS from ${options.jwks_uri}`);
    }
    const data = await response.json();
    if (!data.keys) {
      throw new Error('invalid JWKS response. "keys" field is missing');
    }
    if (!Array.isArray(data.keys)) {
      throw new Error('invalid JWKS response. "keys" field is not an array');
    }
    verifyKeys ??= [];
    verifyKeys.push(...data.keys);
  } else if (!verifyKeys) {
    throw new Error('verifyWithJwks requires options for either "keys" or "jwks_uri" or both');
  }
  const matchingKey = verifyKeys.find((key) => key.kid === header.kid);
  if (!matchingKey) {
    throw new JwtTokenInvalid(token);
  }
  if (matchingKey.alg && matchingKey.alg !== header.alg) {
    throw new JwtAlgorithmMismatch(matchingKey.alg, header.alg);
  }
  return await verify(token, matchingKey, {
    alg: header.alg,
    ...verifyOpts
  });
};
var decode = (token) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  try {
    const header = decodeJwtPart(parts[0]);
    const payload = decodeJwtPart(parts[1]);
    return {
      header,
      payload
    };
  } catch {
    throw new JwtTokenInvalid(token);
  }
};
var decodeHeader = (token) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  try {
    return decodeJwtPart(parts[0]);
  } catch {
    throw new JwtTokenInvalid(token);
  }
};

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/utils/jwt/index.js
var Jwt = { sign, verify, decode, verifyWithJwks };

// ../../node_modules/.pnpm/hono@4.12.9/node_modules/hono/dist/middleware/jwt/jwt.js
var verifyWithJwks2 = Jwt.verifyWithJwks;
var verify2 = Jwt.verify;
var decode2 = Jwt.decode;
var sign2 = Jwt.sign;

// src/lib/auth.ts
var SESSION_COOKIE = "reed_session";
var SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
function hashPassword(password) {
  const salt = (0, import_node_crypto.randomBytes)(16);
  const hash = (0, import_node_crypto.scryptSync)(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}
function verifyPassword(password, stored) {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  try {
    const expected = Buffer.from(hashHex, "hex");
    const actual = (0, import_node_crypto.scryptSync)(password, Buffer.from(saltHex, "hex"), expected.length);
    return (0, import_node_crypto.timingSafeEqual)(actual, expected);
  } catch {
    return false;
  }
}
function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set \u2014 cannot issue or verify sessions");
  }
  return secret;
}
async function createSessionToken(userId) {
  return sign2(
    { sub: userId, exp: Math.floor(Date.now() / 1e3) + SESSION_TTL_SECONDS },
    authSecret(),
    "HS256"
  );
}
var requireAuth = createMiddleware(async (c, next) => {
  const token = getCookie(c, SESSION_COOKIE) ?? c.req.header("authorization")?.slice("Bearer ".length);
  if (!token) return c.json({ error: "Unauthorized" }, 401);
  try {
    const payload = await verify2(token, authSecret(), "HS256");
    if (typeof payload.sub !== "string") throw new Error("no subject");
    c.set("userId", payload.sub);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});
function setSessionCookie(c, token) {
  c.header(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`
  );
}
function clearSessionCookie(c) {
  c.header("Set-Cookie", `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
}

// src/worker/routes/auth.ts
var authRouter = new Hono2();
var LEGACY_USER_ID = "legacy";
function parseCredentials(body) {
  const record = body;
  const email = record?.email;
  const password = record?.password;
  if (typeof email !== "string" || typeof password !== "string") return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return { email: email.trim().toLowerCase(), password };
}
async function jsonBody(c) {
  try {
    return await c.req.json();
  } catch {
    return null;
  }
}
function authConfigured() {
  return Boolean(process.env.AUTH_SECRET);
}
authRouter.post("/register", async (c) => {
  if (!authConfigured()) {
    return c.json({ error: "AUTH_SECRET is not set on the server" }, 503);
  }
  const body = await jsonBody(c);
  if (body === null) return c.json({ error: "Invalid JSON body" }, 400);
  const requiredCode = process.env.SIGNUP_CODE;
  if (requiredCode && body["code"] !== requiredCode) {
    return c.json({ error: "Invalid invite code" }, 403);
  }
  const credentials = parseCredentials(body);
  if (!credentials) return c.json({ error: "Valid email and password are required" }, 400);
  if (credentials.password.length < 8) {
    return c.json({ error: "Password must be at least 8 characters" }, 400);
  }
  const db2 = c.get("db");
  const id = crypto.randomUUID();
  const token = await createSessionToken(id);
  try {
    await db2.insert(users).values({
      id,
      email: credentials.email,
      passwordHash: hashPassword(credentials.password),
      createdAt: Date.now()
    });
  } catch (err) {
    if (err instanceof Error && /UNIQUE|duplicate key/i.test(err.message)) {
      return c.json({ error: "Email already registered" }, 409);
    }
    throw err;
  }
  await db2.update(folders).set({ userId: id }).where(eq(folders.userId, LEGACY_USER_ID));
  await db2.update(feeds).set({ userId: id }).where(eq(feeds.userId, LEGACY_USER_ID));
  setSessionCookie(c, token);
  return c.json({ id, email: credentials.email }, 201);
});
authRouter.post("/login", async (c) => {
  if (!authConfigured()) {
    return c.json({ error: "AUTH_SECRET is not set on the server" }, 503);
  }
  const body = await jsonBody(c);
  if (body === null) return c.json({ error: "Invalid JSON body" }, 400);
  const credentials = parseCredentials(body);
  if (!credentials) return c.json({ error: "Invalid email or password" }, 401);
  const db2 = c.get("db");
  const rows = await db2.select({ id: users.id, passwordHash: users.passwordHash }).from(users).where(eq(users.email, credentials.email)).limit(1);
  const user = rows[0];
  if (!user || !verifyPassword(credentials.password, user.passwordHash)) {
    return c.json({ error: "Invalid email or password" }, 401);
  }
  const token = await createSessionToken(user.id);
  setSessionCookie(c, token);
  return c.json({ id: user.id, email: credentials.email });
});
authRouter.post("/logout", (c) => {
  clearSessionCookie(c);
  return c.json({ ok: true });
});
authRouter.get("/me", requireAuth, async (c) => {
  const userId = c.get("userId");
  const db2 = c.get("db");
  const rows = await db2.select({ id: users.id, email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
  const user = rows[0];
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  return c.json(user);
});

// src/lib/refresh.ts
var import_node_net = require("node:net");
var import_promises = require("node:dns/promises");

// src/lib/parse.ts
var import_fast_xml_parser = __toESM(require_fxp(), 1);
var parser = new import_fast_xml_parser.XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (name) => ["item", "entry"].includes(name),
  // Raise entity expansion limit — default of 1000 is too low for feeds with
  // rich content:encoded fields containing many escaped HTML entities.
  processEntities: { maxTotalExpansions: 1e5 }
});
function parseFeed(xml) {
  let parsed;
  try {
    parsed = parser.parse(xml);
  } catch {
    return null;
  }
  if (isRss(parsed)) {
    return parseRss(parsed);
  }
  if (isAtom(parsed)) {
    return parseAtom(parsed);
  }
  return null;
}
function isRss(parsed) {
  const rss = parsed["rss"];
  return rss !== void 0;
}
function parseRss(parsed) {
  const rss = parsed["rss"];
  const channel = rss["channel"];
  const image = channel["image"];
  const meta = {
    title: str(channel["title"]),
    siteUrl: str(channel["link"]),
    description: str(channel["description"]),
    imageUrl: image ? str(image["url"]) : null
  };
  const items = arr(channel["item"]);
  const articles2 = items.map((item) => {
    const i = item;
    return {
      url: str(i["link"]) ?? str(i["guid"]) ?? "",
      title: str(i["title"]),
      summary: str(i["description"]),
      content: str(i["content:encoded"]),
      publishedAt: parseDate(str(i["pubDate"]))
    };
  }).filter((a2) => a2.url !== "");
  return { meta, articles: articles2 };
}
function isAtom(parsed) {
  const feed = parsed["feed"];
  return feed !== void 0;
}
function parseAtom(parsed) {
  const feed = parsed["feed"];
  const meta = {
    title: str(atomText(feed["title"])),
    siteUrl: atomLink(feed["link"], "alternate") ?? atomLink(feed["link"], null),
    description: str(atomText(feed["subtitle"])),
    imageUrl: str(feed["icon"]) ?? str(feed["logo"])
  };
  const entries = arr(feed["entry"]);
  const articles2 = entries.map((entry) => {
    const e = entry;
    const url = atomLink(e["link"], "alternate") ?? atomLink(e["link"], null) ?? str(e["id"]) ?? "";
    return {
      url,
      title: str(atomText(e["title"])),
      summary: str(atomText(e["summary"])),
      content: str(atomText(e["content"])),
      publishedAt: parseDate(str(e["published"]) ?? str(e["updated"]))
    };
  }).filter((a2) => a2.url !== "");
  return { meta, articles: articles2 };
}
function str(val) {
  if (val === null || val === void 0) return null;
  if (typeof val === "string") return val.trim() || null;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    const obj = val;
    if ("#text" in obj) return str(obj["#text"]);
  }
  return null;
}
function arr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}
function parseDate(val) {
  if (!val) return null;
  const ms = Date.parse(val);
  return Number.isNaN(ms) ? null : ms;
}
function atomText(val) {
  if (!val) return null;
  if (typeof val === "string") return val.trim() || null;
  if (typeof val === "object") {
    const obj = val;
    return str(obj["#text"]);
  }
  return null;
}
function atomLink(val, rel) {
  const links = arr(val);
  for (const link of links) {
    const l = link;
    const href = str(l["@_href"]);
    if (!href) continue;
    const linkRel = str(l["@_rel"]);
    if (rel === null) {
      if (linkRel !== "self") return href;
      continue;
    }
    if (linkRel === rel) return href;
  }
  return null;
}

// src/lib/refresh.ts
var FETCH_TIMEOUT_MS = 1e4;
var MAX_RESPONSE_BYTES = 5e6;
var MAX_REDIRECTS = 5;
function assertFetchableUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid feed URL: ${url}`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Feed URL must be http(s): ${url}`);
  }
}
function isPrivateIp(ip) {
  if (ip.includes(":")) {
    const v6 = ip.toLowerCase();
    if (v6 === "::" || v6 === "::1") return true;
    if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
    return /^(f[cd]|fe[89ab])/.test(v6);
  }
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p2) => Number.isNaN(p2))) return true;
  const [a2, b2] = parts;
  if (a2 === 0 || a2 === 10 || a2 === 127) return true;
  if (a2 === 100 && b2 >= 64 && b2 <= 127) return true;
  if (a2 === 169 && b2 === 254) return true;
  if (a2 === 172 && b2 >= 16 && b2 <= 31) return true;
  if (a2 === 192 && b2 === 168) return true;
  return false;
}
async function assertPublicHost(hostname) {
  const addresses = (0, import_node_net.isIP)(hostname) ? [hostname] : (await (0, import_promises.lookup)(hostname, { all: true })).map((a2) => a2.address);
  if (addresses.some(isPrivateIp)) {
    throw new Error(`Refusing to fetch private address for ${hostname}`);
  }
}
async function readBodyWithLimit(response, url) {
  const declared = Number(response.headers.get("content-length") ?? 0);
  if (declared > MAX_RESPONSE_BYTES) {
    throw new Error(`Feed response from ${url} exceeds ${MAX_RESPONSE_BYTES} byte limit`);
  }
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let text2 = "";
  let total = 0;
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error(`Feed response from ${url} exceeds ${MAX_RESPONSE_BYTES} byte limit`);
    }
    text2 += decoder.decode(value, { stream: true });
  }
  return text2 + decoder.decode();
}
async function fetchFeedXml(url) {
  let target = url;
  for (let hop = 0; ; hop++) {
    assertFetchableUrl(target);
    await assertPublicHost(new URL(target).hostname);
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*"
      },
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel();
      if (hop >= MAX_REDIRECTS) {
        throw new Error(`Too many redirects fetching ${url}`);
      }
      target = new URL(location, target).href;
      continue;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch feed ${target}: ${response.status} ${response.statusText}`);
    }
    return readBodyWithLimit(response, target);
  }
}
async function refreshFeed(feedId, db2) {
  const feedRows = await db2.select().from(feeds).where(eq(feeds.id, feedId)).limit(1);
  const feed = feedRows[0];
  if (!feed) {
    throw new Error(`Feed not found: ${feedId}`);
  }
  const xml = await fetchFeedXml(feed.url);
  const parsed = parseFeed(xml);
  if (!parsed) {
    throw new Error(`Failed to parse feed ${feed.url}: unrecognized format`);
  }
  await db2.update(feeds).set({
    title: parsed.meta.title ?? feed.title,
    siteUrl: parsed.meta.siteUrl ?? feed.siteUrl,
    description: parsed.meta.description ?? feed.description,
    imageUrl: parsed.meta.imageUrl ?? feed.imageUrl,
    lastFetchedAt: Date.now()
  }).where(eq(feeds.id, feedId));
  let added = 0;
  let updated = 0;
  for (const article of parsed.articles) {
    if (!article.url) continue;
    const existingRows = await db2.select({ id: articles.id }).from(articles).where(and(eq(articles.feedId, feedId), eq(articles.url, article.url))).limit(1);
    const existing = existingRows[0];
    if (!existing) {
      await db2.insert(articles).values({
        id: crypto.randomUUID(),
        feedId,
        url: article.url,
        title: article.title,
        summary: article.summary,
        content: article.content,
        publishedAt: article.publishedAt,
        createdAt: Date.now()
      });
      added++;
    } else {
      await db2.update(articles).set({
        title: article.title,
        summary: article.summary,
        content: article.content,
        publishedAt: article.publishedAt
      }).where(eq(articles.id, existing.id));
      updated++;
    }
  }
  return { added, updated };
}

// src/worker/routes/feeds.ts
var feedsRouter = new Hono2();
feedsRouter.use("*", requireAuth);
feedsRouter.get("/", async (c) => {
  const db2 = c.get("db");
  const rows = await db2.select().from(feeds).where(eq(feeds.userId, c.get("userId"))).orderBy(feeds.createdAt);
  return c.json(rows);
});
feedsRouter.post("/", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  const feedUrl = body?.url;
  if (typeof feedUrl !== "string" || !feedUrl.trim()) {
    return c.json({ error: "url is required" }, 400);
  }
  try {
    assertFetchableUrl(feedUrl.trim());
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : "Invalid URL" }, 400);
  }
  const db2 = c.get("db");
  const userId = c.get("userId");
  const existing = await db2.select({ id: feeds.id }).from(feeds).where(and(eq(feeds.userId, userId), eq(feeds.url, feedUrl.trim()))).limit(1);
  if (existing.length > 0) {
    return c.json({ error: "Feed URL already exists" }, 409);
  }
  const id = crypto.randomUUID();
  try {
    await db2.insert(feeds).values({
      id,
      userId,
      url: feedUrl.trim(),
      createdAt: Date.now()
    });
  } catch (err) {
    if (err instanceof Error && /UNIQUE|duplicate key/i.test(err.message)) {
      return c.json({ error: "Feed URL already exists" }, 409);
    }
    throw err;
  }
  const created = await db2.select().from(feeds).where(eq(feeds.id, id)).limit(1);
  return c.json(created[0], 201);
});
feedsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const db2 = c.get("db");
  const existing = await db2.select({ id: feeds.id }).from(feeds).where(and(eq(feeds.id, id), eq(feeds.userId, c.get("userId")))).limit(1);
  if (existing.length === 0) {
    return c.json({ error: "Feed not found" }, 404);
  }
  await db2.delete(articles).where(eq(articles.feedId, id));
  await db2.delete(feeds).where(eq(feeds.id, id));
  return new Response(null, { status: 204 });
});
feedsRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  const folderId = body?.folderId;
  if (folderId !== null && typeof folderId !== "string") {
    return c.json({ error: "folderId (string | null) is required" }, 400);
  }
  const db2 = c.get("db");
  const userId = c.get("userId");
  const existing = await db2.select({ id: feeds.id }).from(feeds).where(and(eq(feeds.id, id), eq(feeds.userId, userId))).limit(1);
  if (existing.length === 0) {
    return c.json({ error: "Feed not found" }, 404);
  }
  if (folderId !== null) {
    const folder = await db2.select({ id: folders.id }).from(folders).where(and(eq(folders.id, folderId), eq(folders.userId, userId))).limit(1);
    if (folder.length === 0) {
      return c.json({ error: "Folder not found" }, 404);
    }
  }
  await db2.update(feeds).set({ folderId }).where(eq(feeds.id, id));
  const updated = await db2.select().from(feeds).where(eq(feeds.id, id)).limit(1);
  return c.json(updated[0]);
});
feedsRouter.post("/:id/refresh", async (c) => {
  const id = c.req.param("id");
  const db2 = c.get("db");
  const existing = await db2.select({ id: feeds.id }).from(feeds).where(and(eq(feeds.id, id), eq(feeds.userId, c.get("userId")))).limit(1);
  if (existing.length === 0) {
    return c.json({ error: "Feed not found" }, 404);
  }
  try {
    const result = await refreshFeed(id, db2);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refresh failed";
    return c.json({ error: message }, 502);
  }
});

// src/worker/routes/articles.ts
var articlesRouter = new Hono2();
articlesRouter.use("*", requireAuth);
articlesRouter.get("/", async (c) => {
  const db2 = c.get("db");
  const feedId = c.req.query("feed_id");
  const folderId = c.req.query("folder_id");
  const unread = c.req.query("unread");
  const q = c.req.query("q")?.trim();
  const conditions = [
    // Every view is scoped to the session user's feeds
    inArray(
      articles.feedId,
      db2.select({ id: feeds.id }).from(feeds).where(eq(feeds.userId, c.get("userId")))
    )
  ];
  if (q) {
    for (const token of q.split(/\s+/)) {
      const pattern = `%${token.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
      conditions.push(
        or(
          ilike(articles.title, pattern),
          ilike(articles.summary, pattern),
          ilike(articles.content, pattern)
        )
      );
    }
  }
  if (feedId) conditions.push(eq(articles.feedId, feedId));
  if (folderId) {
    conditions.push(
      inArray(
        articles.feedId,
        db2.select({ id: feeds.id }).from(feeds).where(eq(feeds.folderId, folderId))
      )
    );
  }
  if (unread === "true") conditions.push(eq(articles.read, 0));
  const rows = await db2.select({
    id: articles.id,
    feedId: articles.feedId,
    url: articles.url,
    title: articles.title,
    summary: articles.summary,
    publishedAt: articles.publishedAt,
    read: articles.read,
    createdAt: articles.createdAt
  }).from(articles).where(and(...conditions)).orderBy(desc(articles.publishedAt));
  return c.json(rows);
});
articlesRouter.get("/:id", async (c) => {
  const db2 = c.get("db");
  const rows = await db2.select({ article: articles }).from(articles).innerJoin(feeds, eq(articles.feedId, feeds.id)).where(and(eq(articles.id, c.req.param("id")), eq(feeds.userId, c.get("userId")))).limit(1);
  const row = rows[0];
  if (!row) {
    return c.json({ error: "Article not found" }, 404);
  }
  return c.json(row.article);
});
articlesRouter.post("/read-all", async (c) => {
  const db2 = c.get("db");
  let body = {};
  try {
    body = await c.req.json();
  } catch {
  }
  const feedId = body?.feedId;
  if (feedId !== void 0 && typeof feedId !== "string") {
    return c.json({ error: "feedId must be a string" }, 400);
  }
  const ownFeeds = inArray(
    articles.feedId,
    db2.select({ id: feeds.id }).from(feeds).where(eq(feeds.userId, c.get("userId")))
  );
  const result = await db2.update(articles).set({ read: 1 }).where(
    feedId ? and(eq(articles.read, 0), eq(articles.feedId, feedId), ownFeeds) : and(eq(articles.read, 0), ownFeeds)
  );
  return c.json({ marked: result.rowCount ?? 0 });
});
articlesRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const db2 = c.get("db");
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  const read = body?.read;
  if (typeof read !== "boolean") {
    return c.json({ error: "read (boolean) is required" }, 400);
  }
  const existing = await db2.select({ id: articles.id }).from(articles).innerJoin(feeds, eq(articles.feedId, feeds.id)).where(and(eq(articles.id, id), eq(feeds.userId, c.get("userId")))).limit(1);
  if (existing.length === 0) {
    return c.json({ error: "Article not found" }, 404);
  }
  await db2.update(articles).set({ read: read ? 1 : 0 }).where(eq(articles.id, id));
  const updated = await db2.select().from(articles).where(eq(articles.id, id)).limit(1);
  return c.json(updated[0]);
});

// src/worker/routes/folders.ts
var foldersRouter = new Hono2();
foldersRouter.use("*", requireAuth);
function parseName(body) {
  const name = body?.name;
  return typeof name === "string" && name.trim() ? name.trim() : null;
}
foldersRouter.get("/", async (c) => {
  const db2 = c.get("db");
  const rows = await db2.select().from(folders).where(eq(folders.userId, c.get("userId"))).orderBy(folders.createdAt);
  return c.json(rows);
});
foldersRouter.post("/", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  const name = parseName(body);
  if (!name) {
    return c.json({ error: "name is required" }, 400);
  }
  const db2 = c.get("db");
  const userId = c.get("userId");
  const existing = await db2.select({ id: folders.id }).from(folders).where(and(eq(folders.userId, userId), eq(folders.name, name))).limit(1);
  if (existing.length > 0) {
    return c.json({ error: "Folder name already exists" }, 409);
  }
  const id = crypto.randomUUID();
  await db2.insert(folders).values({ id, userId, name, createdAt: Date.now() });
  const created = await db2.select().from(folders).where(eq(folders.id, id)).limit(1);
  return c.json(created[0], 201);
});
foldersRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  const name = parseName(body);
  if (!name) {
    return c.json({ error: "name is required" }, 400);
  }
  const db2 = c.get("db");
  const userId = c.get("userId");
  const existing = await db2.select({ id: folders.id }).from(folders).where(and(eq(folders.id, id), eq(folders.userId, userId))).limit(1);
  if (existing.length === 0) {
    return c.json({ error: "Folder not found" }, 404);
  }
  const duplicate = await db2.select({ id: folders.id }).from(folders).where(and(eq(folders.userId, userId), eq(folders.name, name))).limit(1);
  if (duplicate[0] && duplicate[0].id !== id) {
    return c.json({ error: "Folder name already exists" }, 409);
  }
  await db2.update(folders).set({ name }).where(eq(folders.id, id));
  const updated = await db2.select().from(folders).where(eq(folders.id, id)).limit(1);
  return c.json(updated[0]);
});
foldersRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const db2 = c.get("db");
  const existing = await db2.select({ id: folders.id }).from(folders).where(and(eq(folders.id, id), eq(folders.userId, c.get("userId")))).limit(1);
  if (existing.length === 0) {
    return c.json({ error: "Folder not found" }, 404);
  }
  await db2.delete(folders).where(eq(folders.id, id));
  return new Response(null, { status: 204 });
});

// src/lib/opml.ts
var import_fast_xml_parser2 = __toESM(require_fxp(), 1);
var parser2 = new import_fast_xml_parser2.XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // Match the feed parser's expansion cap — subscription lists with lots of
  // escaped HTML in titles shouldn't fail the 10k default.
  processEntities: { maxTotalExpansions: 1e5 }
});
function toArray(value) {
  if (value === void 0 || value === null) return [];
  if (Array.isArray(value)) return value;
  return [value];
}
function collectOutlines(nodes, folder, out) {
  for (const node of nodes) {
    const xmlUrl = node["@_xmlUrl"];
    if (typeof xmlUrl === "string" && xmlUrl.trim()) {
      const text3 = node["@_text"] ?? node["@_title"];
      out.push({
        url: xmlUrl.trim(),
        title: typeof text3 === "string" && text3.trim() ? text3.trim() : null,
        folder
      });
      continue;
    }
    const text2 = node["@_text"] ?? node["@_title"];
    const name = typeof text2 === "string" && text2.trim() ? text2.trim() : folder;
    collectOutlines(toArray(node["outline"]), name, out);
  }
}
function parseOpml(xml) {
  let parsed;
  try {
    parsed = parser2.parse(xml);
  } catch {
    return null;
  }
  const opml = parsed["opml"];
  if (!opml) return null;
  const head = opml["head"];
  const headTitle = head?.["title"];
  const feeds2 = [];
  const body = opml["body"];
  collectOutlines(toArray(body?.["outline"]), null, feeds2);
  return {
    title: typeof headTitle === "string" ? headTitle : null,
    feeds: feeds2
  };
}
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function buildOpml(data) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<opml version="2.0">',
    "  <head>",
    `    <title>${esc(data.title ?? "Reed subscriptions")}</title>`,
    "  </head>",
    "  <body>"
  ];
  const uncategorized = data.feeds.filter((f) => f.folder === null);
  const folders2 = [
    ...new Set(data.feeds.map((f) => f.folder).filter((f) => f !== null))
  ];
  for (const feed of uncategorized) {
    lines.push(
      `    <outline type="rss" text="${esc(feed.title ?? feed.url)}" xmlUrl="${esc(feed.url)}" />`
    );
  }
  for (const folder of folders2) {
    lines.push(`    <outline text="${esc(folder)}">`);
    for (const feed of data.feeds.filter((f) => f.folder === folder)) {
      lines.push(
        `      <outline type="rss" text="${esc(feed.title ?? feed.url)}" xmlUrl="${esc(feed.url)}" />`
      );
    }
    lines.push("    </outline>");
  }
  lines.push("  </body>", "</opml>", "");
  return lines.join("\n");
}

// src/worker/routes/opml.ts
var opmlRouter = new Hono2();
opmlRouter.use("*", requireAuth);
opmlRouter.get("/", async (c) => {
  const db2 = c.get("db");
  const userId = c.get("userId");
  const [folderRows, feedRows] = await Promise.all([
    db2.select().from(folders).where(eq(folders.userId, userId)),
    db2.select().from(feeds).where(eq(feeds.userId, userId))
  ]);
  const folderNames = new Map(folderRows.map((f) => [f.id, f.name]));
  const xml = buildOpml({
    title: "Reed subscriptions",
    feeds: feedRows.map((f) => ({
      url: f.url,
      title: f.title,
      folder: f.folderId ? folderNames.get(f.folderId) ?? null : null
    }))
  });
  return new Response(xml, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Content-Disposition": 'attachment; filename="reed.opml"'
    }
  });
});
opmlRouter.post("/", async (c) => {
  const xml = await c.req.text();
  if (xml.length > 4e6) {
    return c.json({ error: "OPML file too large" }, 413);
  }
  const data = parseOpml(xml);
  if (!data) {
    return c.json({ error: "Invalid OPML file" }, 400);
  }
  if (data.feeds.length === 0) {
    return c.json({ error: "No feeds found in OPML" }, 400);
  }
  const db2 = c.get("db");
  const userId = c.get("userId");
  const existingUrls = new Set(
    (await db2.select({ url: feeds.url }).from(feeds).where(eq(feeds.userId, userId))).map(
      (r) => r.url
    )
  );
  const existingFolders = new Map(
    (await db2.select().from(folders).where(eq(folders.userId, userId))).map((f) => [f.name, f.id])
  );
  let feedsAdded = 0;
  let foldersCreated = 0;
  const feedsSkipped = data.feeds.filter((item) => existingUrls.has(item.url)).length;
  const now = Date.now();
  for (const item of data.feeds) {
    if (existingUrls.has(item.url)) continue;
    let folderId = null;
    if (item.folder) {
      folderId = existingFolders.get(item.folder) ?? null;
      if (!folderId) {
        folderId = crypto.randomUUID();
        await db2.insert(folders).values({ id: folderId, userId, name: item.folder, createdAt: now });
        existingFolders.set(item.folder, folderId);
        foldersCreated++;
      }
    }
    await db2.insert(feeds).values({
      id: crypto.randomUUID(),
      userId,
      url: item.url,
      title: item.title,
      folderId,
      createdAt: now
    });
    existingUrls.add(item.url);
    feedsAdded++;
  }
  return c.json({ feedsAdded, foldersCreated, feedsSkipped });
});

// src/worker/index.ts
function createApp(dbOverride) {
  const app2 = new Hono2();
  app2.use("*", async (c, next) => {
    if (dbOverride) {
      c.set("db", dbOverride);
    } else {
      try {
        c.set("db", getDb());
      } catch {
      }
    }
    await next();
  });
  app2.get("/api/health", async (c) => {
    try {
      const db2 = c.get("db") ?? getDb();
      await db2.execute(sql`SELECT 1`);
      return c.json({ status: "ok", db: "connected" });
    } catch (err) {
      return c.json(
        { status: "degraded", db: err instanceof Error ? err.message : String(err) },
        503
      );
    }
  });
  app2.onError((err, c) => {
    console.error(err);
    return c.json({ error: "Internal server error" }, 500);
  });
  app2.route("/api/auth", authRouter);
  app2.route("/api/feeds", feedsRouter);
  app2.route("/api/folders", foldersRouter);
  app2.route("/api/articles", articlesRouter);
  app2.route("/api/opml", opmlRouter);
  app2.notFound((c) => c.json({ error: "Not found" }, 404));
  return app2;
}

// src/vercel-entry.ts
var app = createApp();
var GET = handle(app);
var POST = handle(app);
var PATCH = handle(app);
var DELETE = handle(app);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DELETE,
  GET,
  PATCH,
  POST
});
/*! Bundled license information:

@neondatabase/serverless/index.mjs:
  (*! Bundled license information:
  
  ieee754/index.js:
    (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  
  buffer/index.js:
    (*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     *)
  *)
*/
