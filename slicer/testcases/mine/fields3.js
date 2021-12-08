function sliceMe() {
    var c = { "course": {} };
    var p = { "name": "Mack" };
    c.course = p;
    p.name = "Cheese"
    p.game = "Soccer"
    return c.course.name;
}
sliceMe();