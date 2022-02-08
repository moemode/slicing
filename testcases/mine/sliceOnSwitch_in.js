function sliceMe() {
    var x = 0;
    var y = 100;
    var z = 2;
    switch (y) { //slicing criterion
        case 0:
            x = 5;
            break;
        case 1:
            x = 10;
        default:
            z = x;
            break;
    }
    return z;
}

sliceMe();