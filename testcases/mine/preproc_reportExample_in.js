function sliceMe() {
    var c, r;
    var s = 5;
    for(c = 1; c < 100; c += 2) {
        s += c;
        if (c == 1) if (true)
            break;
    }
    if(s == 6) {
        r= "good job";
    } else {
        r = "bad";
    }
    return r; //sc
}
sliceMe();