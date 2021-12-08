function sliceMe() {
    var c = { "course": {} };
    var p = { "name": "Mack" };
    c.course = p;
    p.name = "Cheese"
    return c.course.name;
}
sliceMe();