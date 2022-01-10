J$.iids = {"8":[4,17,4,21],"9":[2,13,2,14],"10":[2,16,2,21],"16":[3,12,3,18],"17":[2,13,2,14],"18":[2,23,2,26],"24":[2,16,2,21],"25":[2,16,2,17],"33":[2,20,2,21],"34":[2,23,2,26],"42":[3,12,3,18],"49":[2,23,2,24],"57":[2,23,2,26],"73":[3,12,3,13],"81":[3,17,3,18],"89":[4,17,4,21],"97":[8,12,8,13],"105":[8,12,8,13],"113":[8,5,8,14],"121":[1,1,9,2],"129":[1,1,9,2],"137":[11,1,11,8],"145":[11,1,11,10],"153":[11,1,11,11],"161":[1,1,11,11],"169":[1,1,9,2],"177":[1,1,11,11],"185":[4,13,5,23],"193":[3,9,6,10],"201":[2,5,7,6],"209":[2,5,7,6],"217":[2,5,7,6],"225":[1,1,9,2],"233":[1,1,9,2],"241":[1,1,11,11],"249":[1,1,11,11],"nBranches":6,"originalCodeFileName":"/home/v/slicing/testcases/mine/augmented_break_reachible_in_if.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/augmented_break_reachible_in_if_jalangi_.js","code":"function sliceMe() {    \n    for(i = 0; i < 5; i++) {\n        if(i == 3) {\n            if (true)\n                break;\n        }\n    }\n    return 0;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(161, '/home/v/slicing/testcases/mine/augmented_break_reachible_in_if_jalangi_.js', '/home/v/slicing/testcases/mine/augmented_break_reachible_in_if.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(121, arguments.callee, this, arguments);
                            arguments = J$.N(129, 'arguments', arguments, 4);
                            for (J$.X1(209, i = J$.W(17, 'i', J$.T(9, 0, 22, false), J$.I(typeof i === 'undefined' ? undefined : i), 4)); J$.X1(201, J$.C(24, J$.B(10, '<', J$.R(25, 'i', i, 2), J$.T(33, 5, 22, false), 0))); J$.X1(217, J$.B(34, '-', i = J$.W(57, 'i', J$.B(26, '+', J$.U(18, '+', J$.R(49, 'i', i, 2)), J$.T(41, 1, 22, false), 0), J$.I(typeof i === 'undefined' ? undefined : i), 4), J$.T(65, 1, 22, false), 0))) {
                                if (J$.X1(193, J$.C(16, J$.B(42, '==', J$.R(73, 'i', i, 2), J$.T(81, 3, 22, false), 0)))) {
                                    if (J$.X1(185, J$.C(8, J$.T(89, true, 23, false))))
                                        break;
                                }
                            }
                            return J$.X1(113, J$.Rt(105, J$.T(97, 0, 22, false)));
                        } catch (J$e) {
                            J$.Ex(225, J$e);
                        } finally {
                            if (J$.Fr(233))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(177, 'sliceMe', J$.T(169, sliceMe, 12, false, 121), 0);
            J$.X1(153, J$.F(145, J$.R(137, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(241, J$e);
        } finally {
            if (J$.Sr(249)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
