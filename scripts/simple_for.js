function sliceMe(arr) {
    var length = arr.length;
    if (arr[length-1] > 0){
        status = "valid";
    }
    console.log(status);
}

sliceMe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);