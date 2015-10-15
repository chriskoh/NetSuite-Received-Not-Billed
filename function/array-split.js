/*-------------------------------------------------------------------------------------------------
Function: splitResults(array)
Purpose:  Sort array based on transaction type
-------------------------------------------------------------------------------------------------*/
function splitResults(array){
	
	var bill 	= new Array();
	var Receipt	= new Array();
	var journal 	= new Array();
	
	for(var x = 0; x < array.length; x++){
		
		if(array[x].getValue('type') == 'VendBill'){
			
			bill 	= bill.concat(array[x]);
		}
		else if(array[x].getValue('type') == 'ItemRcpt'){
			
			Receipt	= Receipt.concat(array[x]);
		}
		else if(array[x].getValue('type') == 'Journal'){
			
			journal = journal.concat(array[x]);
		}
	}
	
	return{
		bill: bill,
		Receipt: Receipt,
		journal: journal
	};
}
