#NetSuite-Received-Not-Billed-Report

The Received Not Billed report lists all of the purchase order receipt transactions that have not been matched to a vendor invoice.

In a true accrual inventory system, purchases often arrive before the vendor's invoice. The goods are received into inventory and the offsetting amount posted to the GL Receiving Accrual account. The receipt is listed on the Received Not Invoiced Report. The total of the Received Not Invoiced Report should equal the amount in the Receiving Accrual account. (Some people call this account Un-Vouchered Receipts or one of several different names. The use is the same.) Frequently, these two numbers do not match. Payments frequently are vouchered directly to AP and an expense account. The receiving transaction has already hit the expense account and thus that account is overstated. While the receipt is fully but incorrectly vouchered, it remains on the RNI report. After identifying any receipts on the RNI report that are already vouchered, remove the PO from the RNI report by changing the status of the PO to Closed (you will need to close any open lines first). Next, post a GL journal to move funds from the expense accounts hit by the voucher to the receiving accrual account.

Once all closed receipts are removed from the RNI account, adjust the receiving accrual account to match the amount remaining on the account. If an appropriate offsetting account cannot be found consider the following options. 

Inventory Asset Account- if the stock status valuation report is different from the sum of the inventory asset accounts, some of the receiving accrual can be used to bring this account into line. 

Accounts Payable- if the AP GL is out of balance with the open payables report, use some of the receiving accrual adjustment here.
