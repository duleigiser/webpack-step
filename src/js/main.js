import $ from 'jquery';
import org from './mock.js'
require("../css/style.css")
require("../css/left.css")
console.log(org)
function init(id,cb){
    // $.ajax({
    //     url:"",
    //     dataType:"json",
    //     success:function(data){
    //         prepare(data)
    //     }
    // })
    $(id).html(prapare(org))
    if(cb){
        cb($(".org_left"))
    }
}
init("#org",function(dom){
    dom.on("click",function(){
        $(this).addClass("active").siblings().removeClass("active");
        console.log(this)
    })
})

function prapare(org) {
  var html = ["<ul class='left_nav'>"]
  $.each(org, function(index) {
      if(index===0){
        html.push("<li class='org_left active'>" + this.name + "</li>")

      }else{
          html.push("<li class='org_left'>" + this.name + "</li>")

      }
  })
  html.push("</ul>")
  return html.join("");
}
