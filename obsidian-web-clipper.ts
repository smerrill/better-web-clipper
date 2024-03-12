import Turndown from "turndown";
import { Readability } from "@mozilla/readability";

/* Optional vault name */
const vault = "";

/* Optional folder name such as "Clippings/" */
const folder = "Clippings/";

/* Optional tags  */
let tags = "clippings";

/* Parse the site's meta keywords content into tags, if present */
/// <reference lib="dom" />

if (document.querySelector('meta[name="keywords" i]')) {
  var keywords = document
    .querySelector('meta[name="keywords" i]')!
    .getAttribute("content")!
    .split(",")!;

  keywords.forEach(function (keyword) {
    let tag = " " + keyword.split(" ").join("");
    tags += tag;
  });
}

function getSelectionHtml() {
  var html = "";
  if (typeof window.getSelection != "undefined") {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var container = document.createElement("div");
      for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      html = container.innerHTML;
    }
  } else if (typeof document.selection != "undefined") {
    if (document.selection.type == "Text") {
      html = document.selection.createRange().htmlText;
    }
  }
  return html;
}

const selection = getSelectionHtml();

const { title, byline, content } = new Readability(
  document.cloneNode(true) as Document
).parse()!;

function getFileName(fileName: string) {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];

  if (windowsPlatforms.indexOf(platform) !== -1) {
    fileName = fileName.replace(/:/g, "").replace(/[/\\?%*|"<>]/g, "-");
  } else {
    fileName = fileName
      .replace(/:/g, "")
      .replace(/\//g, "-")
      .replace(/\\/g, "-");
  }

  fileName = fileName.replace(/\r?\n/g, " ");
  if (fileName.length > 128) {
    fileName = fileName.substring(0, 125) + "...";
  }
  return fileName;
}
const fileName = getFileName(title);

if (selection) {
  var markdownify = selection;
} else {
  var markdownify = content;
}

if (vault) {
  var vaultName = "&vault=" + encodeURIComponent(`${vault}`);
} else {
  var vaultName = "";
}

const markdownBody = new Turndown({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
}).turndown(markdownify);

var date = new Date();

function convertDate(date: Date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth() + 1).toString();
  var dd = date.getDate().toString();
  var mmChars = mm.split("");
  var ddChars = dd.split("");
  return (
    yyyy +
    "-" +
    (mmChars[1] ? mm : "0" + mmChars[0]) +
    "-" +
    (ddChars[1] ? dd : "0" + ddChars[0])
  );
}

const today = convertDate(date);

// Utility function to get meta content by name or property
function getMetaContent(attr: string, value: string) {
  var element = document.querySelector(`meta[${attr}='${value}']`);
  return element ? element.getAttribute("content").trim() : "";
}

// Fetch byline, meta author, property author, or site name
var author =
  byline ||
  getMetaContent("name", "author") ||
  getMetaContent("property", "author") ||
  getMetaContent("property", "og:site_name");

// Check if there's an author and add brackets
var authorBrackets = author ? `"[[${author}]]"` : "";

/* Try to get published date */
var timeElement = document.querySelector("time");
var publishedDate = timeElement ? timeElement.getAttribute("datetime") : "";

if (publishedDate && publishedDate.trim() !== "") {
  var date = new Date(publishedDate);
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1); // Months are 0-based in JavaScript
  var day = String(date.getDate());

  // Pad month and day with leading zeros if necessary
  month = parseInt(month) < 10 ? "0" + month : month;
  day = parseInt(day) < 10 ? "0" + day : day;

  var published = year + "-" + month + "-" + day;
} else {
  var published = "";
}

/* YAML front matter as tags render cleaner with special chars  */
const fileContent =
  "---\n" +
  'category: "[[Clippings]]"\n' +
  "author: " +
  authorBrackets +
  "\n" +
  "title: " +
  JSON.stringify(title.replace(/\r?\n/g, " ")) +
  "\n" +
  "source: " +
  document.URL +
  "\n" +
  "clipped: " +
  today +
  "\n" +
  "published: " +
  published +
  "\n" +
  "topics: \n" +
  "tags: [" +
  tags +
  "]\n" +
  "---\n\n" +
  markdownBody;

document.location.href =
  "obsidian://new?" +
  "file=" +
  encodeURIComponent(folder + fileName) +
  "&content=" +
  encodeURIComponent(fileContent) +
  vaultName;
