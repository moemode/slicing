function sliceMe() {
    var c = {course: {}};
    var p = {name: "Mack"}
    c.course.instructor = p.name; // sc
    return c.course.instructor;
}

sliceMe();