// ==UserScript==
// @name         ROK Inf Copier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lemon cake
// @match        https://www.rokinf.com/*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

function run() {
    var node = document.createElement('span');
    node.innerHTML = '<button type="button" class="ant-btn ant-btn-primary" style="margin-left:2px">Copy</button>';
    node.setAttribute('id', 'myCopyButton');
    node.setAttribute('style', "float: left; overflow: hidden;");
    node.setAttribute('class', 'table-page-search-submitButtons');

    var node2 = document.createElement('div');
    node2.innerHTML = '<button type="button" class="ant-btn ant-btn-primary" style="margin-left:2px">Clear</button>';
    node2.setAttribute('id', 'myClearButton');
    node2.setAttribute('style', "float: left; overflow: hidden;");
    node2.setAttribute('class', 'table-page-search-submitButtons');

    var buttonContainer = $('.table-page-search-submitButtons').parent()[0];
    buttonContainer.appendChild(node);
    buttonContainer.appendChild(node2);
    document.getElementById('myCopyButton').addEventListener("click", copyTable, false);
    document.getElementById('myClearButton').addEventListener("click", clearSelection, false);
}

function copyTable() {
    if (document.URL.includes('alliance')) {
        var idx = 2;
        var isAlliance = true;
    } else {
        idx = 3;
    }

    var prevKd = GM_getValue('rokinfkd');
    var curKd = $('.ant-table-tbody')[0].rows[0].cells[idx+1].innerText
    if (prevKd == '') {
        var sameKingdom = true;
        GM_setValue('rokinfkd', curKd);
    } else if (prevKd == curKd) {
        sameKingdom = true;
    } else {
        sameKingdom = false;
        GM_setValue('rokinfkd', curKd);
    }

    var text = '';
    $('.ant-table-tbody')[0].rows.forEach(function(rowData) {
        var power = rowData.cells[idx].innerText;
        text += power + '\n';
    });

    if (!sameKingdom) {
        GM_setValue("rokinfdata", "");
    }
    if (!isAlliance) {
        text = GM_getValue("rokinfdata") + text;
        GM_setValue("rokinfdata", text)
    }

    navigator.clipboard.writeText(text).then(function() {
        if (isAlliance) {
            clearSelection();
        } else {
            $(".ant-pagination-next")[0].click()
        }
        //alert('Copied')
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function clearSelection() {
    $('.ant-select-selection__choice__remove')[0].click();
    setTimeout(function(){
        if($('.ant-select-selection__choice__remove').length) {
            clearSelection();
        }}, 500);
}

(function() {
    'use strict';
    GM_setValue("rokinfdata","");
    GM_setValue("rokinfkd","");
    console.log('rokinf loading');
    setTimeout(run, 1000);
})();
