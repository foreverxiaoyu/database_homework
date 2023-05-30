

function Gid(id){
    return document.getElementById(id);
}
let lock = false;

// 轮播图
let lis = document.getElementsByClassName("mainpage_imgs")
lis[0].style.zIndex = '10';
lis[0].style.opacity = '1';
let points=document.getElementsByClassName("points");
let timer=null;//计时器


let index=0;
let len = lis.length
let preIndex = 0
function goNext(){
    mainpageImgs_descChange(index);
    lis[preIndex].style.zIndex = '0';
    lis[preIndex].style.opacity = '0';

    lis[index].style.zIndex = '10';
    lis[index].style.opacity = '1';
    lis[index].style.transition ='opacity .5s';


   for(let Choose = 0;Choose <=6 ; Choose++){
        if (Choose !==index){
            points[Choose].className = "points" ;
        }
        else
            points[Choose].className = "points active" ;
        }
         
 
}//对目标元素显示


//按钮切换 
Gid("change-right").addEventListener("click",function(){
    preIndex = index;
    index=(index+1)%7;
    goNext();
})
Gid("change-left").addEventListener("click",function(){
    preIndex = index;
    if(index==0) index=6;
    else index--;
    goNext();
})
//辅助切换
function points_change(thePrt){
    preIndex = index;
    index=thePrt;
    goNext();
}
for(let i=0;i<points.length;i++){
    points[i].addEventListener("mouseover",function(){
        clearTimeout(timer);
        timer = null;
    })
    points[i].addEventListener("mouseout",function(){
        timer=setInterval('timerGoNext()',2500);
    })
}

//计时切换
function timerGoNext(){
    preIndex =index;
    index=(index+1)%7;
    goNext();
}
//初始化
function init(){
timer=setInterval('timerGoNext()',5000);
points[0].className = "points active"
}

$(document).ready(function(){
    init()
 });

function mainpageImgs_descChange(num2){
    switch(num2){
        case 0:Gid("mainPageImgsDescription").innerText = "^AI,gYY与地外文明，共同奏响驶向群星的交响^";break;
        case 1:Gid("mainPageImgsDescription").innerText = "^欢迎加入湘潭大学网络技术部！^";break;
        case 2:Gid("mainPageImgsDescription").innerText = "^湘潭大学：军魂^";break;
        case 3:Gid("mainPageImgsDescription").innerText = "^湘潭大学：一角^";break;
        case 4:Gid("mainPageImgsDescription").innerText = "^前进：中国空间站^";break;
        case 5:Gid("mainPageImgsDescription").innerText = "^旅程：南昌^";break;
        case 6:Gid("mainPageImgsDescription").innerText = "^旧乡：晴空^";break;
    }
 }


