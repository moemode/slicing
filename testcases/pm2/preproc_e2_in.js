function sliceMe() {
    var a = {course:'Program Analysis'};
    var b = 'Winter';
    var c = {};
    c = a;
    c.semester = b;
    var d = c.course;
    return a;
}

sliceMe();
