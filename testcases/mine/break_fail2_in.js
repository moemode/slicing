function sliceMe() {
    var r = 1;
    while (true) {
        r = r + 1;
        if (true) {
            break; //slicing criterion
        }
    }
    return r;
}
sliceMe();