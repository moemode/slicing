function sliceMe() {
    var x = 0;
    var y = 1;
    var z = 2;
    switch (y) {
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