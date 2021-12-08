function sliceMe() {
    var c = {course: {}};
    var p = {name: "Mack"}
    c.course.instructor = p.name;
    return c.course.instructor;
}

sliceMe();

/*
        endExpression(iid=65) at (/home/v/slicing/slicer/testcases/mine/fields1.js:3:13:3:27)
        read(iid=73, name=c, val=object(id=15), isGlobal=false, isScriptLocal=false) with frameId=frame(id=9) at (/home/v/slicing/slicer/testcases/mine/fields1.js:4:5:4:6)
        getFieldPre(iid=81, base=object(id=15), offset="course", isComputed=false, isOpAssign=false, isMethodCall=false) with actualBase=object(id=15) at (/home/v/slicing/slicer/testcases/mine/fields1.js:4:5:4:13)
        getField(iid=81, base=object(id=15), offset="course", val=object(id=13), isComputed=false, isOpAssign=false, isMethodCall=false) with actualBase=object(id=15) at (/home/v/slicing/slicer/testcases/mine/fields1.js:4:5:4:13)
        read(iid=89, name=p, val=object(id=17), isGlobal=false, isScriptLocal=false) with frameId=frame(id=9) at (/home/v/slicing/slicer/testcases/mine/fields1.js:4:27:4:28)
        getFieldPre(iid=97, base=object(id=17), offset="name", isComputed=false, isOpAssign=false, isMethodCall=false) with actualBase=object(id=17) at (/home/v/slicing/slicer/testcases/mine/fields1.js:4:27:4:33)
        getField(iid=97, base=object(id=17), offset="name", val="Mack", isComputed=false, isOpAssign=false, isMethodCall=false) with actualBase=object(id=17) at (/home/v/slicing/slicer/testcases/mine/fields1.js:4:27:4:33)
        putFieldPre(iid=105, base=object(id=13), offset="instructor", val="Mack", isComputed=false, isOpAssign=false) at (/home/v/slicing/slicer/testcases/mine/fields1.js:4:5:4:33)
        putField(iid=105, base=object(id=13), offset="instructor", val="Mack", isComputed=false, isOpAssign=false) at (/home/v/slicing/slicer/testcases/mine/fields1.js:4:5:4:33)
        endExpression(iid=113) at (/home/v/slicing/slicer/testcases/mine/fields1.js:4:5:4:34)
*/