function cont(){ 
    if(confirm("这里是实践测试网站，相关功能可能并不成熟，是否继续？"))
        return true;
    else return false;
}
document.ready = cont();
