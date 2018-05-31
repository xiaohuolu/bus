
//actual_time
//$(".back").click(function() {
//	history.back();
//})

var bus_line = parseInt(GetQueryString("bus_line"));
var $bus_station = $("#bus_station");
var $bus_status = $(".bus_status");
var $bus_line_name = $("#bus_line_name");
var $startTime = $("#startTime");
var $endTime = $("#endTime");
var $startStation = $("#startStation");
var $endStation = $("#endStation");
var flag = 1;
fn();

  // setInterval("fn()",20000);
function fn(){
		$bus_station.empty();
	$bus_status.empty();
	$(".bus_line_name").unbind();
$.ajax({
	type: "get",
	url: "http://42.63.19.205:18080/yinchuanWeb/bus/outside/getBusLineInfoByLineName.json?BUS_LINE_NAME=" + bus_line + "路&FLAG="+flag,
	dataType: "jsonp",
	success: function(res) {

		console.log(res)
		var stations = res.busLine.stations;
		//              		console.log(stations)

		$bus_line_name.text(res.busLineName);
		$startTime.text(res.busLine.startTime);
		$endTime.text(res.busLine.endTime);
		$startStation.text(res.busLine.startStation);
		$endStation.text(res.busLine.endStation);
		var bus_line_id = res.busLine.busLineId;

		for(var i = 0; i < stations.length; i++) {
			var str = "";
			str += "<li class='bus_line_name'><div class='order'>" + (i + 1) + "</div><span class='station_bg'>" + stations[i].stationName + "</span><span class='fa fa-bus bus_img'></span>";
			str += "<div class='next_bus'><p><span class='fa fa-bus'></span>下一班车：<span class='next_station'> </span>    <p style='margin-left:60px'> 下下班车：<span class='next_next_station'></span></p></p></div></li>";
			$bus_station.append(str);
		}

		$(".bus_line_name").click(function() {

			var n = $(this).index();

			var busLineId = res.busLine.busLineId;
			var stationId = stations[n].stationId;
			var stationName = stations[n].stationName;
			var strank = stations[n].strank;

			$.ajax({
				type: "get",
				dataType: "jsonp",
				url: "http://42.63.19.205:18080/yinchuanWeb/bus/outside/getBusTime.json?BUS_LINE_ID=" + busLineId + "&STATION_ID=" + stationId + "&STATION_NAME=" + stationName + "&STRANK=" + strank + "&FLAG=" + flag,
				success: function(res) {
					//                                console.log(res)

					if(res.duras[0].isReal == true) {
						if(res.duras[0].stations != 0) {
							var next_station = res.duras[0].stations + "站";
						} else {
							var next_station = "即将到达"
						}
						if(res.duras[0].dura != -1) {
							var num = res.duras[0].dura;
							var next_dura = Math.round(num / 60) + "分钟";
						} else {
							var next_dura = "暂无数据"
						}
						$(".next_station").text(next_station + "," + next_dura)
					} else {
						$(".next_station").text("暂无数据")
					}

					if(res.duras[1].isReal == true) {
						if(res.duras[1].stations != 0) {
							var next_station = res.duras[1].stations + "站";
						} else {
							var next_station = "即将到达"
						}
						if(res.duras[1].dura != -1) {
							var num = res.duras[1].dura;
							var next_dura = Math.floor(num / 60) + "分钟";
						} else {
							var next_dura = "暂无数据"
						}
						$(".next_next_station").text(next_station + "," + next_dura)
					} else {
						$(".next_next_station").text("暂无数据")
					}

				}
			});

			$(".next_bus").not($(this).find(".next_bus")).hide();

			$(this).find(".next_bus").slideToggle();

		})

		$.ajax({
			type: "get",
			url: "http://42.63.19.205:18080/yinchuanWeb/bus/outside/getBusLinePos.json?BUS_LINE_ID=" + bus_line_id + "&FLAG=" + flag,
			dataType: "jsonp",
			success: function(data) {
				//							console.log(data)
				var vehiclePos = data.vehiclePos;

				$(".bus_line_name").each(function() {
					for(var j = 0; j < vehiclePos.length; j++) {
						if($(this).html().indexOf(vehiclePos[j].stationName) != -1) {

							$(this).find(".bus_img").css("color", "#0000FF")

						}

					}
				})
			}
		});
	}
})

}


$("#flag").click(function() {

	$bus_station.empty();
	$bus_status.empty();
	flag = 3 - flag

  fn();
})
