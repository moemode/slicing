function sliceMe(number) {    
    var isPrime = true;
    var status = "";    
    if (number === 1) {
        status = "neither";
    }  
    else if (number > 1) {        
        for (var i = 2; i < number; i++) {
            if (number % i == 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            status = "prime"
        } else {
           status = "composite"
        }
    }
    else {
        status = "composite"
    }
    console.log(status);
}

sliceMe(12);
