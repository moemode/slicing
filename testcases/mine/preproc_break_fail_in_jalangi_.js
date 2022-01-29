J$.iids = {"8":[7,17,7,21],"9":[2,13,2,14],"10":[5,13,5,18],"16":[6,13,6,19],"17":[2,13,2,14],"18":[6,13,6,19],"24":[4,12,4,16],"25":[2,13,2,14],"33":[3,13,3,14],"41":[3,13,3,14],"49":[3,13,3,14],"57":[4,12,4,16],"65":[5,13,5,14],"73":[5,17,5,18],"81":[5,13,5,18],"89":[5,9,5,19],"97":[6,13,6,14],"105":[6,18,6,19],"113":[7,17,7,21],"121":[11,12,11,13],"129":[11,12,11,13],"137":[11,5,11,14],"145":[1,1,12,2],"153":[1,1,12,2],"161":[1,1,12,2],"169":[1,1,12,2],"177":[1,1,12,2],"185":[1,1,12,2],"193":[1,1,12,2],"201":[7,13,8,23],"209":[6,9,9,10],"217":[4,5,10,6],"225":[1,1,12,2],"233":[1,1,12,2],"241":[1,1,12,2],"249":[1,1,12,2],"nBranches":6,"originalCodeFileName":"/home/v/slicing/testcases/mine/preproc_break_fail_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/preproc_break_fail_in_jalangi_.js","code":"function sliceMe() {\n    var r = 1;\n    var c = 0;\n    while (true) {\n        r = r + 1;\n        if (c == 0) {\n            if (true)\n                break;\n        }\n    }\n    return r;\n}"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(177, '/home/v/slicing/testcases/mine/preproc_break_fail_in_jalangi_.js', '/home/v/slicing/testcases/mine/preproc_break_fail_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(145, arguments.callee, this, arguments);
                            arguments = J$.N(153, 'arguments', arguments, 4);
                            J$.N(161, 'r', r, 0);
                            J$.N(169, 'c', c, 0);
                            var r = J$.X1(25, J$.W(17, 'r', J$.T(9, 1, 22, false), r, 1));
                            var c = J$.X1(49, J$.W(41, 'c', J$.T(33, 0, 22, false), c, 1));
                            while (J$.X1(217, J$.C(24, J$.T(57, true, 23, false)))) {
                                J$.X1(89, r = J$.W(81, 'r', J$.B(10, '+', J$.R(65, 'r', r, 0), J$.T(73, 1, 22, false), 0), r, 0));
                                if (J$.X1(209, J$.C(16, J$.B(18, '==', J$.R(97, 'c', c, 0), J$.T(105, 0, 22, false), 0)))) {
                                    if (J$.X1(201, J$.C(8, J$.T(113, true, 23, false))))
                                        break;
                                }
                            }
                            return J$.X1(137, J$.Rt(129, J$.R(121, 'r', r, 0)));
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
            sliceMe = J$.N(193, 'sliceMe', J$.T(185, sliceMe, 12, false, 145), 0);
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
