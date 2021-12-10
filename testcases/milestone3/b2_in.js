function sliceMe() {    
    var str = "sample statement";
    var letter = "s"
    var length = str.length;
    var count = 0;
    // looping through the items
    for (var i = 0; i < length; i++) {
        // check if the character is at that position
        if (str.charAt(i) == letter) {
            count += 1;
        }
    }
    return count;
}

sliceMe();