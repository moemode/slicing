J$.iids = {"8":[2,16,2,21],"9":[2,13,2,14],"10":[2,16,2,21],"17":[2,13,2,14],"18":[2,23,2,26],"25":[2,16,2,17],"33":[2,20,2,21],"34":[2,23,2,26],"49":[2,23,2,24],"57":[2,23,2,26],"73":[1,1,5,2],"81":[1,1,5,2],"89":[7,1,7,8],"97":[7,1,7,10],"105":[7,1,7,11],"113":[1,1,7,11],"121":[1,1,5,2],"129":[1,1,7,11],"137":[2,5,4,6],"145":[2,5,4,6],"153":[2,5,4,6],"161":[1,1,5,2],"169":[1,1,5,2],"177":[1,1,7,11],"185":[1,1,7,11],"nBranches":2,"originalCodeFileName":"/home/v/slicing/testcases/mine/break.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/break_jalangi_.js","code":"function sliceMe() {    \n    for(i = 0; i < 5; i++) {\n        break;\n    }\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(113, '/home/v/slicing/testcases/mine/break_jalangi_.js', '/home/v/slicing/testcases/mine/break.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(73, arguments.callee, this, arguments);
                            arguments = J$.N(81, 'arguments', arguments, 4);
                            for (J$.X1(145, i = J$.W(17, 'i', J$.T(9, 0, 22, false), J$.I(typeof i === 'undefined' ? undefined : i), 4)); J$.X1(137, J$.C(8, J$.B(10, '<', J$.R(25, 'i', i, 2), J$.T(33, 5, 22, false), 0))); J$.X1(153, J$.B(34, '-', i = J$.W(57, 'i', J$.B(26, '+', J$.U(18, '+', J$.R(49, 'i', i, 2)), J$.T(41, 1, 22, false), 0), J$.I(typeof i === 'undefined' ? undefined : i), 4), J$.T(65, 1, 22, false), 0))) {
                                break;
                            }
                        } catch (J$e) {
                            J$.Ex(161, J$e);
                        } finally {
                            if (J$.Fr(169))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(129, 'sliceMe', J$.T(121, sliceMe, 12, false, 73), 0);
            J$.X1(105, J$.F(97, J$.R(89, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(177, J$e);
        } finally {
            if (J$.Sr(185)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
