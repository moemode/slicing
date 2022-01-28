function sliceMe() {
    var x;
    var y = 0;
    var z = 0;
    for(x = 0;x<10;x++){
        if(x < 5){
            y+=x;
        }
        else{
            z+=1;  
            break;          
        }
    }    
    if (y>11){
        z = y + y;    
    }    
    return z;
}

sliceMe();
//criteria: line 14