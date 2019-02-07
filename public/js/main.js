$(document).ready(function(){
	$('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
	var confirmaton = confirm('Are you sure');

	if(confirmation){
		$.ajax({
			type:'DELETE',
			url: '/users/delete'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/');
		});
	} else {
		return false;
	}
}
 