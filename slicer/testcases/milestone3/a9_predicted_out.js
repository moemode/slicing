function sliceMe() {
    var z = 2;
    switch (y) {
    case 0:
        break;
    case 1:
    default:
        z = x;
        break;
    }
    return z;
}
sliceMe();