jQuery(document).ready(function() {
    jQuery("abbr.timeago").timeago();
    $('#previewing').css('display','none');

    $( '#signup' ).validate({
      rules: {
        username: {
          required: true
        },
        password:{
          required: true
        },        
        confirm:{
          required: true
        },        
        email:{
          required: true,
          email:true
        }       
      },
      messages: {
        username: "Please enter a valid username",
        password: "Please enter a valid password",
        confirm: "Please confirm your password",
        email: "Please enter a valid email"
      }
      
    });
    $('#flogin').validate({
    	rules:{
	        lusername:{
	          required: true
	        },
	        lpassword:{
	         required:true
	        }
    	},
    	messages:{
	        lusername: "Please enter your username",
	        lpassword: "Please enter your password"
    	}
    });


});


$("input[name=username").change(function(e){
	$this = $(this);
	//console.log('change of username');
	$.ajax({
	        dataType: 'json',
	        data: 	$('#signup').serialize(),
	        type: 'POST',
	        url: './checkuser',
	        
	        success: function(responseText) {
	         
	         //console.log(responseText);		   
			 if (responseText.userFlag)
			 {
			 	//console.log('username already exist');
			 	$this.focus();
			 	$this.addClass('validationShadow');
			 	$('.form-group.error').css('display','block');
			 	$('.errorMessageUser').text('oops,username is already taken!');
			 }	 		        		
	        	
	         else {
	         	$this.removeClass('validationShadow');
	         	//console.log('username is available');
	         	$('.form-group.error').css('display','block');
	         	$('.errorMessageUser').text('');

	         }		
	        },
	        
	        error: function(XMLHttpRequest, textStatus, errorThrown) {
		            //console.log('errror errorThrown');
		    
		     }
	

	});


});
$(".signup.btn").click(function(e){
	e.preventDefault();

	$('#signup').validate();
	
	//console.log('signup');
	var uid   = $( "input[name=username]" ).val(),
		pwd   = $( "input[name=password]" ).val(),
		email = $( "input[name=email]" ).val(),
		$this = $(this);
	if ( $( "#signup" ).valid() ) {	
		$.ajax({
		        dataType: 'json',
		        data: 	$('#signup').serialize(),
		        type: 'POST',
		        url: './signup',
		        
		        success: function(responseText) {
		         
		         //console.log(responseText);		   
				 if (responseText.userFlag)
				 {
				 	//console.log('check errors !!');
				 	$this.focus();
				 	$this.addClass('validationShadow');
				 	$('.form-group.error').css('display','block');
				 	$('.errorMessageUser').text('Check errors on the page');
				 }	 		        		
		        	
		         else {
		         	$this.removeClass('validationShadow');
		         	//console.log('Success !! Please login');
		         	$('.form-group.error').css('display','block');
		         	$('.errorMessageUser').text('Success !! Please login');

		         }		
		        		
		        	
		        	
		        },
		        
		        error: function(XMLHttpRequest, textStatus, errorThrown) {
			            //console.log('errror errorThrown');
			    
			     }
		

		});
	}		
});
$(".login.btn").click(function(e){
	e.preventDefault();
	var uid = $( "input[name=lusername]" ).val();
		pwd = $( "input[name=lpassword]" ).val();
		com = $('#company option:selected').val();
	var loginDetail = {
		username:uid,
		password:pwd,
		company:com
	}
	$('#flogin').validate();
	if( $('#flogin').valid() ){
		//console.log('loginDetail:%s',loginDetail.password);
		$.ajax({
		        dataType: 'json',
		        data: loginDetail,
		        type: 'POST',
		        url: './login',
		        
		        success: function(responseText) {
		        	   
		        	$(".login.btn.btn-primary.btn-md").submit();
		        	if (responseText.error){
		        		$('.errorMessage').text(responseText.message);
		        	}
		        	else{
		        		currentUrl = returnLastPathSegment();
		        		//console.log('valid user:' + currentUrl);
		        		window.location.href = currentUrl + "users/" + uid;
		        		
		        	}
		        	
		        },
		        
		        error: function(XMLHttpRequest, textStatus, errorThrown) {
			           // console.log('errror errorThrown');
			    
			     }
		});
	}
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





var hostname = window.location.hostname;
var socket = io.connect(hostname);


