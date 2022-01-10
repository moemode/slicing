J$.iids = {"8":[4,17,4,21],"9":[2,13,2,14],"10":[2,16,2,21],"16":[3,12,3,17],"17":[2,13,2,14],"18":[2,23,2,26],"24":[2,16,2,21],"25":[2,16,2,17],"33":[2,20,2,21],"34":[2,23,2,26],"42":[3,12,3,17],"49":[2,23,2,24],"57":[2,23,2,26],"73":[3,12,3,13],"81":[3,16,3,17],"89":[4,17,4,21],"97":[1,1,8,2],"105":[1,1,8,2],"113":[10,1,10,8],"121":[10,1,10,10],"129":[10,1,10,11],"137":[1,1,10,11],"145":[1,1,8,2],"153":[1,1,10,11],"161":[4,13,5,23],"169":[3,9,6,10],"177":[2,5,7,6],"185":[2,5,7,6],"193":[2,5,7,6],"201":[1,1,8,2],"209":[1,1,8,2],"217":[1,1,10,11],"225":[1,1,10,11],"nBranches":6,"originalCodeFileName":"/home/v/slicing/testcases/mine/augmented_break_unreachable.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/augmented_break_unreachable_jalangi_.js","code":"function sliceMe() {    \n    for(i = 0; i < 5; i++) {\n        if(i > 6) {\n            if (true)\n                break;\n        }\n    }\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(137, '/home/v/slicing/testcases/mine/augmented_break_unreachable_jalangi_.js', '/home/v/slicing/testcases/mine/augmented_break_unreachable.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(97, arguments.callee, this, arguments);
                            arguments = J$.N(105, 'arguments', arguments, 4);
                            for (J$.X1(185, i = J$.W(17, 'i', J$.T(9, 0, 22, false), J$.I(typeof i === 'undefined' ? undefined : i), 4)); J$.X1(177, J$.C(24, J$.B(10, '<', J$.R(25, 'i', i, 2), J$.T(33, 5, 22, false), 0))); J$.X1(193, J$.B(34, '-', i = J$.W(57, 'i', J$.B(26, '+', J$.U(18, '+', J$.R(49, 'i', i, 2)), J$.T(41, 1, 22, false), 0), J$.I(typeof i === 'undefined' ? undefined : i), 4), J$.T(65, 1, 22, false), 0))) {
                                if (J$.X1(169, J$.C(16, J$.B(42, '>', J$.R(73, 'i', i, 2), J$.T(81, 6, 22, false), 0)))) {
                                    if (J$.X1(161, J$.C(8, J$.T(89, true, 23, false))))
                                        break;
                                }
                            }
                        } catch (J$e) {
                            J$.Ex(201, J$e);
                        } finally {
                            if (J$.Fr(209))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(153, 'sliceMe', J$.T(145, sliceMe, 12, false, 97), 0);
            J$.X1(129, J$.F(121, J$.R(113, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(217, J$e);
        } finally {
            if (J$.Sr(225)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
