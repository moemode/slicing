function sliceMe() {
    var c, r;
    var s = 5;
    for(c = 1; c < 100; c += 2) {
        s += c;
        if(c == 1) break;
    }
    if(s == 6) {
        r= "good job";
    }
    return r; // sc
}
sliceMe();