function loadSelect(){
	var html = "";
	//year
	for(var i = min; i<=max; i++){
		html += "<option>" + i + "</option>";
	}		
	document.getElementById("year").innerHTML = html;
	html = "";
	//months
	
	for(var i = 0; i<months.length; i++){
		html += "<option>" + months[i] + "</option>";
	}
	document.getElementById("month").innerHTML = html;
}


var year = 2072, month = "Poush", data, max = 2073, min = 1970;
var months =["Baishakh", "Jestha","Ashadh","Shrawan","Bhadra","Ashwin","Kartik","Mangsir","Poush","Magh","Falgun","Chaitra"];

function loadData(month){
	
	var arr = data[month];
	
	var html = "";
	html += "<tr>";
	for(i=0; i<arr.length; i++){
		if(i%7 === 0 && i !== 0){
			html += "</tr><tr>";
		}
		html += "<td class='day'><div class='np'>" + arr[i].np + "</div><div class='en'>"+ arr[i].en + "</div></td>";		
	}

	$("#tbody").html(html);

	$("#month").val(month);
	$("#year").val(year);
	unmask();
	applyEvents();	
}

function getData(){

	console.log("getting data for " + year);
	mask();
	$.ajax({
		method: "GET",
		url : "https://bibhuticoder.github.io/nepali-calendar-api/api/"+year+".json",
		success:function(d){
			data = d;
			console.log("Success download");
			loadData(month);
		}
	});
}

document.getElementById("month").onchange  = function(){
	month = this.children[this.selectedIndex].innerHTML.trim();
	loadData(month);
}

document.getElementById("year").onchange  = function(){
	var url = "";
	year = parseInt(this.children[this.selectedIndex].innerHTML.trim());
	getData();
	loadData(month);	
}

$("#next").click(function(){
	var index = months.indexOf(month);

	if(index < 11){
		loadData(months[++index]);
		$("#month").val(months[index]);
		month = months[index];
	}

	else{
		//get data of next year
		if((year + 1) <= max){
			year++;
			month = months[0];
			getData();
			
		}else console.log("date unavailable next " + (year+1) + " max : " + max);
		
	}

});

$("#previous").click(function(){
	var index = months.indexOf(month);

	if(index >= 1){
		loadData(months[--index]);
		$("#month").val(months[index]);
		month = months[index];
	}

	else{

		if(year - 1 >= min){
			year--;
			month = months[11];
			getData();
			
		}else console.log("date unavailable previous");
	}

});

function mask(){
	$("#mask").fadeIn(500);
}

function unmask(){
	$("#mask").fadeOut(500);
}


getData();
loadSelect();
hideCalendar();



//
function showCalendar(){
	$("#calendar").fadeIn(200);
	$("#calendar").css("top", $("#nepali-date").position().top + $("#nepali-date").height() + 10);
	$("#calendar").css("left", $("#nepali-date").position().left);
}

function hideCalendar(){
	$("#calendar").fadeOut(200);
}

$("#nepali-date").click(function(){
	showCalendar();
})


function applyEvents(){
	$("td.day").unbind('click').bind('click', function(){

		var day = $($(this).children()[0]).text();
		if(day !== ""){
			$("#nepali-date").val(month+ " " + day + ", " + year);
			hideCalendar();
		}		
		
	})
}

	
	