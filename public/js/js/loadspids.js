
$(document).ready(function(){
	if($("#cust_name_select_list option:selected").val() === "Please select a name") {
		$('.spid-header,.switch-date').css("display","none");
	}
	var currentUrl = returnLastPathSegment();
	$('.switchStatus a').attr('href',currentUrl.replace(/\/[^\/]+$/, '/RetailerStatusServlet-1.0.0'));
	$('.otherSwitch a').attr('href',currentUrl.replace(/\/[^\/]+$/, '/RetailerSmartBackEndServlet2-1.0.0'));
	$('.UUSwitch a').attr('href',currentUrl.replace(/\/[^\/]+$/, '/RetailerSmartBackEndServlet-1.0.0'));	
	console.log( currentUrl.replace(/\/[^\/]+$/, '/RetailerSmartBackEndServlet1-1.0.0'));
	$('.meterExchange a').attr('href',currentUrl + "/formF1.jsp");

});
function returnLastPathSegment(url) {
   var a = document.createElement('a')
   a.href = url;
    
    if ( ! a.pathname) {
        return url;
    }
    
    a.pathname = a.pathname.replace(/\/[^\/]+$/, '');
    
    return a.href;
}
$(document).on("click",'#retrieveSpid',function(e){
		e.preventDefault();
		 $('#loadSpid').submit();       
		   
});

$(document).on("change",'#cust_name_select_list',function(e){
    $('#loadSpid').submit();   
});

$(function() {
    $( "input[name='switchDate']" ).datepicker({
	    dateFormat: 'yy-m-d',
	    inline: true,
	    onSelect: function(dateText, inst) { 
				var month = [];
				month[0] = "Jan";
				month[1] = "Feb";
				month[2] = "Mar";
				month[3] = "Apr";
				month[4] = "May";
				month[5] = "Jun";
				month[6] = "Jul";
				month[7] = "Aug";
				month[8] = "Sep";
				month[9] = "Oct";
				month[10] = "Nov";
				month[11] = "Dec";	 
				   	
	        var date = $(this).datepicker('getDate'),
	            day  = date.getDate(),             
	            year =  date.getFullYear();
	            month =	month[date.getMonth()];
	       
	        $('#inputField').val(day + '-' + month + '-' + year); 
	        $('.validationDateError').text("");   
	        console.log(day + '-' + month + '-' + year);
	    }
    });    
});

$(document).on("click",'.sendSwitchRequest',function(e){
	   e.preventDefault();
	   $this = $(this);
	   var sendSwitchDate = $('#inputField').val();
	   	   sendSwitchUrl = "send_switch_request.jsp?switchDate=" + sendSwitchDate;	
	   	   
	   if ($('#inputField').val() === "") {
	   	  console.log('please selectzzzz a date');
	   	  $('.validationDateError').text("Please select a valid Date").css("color","red");
	   	  return false;
	   }
	       
	   else {
	   		   
			   $.ajax({
			    contentType: "application/x-www-form-urlencoded",
			    dataType: "text",
			    url: sendSwitchUrl,
			    type: "GET",
			    success:function(responseText){
			    	console.log('success- submitted. Thanks');
			    	$('#ackMessage').css("display","block");
			    	$this.addClass('btn-success disabled');
			    	$('#ackMessage').text("Thanks your request submitted successfully");
			    	//console.log(responseText);
			    },
			    error:function(XMLHttpRequest,textStatus,errorThrown){
			    console.log('error thrown');
			    	$('#ackMessage').css("display","block");
			    	$this.addClass('btn-warning');
			    	$('#ackMessage').text("Please retry as No SPIDs").css("color","red");

			    }
		   	});
		}
		
});
