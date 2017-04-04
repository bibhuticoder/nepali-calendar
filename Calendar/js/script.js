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


var year = 2072, month = "Poush", day = 0, data, max = 2074, min = 1970, yearen, monthen;
var months =["Baishakh", "Jestha","Ashadh","Shrawan","Bhadra","Ashwin","Kartik","Mangsir","Poush","Magh","Falgun","Chaitra"];

var corrsMonths = ["Apr-May", "May-Jun", "Jun-July", "July-Aug", "Aug-Sept", "Sept-Oct", "Oct-Nov", "Nov-Dec", "Dec-Jan", "Jan-Feb",
"Feb-Mar", "Mar-Apr"];


function loadData(month){
	
	var arr = data[month];
	
	var html = "";
	html += "<tr>";
	for(i=0; i<arr.length; i++){
		if(i%7 === 0 && i !== 0){
			html += "</tr><tr>";
		}


		//holiday
		if(arr[i].day === "sat" || arr[i].holiday === true){
			var clas = "holiday"; 
		}else clas = "";
		
		//special day
		if(arr[i].specialday === true) var special = "special";
		else special = "";

		//today		
		if(arr[i].en == day && yearen == parseInt(parseInt(year)-56) && monthen === months.indexOf(month)-8) var cur = "today";
		else cur = "";
		
		html += `<td class="data ${clas} ${cur}">
					<div class="event ${special}">${arr[i].event}</div>					
					<div class='np'> ${arr[i].np} </div>
					<div class='en'> ${arr[i].en} </div>
					<div class='tithi'> ${arr[i].tithi} </div>					
				</td>`;		
	}

	$("#corrsMonth").text(corrsMonths[months.indexOf(month)] + " " + year);

	$("#tbody").html(html);
	$("#month").val(month);
	$("#year").val(year);
	unmask();

		
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

function currentDate(){
	var d = new Date();

	yearen = d.getFullYear();
	monthen = d.getMonth();
	day = d.getDate();

	console.log(yearen + " " + monthen + " " + day);

	year = parseInt(yearen) + 56;
	month = months[parseInt(monthen) + 8];
	getData();
}

currentDate();
loadSelect();