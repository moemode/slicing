function sliceMe() {
    var a = {course:'Program Analysis'};
    var b = 'Winter';
    var c = {};
    c = a;
    c.semester = b;
    return a;
}

sliceMe();