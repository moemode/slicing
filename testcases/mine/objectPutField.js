function sliceMe() {
    var o;
    o = {name: "King Kong", age: 5};
    o.food = "banana";
    o.important = o; //sc
    return;
}

sliceMe();