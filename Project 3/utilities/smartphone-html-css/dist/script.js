// $(document).ready(function() {
// 	$('.three-lines-menu').on('click', function() {	
// 		$('#menu ul').toggleClass('menu-responsive');
// 	});
// });

console.log("i M")
let threeLines = document.querySelector('.three-lines-menu');
threeLines.addEventListener('click', ()=>{
	let menu= document.querySelector("#menu ul");
	menu.classList.add('menu-responsive');
})
