function sliceMe(number) { 
    if (number === 1) {       
    }  
    else if (number > 1) {        
        for (var i = 2; i < number; i++) {
            if (number % i == 0) {                
                break;
            }
        }       
    }    
}

sliceMe(12);