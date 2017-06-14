//import $ from 'jquery';
//import axios from 'axios'
import org from './mock.js'
require("../css/style.css")
require("../css/left.css")
require("../css/main.styl")
require("../css/calender.css")
import Calender from "./component/calender"
import clock_conti from "./component/canvas-clock"
if (!window.location.origin) {
	window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}
var ctx = window.location.origin;
function init(id, cb) {
  $(id).html(prapare(org))
  if (cb) {
    cb($(".org_left"))
  }
}
function _getUserOrgId() {
    var org_id = "";
    $.ajax({
        url: ctx+"/jsjd/portal/getUserOrgId.do",
        type: "POST",
        async: false,
        success: function (data) {
            org_id = data;
        }
    })
    if(org_id == "a61365e2-969d-4352-b3f8-805027ab9f1d") org_id="c21834b4-1cb0-490f-a2a8-deeaf7f7e065"
    return org_id;
}

var org_id_in = _getUserOrgId()? _getUserOrgId():"c21834b4-1cb0-490f-a2a8-deeaf7f7e065"

//初始化日历
var myCalender = Calender();
myCalender.init({
  boxId: 'calenderBox',
  clickFunction: showDate,
  // 设置特殊日期
  specialDate: [ {
    // "date": "2012,12,25",
    //"description": "圣诞节"
  }]
});

 function showDate(date) {
    //date形如：20120901
    var dateStr = arguments[0];
    var ev = arguments[1];
    var nowDate = parsetime(dateStr)
    var orgid = $("#org .active").data("id");
    getMain(orgid,nowDate)
}

init("#org", function(dom) {
  dom.on("click", function() {
    $(this).addClass("active").siblings().removeClass("active");
    var orgid = $(this).data("id");
    var nowdata = getNowFormatDate();
    var enddate = getDateFromCurrentDate(nowdata,15)
   //console.log(enddate)
    //console.log(nowdata)
    var orghtml = $(this).html();
    $("#title").html(orghtml+"排班表")
    var nowDate = getNowFormatDate();
    getMain(orgid,nowDate);

  })
  //console.log(dom)
  for(var i = 0; i < dom.length;i++){
   // console.log($(dom[i]).data("id"))
    if(org_id_in === $(dom[i]).data("id")){
      //alert(1)
      $(dom[i]).click()
    }
  }
  
})

//axios.defaults.withCredentials = true
// $.ajaxSetup({
//     crossDomain: true,
//     xhrFields: {withCredentials: true}
// })

function ajax(_url,cb1,rq,orgid){
    $.ajax({
        url:_url,
        async:false,
        dataType:"json",
        success:function(data){
            cb1(data,rq,orgid)
        }
    })
}
function getMain(orgid,rq){
    //正式
    var url_interval = ctx + "/jsjd/pblh/getTimeInterval.do?org=" + orgid;
    var url_header = ctx + "/jsjd/pblh/getFixedData.do?org=" + orgid;
    var url_time = ctx + "/jsjd/pblh/getValueAfterFifteenDay.do?org="+orgid+"&rq="+rq
    //本地
    // var url_interval = "http://localhost:3000/jsjd/interval";
    // var url_header = "http://localhost:3000/jsjd/header";
    // var url_time = "http://localhost:3000/jsjd/time"
    ajax(url_interval,prapareInterval);
    ajax(url_header,parepareHeader)
    ajax(url_time,prapareTime,rq,orgid)
}

// axios("http://localhost:3000/jsjd/api").then(function(data) {
//   var cookie = "";
//   for (var i = 0; i < data.length; i++) {
//     document.cookie = data[i];
//   }
//   getMain()
//   axios('http://localhost:3000/jsjd/interval').then(function(res) {
//     // prapareInterval(res.data[0])
//    })
//    axios('http://localhost:3000/jsjd/header').then(function(res) {
//     // parepareHeader(res.data[0])
//    })
//    axios("http://localhost:3000/jsjd/time").then(function(res) {
//      //prapareTime(res.data)
//    })
// }).catch(function(err) {
//   console.log(err)
// })
function prapare(org) {
  var html = ["<ul class='left_nav'>"]
  $.each(org, function(index) {
    if (index === 0) {
      html.push("<li class='org_left active' data-id='"+this.id+"'>" + this.name + "</li>")
    } else {
      html.push("<li class='org_left' data-id='"+this.id+"'>" + this.name + "</li>")
    }
  })
  html.push("</ul>")
  return html.join("");
}
function prapareInterval(data) {
  var data = data[0];
  //var htmla = [];

  // for (var key in data) {
  //   if (key != "DCTYPE") htmla.push("<div class='item'>" + key + ":" + data[key] + "</div>")
  // }
  // if(htmla.length==3){
  //   var str = htmla[0]+htmla[2]+htmla[1];
  // }else{
  //   var str = htmla[3]+htmla[2]+htmla[0]+htmla[1]

  // }
  $("#mainrHeader").html("<div class='item'>" + data.SchedulingInterval + "</div>")
}

function parepareHeader(data) {
  var data = data[0];
  var htmla = [];
  var i = 0;
  for (var key in data) {
    if (key.indexOf("HEADER") > -1) i = i + 1
  }
  htmla.push("<th style='width:80px'>日期</th> ")
  for (var j = 1; j <= i; j++) {
    var x = "HEADER" + j;
    htmla.push("<th>" + data[x] + "</th>")
  }
  $("#mainDataHeader").html(htmla.join(""));
}
function getsfm(){
  var d = new Date();
  var hours = d.getHours();
  var min = d.getMinutes();
  var sec = d.getSeconds();
  
  return hours+":"+min+":"+sec
}
function prapareTime(data,rq,orgid) {
  var htmla = [];
  var index ='';
  
  $.ajax({
    url:ctx+"/jsjd/pblh/getBcValue.do?org="+orgid+"&rq="+rq+" "+getsfm(),
    async:false,
    dataType:"json",
    success:function(d){
      index = d[0].ArrXb
    }

  })
  var now = getNowFormatDate()
  if(rq) now = rq;
  for (var i = 0; i < data.length; i++) {
      htmla.push("<tr>")
      var d1 = getDateFromCurrentDate(now,i)
      htmla.push("<td>"+d1+"</td>")
      
      for (var j = 0; j < data[i].length; j++) {
        if(d1 == getNowFormatDate().substr(5)&&j==index){
           htmla.push("<td style='color:red'>" + transform(data[i][j]) + "</td>")
        }else{
          htmla.push("<td>" + transform(data[i][j]) + "</td>")
        }
        
      }
      htmla.push("</tr>")
  }
  $("#mainTime").html(htmla.join(''))
}

function transform(d) {
  switch (d) {
    case 0:
      d = "无";
      break;
    case 1:
       d = "一值";
       break;
     case 2:
      d = "二值";
      break;
    case 3:
      d = "三值";
      break;
    case 4:
      d = "四值";
      break;
    case 5:
      d = "五值";
      break;
    case 6:
      d = "六值";
      break;
  }
  return d;

}
function getDateFromCurrentDate(fromDate,dayInterval){
    var curDate = new Date(Date.parse(fromDate.replace(/-/g,"/")));
    curDate.setDate(curDate.getDate()+dayInterval);
    var month = (curDate.getMonth()+1)<10?"0"+(curDate.getMonth()+1):(curDate.getMonth()+1);
    var day = curDate.getDate()<10?"0"+curDate.getDate():curDate.getDate();
    return month+"-"+day;
};
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours()
    //4点往前减一天
    if (hour<=4) strDate =strDate-1;
    if (month >= 1 && month <= 9) month = "0" + month;
    
    if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate;
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate; 
    return currentdate;
}
function parsetime(dateStr){
     var year = parseInt(dateStr.slice(0, 4), 10),
    month = dateStr.slice(4, 6),
    day = dateStr.slice(-2);
    var nowDate = year + '-' + month + '-' + day;
    return nowDate
}
var clockd1_={
  "indicate": true,
  "indicate_color": "#000",
  "dial1_color": "#666600",
  "dial2_color": "#81812e",
  "dial3_color": "#9d9d5c",
  "time_add": 1,
  "time_24h": true,
  "date_add":3,
  "date_add_color": "#999",
};
var c = document.getElementById('clock1_');
var cns1_ = c.getContext('2d');
clock_conti(300,cns1_,clockd1_);