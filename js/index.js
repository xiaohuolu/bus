
//得到手机屏幕的宽度
let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
if(htmlWidth>750){
	htmlWidth=750;
}
//得到html的Dom元素
let htmlDom = document.getElementsByTagName('html')[0];
//设置根元素字体大小
htmlDom.style.fontSize= htmlWidth/20 + 'px';



		$(".btn_bus").click(function(){
	$(".btn_bus").removeClass("active");
	 $(this).addClass("active");
	 $(".wrap").hide();
	 $(".wrap").eq($(this).index()).show();
})

if(localStorage.getItem("arr")) {
	var arr = JSON.parse(localStorage.getItem("arr"));
} else {
	var arr = [];
}

var item = "";
var record_arr = JSON.parse(localStorage.getItem("arr"));
var record = Array.from(new Set(record_arr));

for(var k = 0; k < record.length; k++) {
	item += "<li><span class='fa fa-bus' style='color:blue;margin-right:5%'></span>" + record[k] + "<span class='fa fa-angle-right' style='position:absolute;left:90%;line-height:50px'></span></li>"
}
$("#storage").append(item);


//历史站点
if(localStorage.getItem("arr_station")) {
	var arr_station = JSON.parse(localStorage.getItem("arr_station"));
} else {
	var arr_station = [];
}

var item_station = "";
var record_stations= JSON.parse(localStorage.getItem("arr_station"));
var record_station= Array.from(new Set(record_stations));

for(var n = 0; n < record_station.length; n++) {
	item_station += "<li><span class='fa fa-bus' style='color:blue;margin-right:5%'></span>" + record_station[n] + "<span class='fa fa-angle-right' style='position:absolute;left:90%;line-height:50px'></span></li>"
}
$("#storage_station").append(item_station);



$("#inquiry").click(function() {

	$("#bus_line_list").children().remove();
	var bus_line = parseInt($("#bus_line").val());
	if($.trim(bus_line) == "" || $.trim(bus_line) == "NaN") {
		alert("请输入线路");
		return false
	} else {
		$.ajax({
			url: "http://42.63.19.205:18080/yinchuanWeb/bus/outside/getBusLinesByLineName.json?BUS_LINE_NAME=" + bus_line + "路",
			dataType: "jsonp",
			success: function(res) {
//				busLines.length == 0
				if(res.success==false) {
					alert("不存在此线路");
					return;
				}
				console.log(res);
				//						console.log(res.busLineName);

				arr.unshift(res.busLineName);
				localStorage.setItem("arr", JSON.stringify(arr));

				//                       localStorage.setItem("busLineName",res.busLineName);

				for(var i = 0; i < res.busLines.length; i++) {
					var busLineName = res.busLines[i].busLineName;
					var str = "<li><a href='actual_time.html?bus_line=" + busLineName + "'><span class='fa fa-bus'></span>";
					str += busLineName;
					str += "<span class='fa fa-angle-right'></span></a></li>";

					$("#bus_line_list").append(str)
				}
				//         	 window.location.href="actual_time.html?bus_line="+bus_line;

			}
		})
	}

})

$("#inquiry_station").click(function() {

	$("#bus_station_list").children().remove();
	var $bus_stations= $("#bus_stations").val();
	if($.trim($bus_stations) == "") {
		alert("请输入公交站");
		return false
	} else {
		$.ajax({
			url: "http://42.63.19.205:18080/yinchuanWeb/bus/outside/getBusStationsByStaName.json?STATION_NAME=" +$bus_stations,
			dataType: "jsonp",
			success: function(res) {
				if(res.success==false){
           	alert("没有查询到该站点");
           	return;
           }else{
           	      	for(var i = 0; i < res.stations.length; i++) {
					var stationName = res.stations[i].stationName;
					str = "<li><span class='fa fa-bus'></span><a href='javascript:void(0)'>";
					str += stationName;
					str += "</a><span class='fa fa-angle-right'></span> </li>";
					$("#bus_station_list").append(str)
				}
           }
			var str="";
				console.log(res);
				//						console.log(res.busLineName);

				arr_station.unshift(res.stationName);
				localStorage.setItem("arr_station", JSON.stringify(arr_station));

				$("#bus_station_list li").click(function() {
	                 var $bus_station=$(this).find("a").text();


	                 $.ajax({
	                 	url:"http://42.63.19.205:18080/yinchuanWeb/bus/outside/getAllLinesThroughByStaName.json?stationName="+$bus_station,
	                 	dataType:"jsonp",
	                 	success:function(res){
	                 		console.log(res);

	                 		 $("#bus_station_list").empty();
	                 		 var str="";
	                 		 for(var i=0;i<res.buslines.length;i++){
	                 		 		var busLineName = res.buslines[i].busLineName;
					var str = "<li><span class='fa fa-bus'></span><a href='actual_time.html?bus_line=" + busLineName +"'>";
					str += busLineName;
					str += "</a><span class='fa fa-angle-right'></span> </li>";

					$("#bus_station_list").append(str)
	                 		 }
	                 	}
	                 })
})
				//         	 window.location.href="actual_time.html?bus_line="+bus_line;

			},
			error:function(){
				alert("没有查询到该站点")
			}
		})
	}

})


$("#storage li").click(function() {
	var bus_line = parseInt($(this).text());
	location.href = "actual_time.html?bus_line=" + bus_line;
})
$("#storage_station li").click(function() {
	var bus_line = $(this).text();
 $("#bus_stations").val(bus_line);
	$("#inquiry_station").click();
})









if(!localStorage.getItem("arr")){
	$(".clean_line").hide();
}
$(".clean_line").click(function(){
	 localStorage.removeItem("arr");
	 location.reload();
})

if(!localStorage.getItem("arr_station")){
	$(".clean_station").hide();
}
$(".clean_station").click(function(){
	 localStorage.removeItem("arr_station");
	 location.reload();
})
