function sliceMe() {
    var b = 'Winter';
    var c = {value: 2};
    c.r = callMe(b);
    return c.r;
}

function callMe(o) {
    return 10;
}

sliceMe();
