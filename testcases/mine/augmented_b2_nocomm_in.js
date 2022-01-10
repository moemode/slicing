function sliceMe() {    
    var str = "sample statement";
    var letter = "s"
    var length = str.length;
    var count = 0;
    for (var i = 0; i < length; i++) {
        if (str.charAt(i) == letter) {
            count += 1;
        }
    }
    return count;
}

sliceMe();