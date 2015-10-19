function deferedRevenue(request, response) { // initial function called as default function in script

    if (request.getMethod() == 'GET') { // as script is run

        function1();
    } else { // after submit is pushed

        function2();
    }
}

function function1() {

    var form = nlapiCreateForm('Inventory Received / Not Billed');
    form.addField('date_start', 'date', 'Start Date (First day of the month)').setDefaultValue('1/1/2014');
    form.addField('date_end', 'date', 'Due Date (Last day of the month)').setDefaultValue('12/31/2014');
    form.addSubmitButton('Submit');
    response.writePage(form);
}

function function2() {
    logx('timeout check', 'Program Start');

    var setStartDate = new Date(request.getParameter('date_start'));
    var setEndDate = new Date(request.getParameter('date_end'));
    var results = search114(); // Search Account 114
    var poNumbers = getPoNumber(results); // Sort results for Created From field
    var poID = getPoId(results); // Sort results for Internal ID
    var resultsqty = search231(poNumbers); // Search account 321 based on associated invoices
    var w = window;

    logx('timeout check', 'Create Arrays');
    for (var i = 0; i < poNumbers.entity.length; i++) { // Set arrays to be used as data storage

        w["ReceiptTotal" + poNumbers.entity[i]] = Number(0);
        w["ReceiptQty" + poNumbers.entity[i]] = Number(0);
        w["billTotal" + poNumbers.entity[i]] = Number(0);
        w["billQty" + poNumbers.entity[i]] = Number(0);
        w["balance" + poNumbers.entity[i]] = Number(0);
        w["bLineId" + poNumbers.entity[i]] = new Array();
        w["bLineName" + poNumbers.entity[i]] = new Array();
        w["bLineAmt" + poNumbers.entity[i]] = new Array();
        w["bLineRate" + poNumbers.entity[i]] = new Array();
        w["rLineId" + poNumbers.entity[i]] = new Array();
        w["rLineName" + poNumbers.entity[i]] = new Array();
        w["rLineAmt" + poNumbers.entity[i]] = new Array();
        w["rLineRate" + poNumbers.entity[i]] = new Array();
        w["poItems" + poNumbers.entity[i]] = new Array();
        w["poAmt" + poNumbers.entity[i]] = new Array();
        w["poQty" + poNumbers.entity[i]] = Number(0);
        w["poTotal" + poNumbers.entity[i]] = Number(0);
        w["poRate" + poNumbers.entity[i]] = new Array();
        w["poDate" + poNumbers.entity[i]] = null;
    }

    var allPos = posearch(poID); // Get all PO's based on internal IDs from above search
    var sortedResults = splitResults(results); // Sort results in to bills / invoices / journals

    logx('timeout check', 'Loop through all PO');
    for (var x = 0; x < allPos.length; x++) { // Loop through all PO's and record rates for each PO

        try {

            w["poItems" + "Purchase Order #" + allPos[x].getValue('tranid')].push(allPos[x].getValue('itemid', 'item'));
            w["poRate" + "Purchase Order #" + allPos[x].getValue('tranid')].push(allPos[x].getValue('rate'));
            w["poAmt" + "Purchase Order #" + allPos[x].getValue('tranid')].push(allPos[x].getValue('quantity'));
            w["poQty" + "Purchase Order #" + allPos[x].getValue('tranid')] += Math.abs(Number(allPos[x].getValue('quantity')));
            w["poDate" + "Purchase Order #" + allPos[x].getValue('tranid')] = allPos[x].getValue('trandate');

            if (allPos[x].getValue('itemid', 'item') != '') {

                w["poTotal" + "Purchase Order #" + allPos[x].getValue('tranid')] += Math.abs(Number(allPos[x].getValue('amount')));
            }
        } catch (e) {

        }
    }

    logx('timeout check', 'Loop through all bills');
    for (var x = 0; x < sortedResults.bill.length; x++) { // Loop through all bills and record rates

        var iid = Number(0);

        for (var x2 = 0; x2 < w["poItems" + sortedResults.bill[x].getText('createdfrom')].length; x2++) {

            if (Number(iid) != Number(sortedResults.bill[x].getValue('internalid'))) {

                if (w["poItems" + sortedResults.bill[x].getText('createdfrom')][x2] == sortedResults.bill[x].getValue('itemid', 'item')) {

                    w["billTotal" + sortedResults.bill[x].getText('createdfrom')] += Math.abs(Number(sortedResults.bill[x].getValue('amount')));
                    w["billQty" + sortedResults.bill[x].getText('createdfrom')] += Math.abs(Number(sortedResults.bill[x].getValue('quantity')));

                    try {

                        w["bLineName" + sortedResults.bill[x].getText('createdfrom')].push(sortedResults.bill[x].getValue('itemid', 'item'));
                        w["bLineId" + sortedResults.bill[x].getText('createdfrom')].push(sortedResults.bill[x].getValue('internalid'));
                        w["bLineAmt" + sortedResults.bill[x].getText('createdfrom')].push(sortedResults.bill[x].getValue('quantity'));
                        w["bLineRate" + sortedResults.bill[x].getText('createdfrom')].push(sortedResults.bill[x].getValue('rate'));
                        iid = Number(sortedResults.bill[x].getValue('internalid'));
                    } catch (e) {

                    }
                }
            }
        }
    }

    logx('timeout check', 'Loop through all item receipts');
    for (var x = 0; x < sortedResults.Receipt.length; x++) { // Loop through all item Receipts and record rates

        for (var x2 = 0; x2 < w["poItems" + sortedResults.Receipt[x].getText('createdfrom')].length; x2++) {

            if (w["poItems" + sortedResults.Receipt[x].getText('createdfrom')][x2] == sortedResults.Receipt[x].getValue('itemid', 'item')) {

                w["ReceiptTotal" + sortedResults.Receipt[x].getText('createdfrom')] += Number(sortedResults.Receipt[x].getValue('amount'));
            }
        }
    }

    logx('timeout check', 'loop through for quantity');
    for (var x = 0; x < resultsqty.length; x++) { // Loop through all and record receipt quantitiy

        var iid = Number(0);

        try {
            for (var x2 = 0; x2 < w["poItems" + resultsqty[x].getText('createdfrom')].length; x2++) {

                if (Number(iid) != Number(resultsqty[x].getValue('internalid'))) {

                    if (w["poItems" + resultsqty[x].getText('createdfrom')][x2] == resultsqty[x].getValue('itemid', 'item')) {

                        w["ReceiptQty" + resultsqty[x].getText('createdfrom')] += Number(resultsqty[x].getValue('quantity'));

                        try {

                            w["rLineName" + resultsqty[x].getText('createdfrom')].push(resultsqty[x].getValue('itemid', 'item'));
                            w["rLineId" + resultsqty[x].getText('createdfrom')].push(resultsqty[x].getValue('internalid'));
                            w["rLineAmt" + resultsqty[x].getText('createdfrom')].push(resultsqty[x].getValue('quantity'));
                            w["rLineRate" + resultsqty[x].getText('createdfrom')].push(resultsqty[x].getValue('rate'));
                            iid = Number(resultsqty[x].getValue('internalid'));
                        } catch (e) {

                        }
                    }
                }
            }
        } catch (e) {

        }
    }

    logx('timeout check', 'Loop to record balance for variance');
    for (var x = 0; x < poNumbers.entity.length; x++) { // Loop through and record balance for variance

        w["balance" + poNumbers.entity[x]] = Number(w["ReceiptTotal" + poNumbers.entity[x]]) - Number(w["billTotal" + poNumbers.entity[x]]);
    }

    html = '<html>';
    html += '<head>';
    html += '<script src="https://system.netsuite.com/core/media/media.nl?id=2569299&c=449066&h=740ff277c48345befd44&_xt=.js"></script>';
    html += '<link rel="stylesheet" type="text/css" href="https://system.netsuite.com/core/media/media.nl?id=2569197&c=449066&h=6e6c5fa6b6725c4d592e&_xt=.css">';
    html += '</head>';
    html += '<body>';
    html += '<table class="sortable" id="datatable">' +
        '<tr>' +
        '<td>PO Number </td>' +
        '<td>PO Date</td>' +
        '<td>PO</td>' +
        '<td>Receipt</td>' +
        '<td>Bill</td>' +
        '<td>Variance</td>' +
        '</tr>';

    logx('timeout check', 'Loop for printing');
    for (var x = 0; x < poNumbers.entity.length; x++) { // Loop for each PO

        if (w["balance" + poNumbers.entity[x]].toFixed(2) == Number(0)) {

            var status = 'equal';
        } else if (w["balance" + poNumbers.entity[x]].toFixed(2) > Number(0)) {

            var status = 'Receipt';
        } else if (w["balance" + poNumbers.entity[x]].toFixed(2) < Number(0)) {

            var status = 'bill';
        }

        var url = nlapiResolveURL('record', 'purchaseorder', poNumbers.id[x]);

        if (w["poDate" + poNumbers.entity[x]] != null) {

            html += '<tr>' +
                '<td><a href="' + url + '" target="_blank">' + poNumbers.entity[x] + '</a></td>' +
                '<td>' + w["poDate" + poNumbers.entity[x]] + '</td>';

            html += '<td>';
            for (var y = 0; y < w["poItems" + poNumbers.entity[x]].length; y++) { // Loop to display all PO line items

                if (w["poItems" + poNumbers.entity[x]][y] != '') {

                    var poToPrint = Number(w["poRate" + poNumbers.entity[x]][y]);

                    html += '<div style="float:left;width:65%;"><a href="' + url + '" target="_blank">' + w["poItems" + poNumbers.entity[x]][y] + '</a>: ' + '</div><div style="float:right;text-align: right;width:35%;">' + w["poAmt" + poNumbers.entity[x]][y] + ' @ $' + numberWithCommas(poToPrint.toFixed(2)) + '</div><br>';
                }
            }
            html += '<br><div style="float:left;width:35%;">Total: </div><div style="float:right;text-align: right;width:65%;">' + w["poQty" + poNumbers.entity[x]] + ' @ $' + w["poTotal" + poNumbers.entity[x]].toFixed(2) + '</div>' +
                '</td>';

            html += '<td>';
            for (var y = 0; y < w["rLineName" + poNumbers.entity[x]].length; y++) { // Loop to display all Receipt line items

                var rurl = nlapiResolveURL('record', 'itemreceipt', w["rLineId" + poNumbers.entity[x]][y]);
                var rToPrint = Number(w["rLineRate" + poNumbers.entity[x]][y]);

                html += '<div style="float:left;width:65%;"><a href="' + rurl + '" target="_blank">' + w["rLineName" + poNumbers.entity[x]][y] + '</a>: ' + '</div><div style="float:right;text-align: right;width:35%;">' + w["rLineAmt" + poNumbers.entity[x]][y] + ' @ $' + numberWithCommas(rToPrint.toFixed(2)) + '</div><br>';
            }
            html += '<br><div style="float:left;width:35%;">Total: </div><div style="float:right;text-align: right;width:65%;">' + w["ReceiptQty" + poNumbers.entity[x]] + ' @ $' + w["ReceiptTotal" + poNumbers.entity[x]].toFixed(2) + '</div>' +
                '</td>';

            html += '<td>';
            for (var y = 0; y < w["bLineName" + poNumbers.entity[x]].length; y++) { // Loop to display all bill line items

                var burl = nlapiResolveURL('record', 'vendorbill', w["bLineId" + poNumbers.entity[x]][y]);
                var bToPrint = Number(w["bLineRate" + poNumbers.entity[x]][y]);

                html += '<div style="float:left;width:65%;"><a href="' + burl + '" target="_blank">' + w["bLineName" + poNumbers.entity[x]][y] + '</a>: ' + '</div><div style="float:right;text-align: right;width:35%;">' + w["bLineAmt" + poNumbers.entity[x]][y] + ' @ $' + numberWithCommas(bToPrint.toFixed(2)) + '</div><br>';
            }
            html += '<br><div style="float:left;width:35%;">Total: </div><div style="float:right;text-align: right;width:65%;">' + w["billQty" + poNumbers.entity[x]] + ' @ $' + w["billTotal" + poNumbers.entity[x]].toFixed(2) + '</div>' +
                '</td>';

            html += '<td><div align="right">' + w["balance" + poNumbers.entity[x]].toFixed(2) + '</div></td>' +
                '</tr>';
        }
    }

    html += '</table>' +
        '</body>' +
        '</html>';

    var form2 = nlapiCreateForm('Inventory Received / Not Billed');

    var myInlineHtml = form2.addField('custpage_btn', 'inlinehtml');
    myInlineHtml.setDefaultValue(html);

    response.writePage(form2);
}

function posearch(array) { // Search for all PO's

    var filters = new Array();
    var columns = new Array();
    var setStartDate = new Date(request.getParameter('date_start'));
    var setEndDate = new Date(request.getParameter('date_end'));

    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', array);
    filters[1] = new nlobjSearchFilter('trandate', null, 'within', setStartDate, setEndDate);
    filters[2] = new nlobjSearchFilter('type', null, 'is', 'PurchOrd');

    columns[0] = new nlobjSearchColumn('amount');
    columns[1] = new nlobjSearchColumn('trandate');
    columns[2] = new nlobjSearchColumn('account');
    columns[3] = new nlobjSearchColumn('createdfrom');
    columns[4] = new nlobjSearchColumn('internalid').setSort();
    columns[5] = new nlobjSearchColumn('tranid');
    columns[6] = new nlobjSearchColumn('entity');
    columns[7] = new nlobjSearchColumn('type');
    columns[8] = new nlobjSearchColumn('quantity');
    columns[9] = new nlobjSearchColumn('itemid', 'item');
    columns[10] = new nlobjSearchColumn('rate');

    var results = nlapiSearchRecord('transaction', null, filters, columns);
    var allResults = new Array();
    allResults = allResults.concat(results);

    while (results.length == 1000) {

        var lastId = results[999].getValue('internalid');
        filters[2] = new nlobjSearchFilter('internalidNumber', null, 'greaterthanorequalto', lastId);
        var results = nlapiSearchRecord('transaction', null, filters, columns);
        allResults = allResults.concat(results);
    }
    return allResults;
}

function search114() { // Search for all items in account 2408 (114)


    var filters = new Array();
    var columns = new Array();
    var setStartDate = new Date(request.getParameter('date_start'));
    var setEndDate = new Date(request.getParameter('date_end'));

    filters[0] = new nlobjSearchFilter('account', null, 'anyof', '114');
    filters[1] = new nlobjSearchFilter('createdfrom', null, 'noneof', '@NONE@');
    filters[2] = new nlobjSearchFilter('type', null, 'anyof', ['ItemRcpt', 'VendBill']);

    columns[0] = new nlobjSearchColumn('amount');
    columns[1] = new nlobjSearchColumn('trandate');
    columns[2] = new nlobjSearchColumn('account');
    columns[3] = new nlobjSearchColumn('createdfrom');
    columns[4] = new nlobjSearchColumn('internalid').setSort();
    columns[5] = new nlobjSearchColumn('tranid');
    columns[6] = new nlobjSearchColumn('entity');
    columns[7] = new nlobjSearchColumn('type');
    columns[8] = new nlobjSearchColumn('quantity');
    columns[9] = new nlobjSearchColumn('itemid', 'item');
    columns[10] = new nlobjSearchColumn('rate');

    var results = nlapiSearchRecord('transaction', null, filters, columns);
    var allResults = new Array();
    allResults = allResults.concat(results);

    logx('timeout check', 'Search 1 preloop ' + allResults.length);


    while (results.length == 1000) {

        var lastId = results[999].getValue('internalid');
        filters[3] = new nlobjSearchFilter('internalidNumber', null, 'greaterthanorequalto', lastId);
        var results = nlapiSearchRecord('transaction', null, filters, columns);
        allResults = allResults.concat(results);
        logx('timeout check', 'Search 1 loop ' + allResults.length);
    }
    logx('timeout check', 'Search 1 finish ' + allResults.length);
    return allResults;
}

function search231(array) { // Search for all items in account 1405 (231)

    var filters = new Array();
    var columns = new Array();
    var setStartDate = new Date(request.getParameter('date_start'));
    var setEndDate = new Date(request.getParameter('date_end'));

    filters[0] = new nlobjSearchFilter('account', null, 'anyof', ['225', '231', '230', '233', '232', '227', '226', '229', '228', '398', '425', '139']);
    filters[1 = new nlobjSearchFilter('createdfrom', null, 'anyof', array); filters[2] = new nlobjSearchFilter('quantity', null, 'isnotempty'); filters[3] = new nlobjSearchFilter('type', null, 'is', 'ItemRcpt');

        columns[0] = new nlobjSearchColumn('amount'); columns[1] = new nlobjSearchColumn('trandate'); columns[2] = new nlobjSearchColumn('account'); columns[3] = new nlobjSearchColumn('createdfrom'); columns[4] = new nlobjSearchColumn('internalid').setSort(); columns[5] = new nlobjSearchColumn('tranid'); columns[6] = new nlobjSearchColumn('entity'); columns[7] = new nlobjSearchColumn('type'); columns[8] = new nlobjSearchColumn('quantity'); columns[9] = new nlobjSearchColumn('itemid', 'item'); columns[10] = new nlobjSearchColumn('rate');


        var results = nlapiSearchRecord('transaction', null, filters, columns);
        var allResults = new Array(); allResults = allResults.concat(results); logx('timeout check', 'Search 2 preloop ' + allResults.length);

        while (results.length == 1000) {

            var lastId = results[999].getValue('internalid');
            filters[4] = new nlobjSearchFilter('internalidNumber', null, 'greaterthanorequalto', lastId);
            var results = nlapiSearchRecord('transaction', null, filters, columns);
            allResults = allResults.concat(results);
            logx('timeout check', 'Search 2 loop ' + allResults.length);
        }
        logx('timeout check', 'Search 2 finish ' + allResults.length);
        return allResults;
}
