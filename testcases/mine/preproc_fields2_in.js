function sliceMe() {
    var c = {course: {}};
    var p = {name: "Mack"}
    c.course.instructor = p.name;
    return c.course; //sc
}

sliceMe();