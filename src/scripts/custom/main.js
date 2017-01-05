$( document ).ready(function() {
    $(".js-show-modal").click(function(){
    	// load html to modal
    	$(".modal-content").load("form.html", function(response, status, xhr) {
    		if(status == "error") {
    			$(".modal-content").html(
    				"<h3>Whoops!</h3><h4 class='text-center'>" + 
    				"Error code: " + xhr.status + 
    				" - " + 
    				xhr.statusText + 
    				"</h4>" + 
    				"<div class='text-center'><button class='btn js-close-modal'>Got it</button></div>"
    			);
    			showModal();
    		} else {
    			showModal();
    		}
    	})

    	// show modal
    })

    $(document).on('click','.js-close-modal',function(){ hideModal(); })

    $(".overlay").click(function(){
    	// hide modal
    	hideModal();
    })

    $(document).on('submit','#fun-form', function(){ 
    	alert("Thanks for playing");
    	hideModal();
	    return false;
    })
});

function hideModal() {
	$(".modal").removeClass("modal-show");
	$(".overlay").hide();

	// Wait for animation
	setTimeout(function(){
		// remove html from modal
		$(".modal-content").empty();
	}, 300)
}

function showModal() {
	$(".modal").addClass("modal-show");
	$(".overlay").show();
}