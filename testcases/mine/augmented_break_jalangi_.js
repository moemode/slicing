J$.iids = {"8":[3,13,3,17],"9":[2,13,2,14],"10":[2,16,2,21],"16":[2,16,2,21],"17":[2,13,2,14],"18":[2,23,2,26],"25":[2,16,2,17],"33":[2,20,2,21],"34":[2,23,2,26],"49":[2,23,2,24],"57":[2,23,2,26],"73":[3,13,3,17],"81":[1,1,6,2],"89":[1,1,6,2],"97":[8,1,8,8],"105":[8,1,8,10],"113":[8,1,8,11],"121":[1,1,8,11],"129":[1,1,6,2],"137":[1,1,8,11],"145":[3,9,4,19],"153":[2,5,5,6],"161":[2,5,5,6],"169":[2,5,5,6],"177":[1,1,6,2],"185":[1,1,6,2],"193":[1,1,8,11],"201":[1,1,8,11],"nBranches":4,"originalCodeFileName":"/home/v/slicing/testcases/mine/augmented_break.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/augmented_break_jalangi_.js","code":"function sliceMe() {    \n    for(i = 0; i < 5; i++) {\n        if (true)\n            break;\n    }\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(121, '/home/v/slicing/testcases/mine/augmented_break_jalangi_.js', '/home/v/slicing/testcases/mine/augmented_break.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(81, arguments.callee, this, arguments);
                            arguments = J$.N(89, 'arguments', arguments, 4);
                            for (J$.X1(161, i = J$.W(17, 'i', J$.T(9, 0, 22, false), J$.I(typeof i === 'undefined' ? undefined : i), 4)); J$.X1(153, J$.C(16, J$.B(10, '<', J$.R(25, 'i', i, 2), J$.T(33, 5, 22, false), 0))); J$.X1(169, J$.B(34, '-', i = J$.W(57, 'i', J$.B(26, '+', J$.U(18, '+', J$.R(49, 'i', i, 2)), J$.T(41, 1, 22, false), 0), J$.I(typeof i === 'undefined' ? undefined : i), 4), J$.T(65, 1, 22, false), 0))) {
                                if (J$.X1(145, J$.C(8, J$.T(73, true, 23, false))))
                                    break;
                            }
                        } catch (J$e) {
                            J$.Ex(177, J$e);
                        } finally {
                            if (J$.Fr(185))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(137, 'sliceMe', J$.T(129, sliceMe, 12, false, 81), 0);
            J$.X1(113, J$.F(105, J$.R(97, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(193, J$e);
        } finally {
            if (J$.Sr(201)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
