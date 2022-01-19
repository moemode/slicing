function sliceMe() {
    var a = 'Program Analysis';
    var c = {};
    c.course = a;
    var d = c.course;
    return d;
}

sliceMe();