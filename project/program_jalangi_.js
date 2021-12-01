J$.iids = {"9":[1,5,1,9],"10":[2,5,2,7],"17":[1,5,1,9],"25":[1,1,1,10],"33":[2,6,2,7],"41":[2,5,2,7],"49":[2,1,2,8],"57":[1,1,2,8],"65":[1,1,2,8],"73":[1,1,2,8],"nBranches":0,"originalCodeFileName":"/home/v/slicing/project/program.js","instrumentedCodeFileName":"/home/v/slicing/project/program_jalangi_.js","code":"x = true;\ny = !x;"};
jalangiLabel0:
    while (true) {
        try {
            J$.Se(57, '/home/v/slicing/project/program_jalangi_.js', '/home/v/slicing/project/program.js');
            J$.X1(25, x = J$.W(17, 'x', J$.T(9, true, 23, false), J$.I(typeof x === 'undefined' ? undefined : x), 4));
            J$.X1(49, y = J$.W(41, 'y', J$.U(10, '!', J$.R(33, 'x', x, 2)), J$.I(typeof y === 'undefined' ? undefined : y), 4));
        } catch (J$e) {
            J$.Ex(65, J$e);
        } finally {
            if (J$.Sr(73)) {
                J$.L();
                continue jalangiLabel0;
            } else {
                J$.L();
                break jalangiLabel0;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
