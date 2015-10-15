/*-------------------------------------------------------------------------------------------------
Function: getPoId(array)
Purpose:  Get created from field from all elements in array
-------------------------------------------------------------------------------------------------*/
function getPoId(array){
	
	var poUnsorted 	= new Array();
	
	for(var x = 0; x < array.length; x++){
		
		poUnsorted 	= poUnsorted.concat(array[x].getValue('createdfrom'));
	}
	
	var poSorted 		= new Array();
	poSorted 		= trim(poUnsorted);
	return poSorted;
}
