function sliceMe() {
    var a = 'Program Analysis';
    var b = 'Winter';
    var c = {course: a, semester: b};
    var d = c.course;
    return d;
}

sliceMe();