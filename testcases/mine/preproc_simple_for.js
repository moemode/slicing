function sliceMe() {
    for (i = 0; i < 5; i++) {
        if (i == 3) {
            x = 5;
        }
        if (i == 4) {
            x = 6;
        }
    }
    return x;
}

sliceMe();