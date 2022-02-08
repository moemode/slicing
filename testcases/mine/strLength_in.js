function sliceMe() {    
    var str = "sample statement";
    var count = 0;
    var length = str.length; // slicing criterion
    for (var i = 0; i < length; i++) {
        if (str.charAt(i) == "q") {
            count += 1;
        }
    }
    return count;
}

sliceMe();