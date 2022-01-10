function sliceMe() {
    var x = 0;
    var y = 1;
    var z = 2;
    switch (y) {
        case 0:
            x = 5;

            if (true)
                break;
        case 1:
            x = 10;
        default:
            z = x;

            if (true)
                break;
    }
    return z;
}

sliceMe();