function sliceMe() {
    var x = 10;
    var y = 0;
    if (x > 0) {
        if (x > 100) {
            y = x;
        } else if (x < 50) {
            y = 1;
        }
    } else if (x > -10){
        x = -100;
    } else {
        y = 5;
    }
    return y;
}

sliceMe();