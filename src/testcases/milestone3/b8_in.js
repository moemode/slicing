function sliceMe(arr) {    
    var length = arr.length;
    var status = "invalid";
    if (arr[length-1] > 0){
        status = "valid";
    }
    console.log(status);
    status;
}

sliceMe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);