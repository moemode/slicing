J$.iids = {"8":[6,17,6,21],"9":[2,13,2,14],"10":[4,13,4,18],"16":[5,13,5,17],"17":[2,13,2,14],"24":[3,12,3,16],"25":[2,13,2,14],"33":[3,12,3,16],"41":[4,13,4,14],"49":[4,17,4,18],"57":[4,13,4,18],"65":[4,9,4,19],"73":[5,13,5,17],"81":[6,17,6,21],"89":[10,12,10,13],"97":[10,12,10,13],"105":[10,5,10,14],"113":[1,1,11,2],"121":[1,1,11,2],"129":[1,1,11,2],"137":[12,1,12,8],"145":[12,1,12,10],"153":[12,1,12,11],"161":[1,1,12,11],"169":[1,1,11,2],"177":[1,1,12,11],"185":[6,13,7,23],"193":[5,9,8,10],"201":[3,5,9,6],"209":[1,1,11,2],"217":[1,1,11,2],"225":[1,1,12,11],"233":[1,1,12,11],"nBranches":6,"originalCodeFileName":"/home/v/slicing/testcases/mine/preproc_break_fail2_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/preproc_break_fail2_in_jalangi_.js","code":"function sliceMe() {\n    var r = 1;\n    while (true) {\n        r = r + 1;\n        if (true) {\n            if (true)\n                break; //slicing criterion;\n        }\n    }\n    return r;\n}\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(161, '/home/v/slicing/testcases/mine/preproc_break_fail2_in_jalangi_.js', '/home/v/slicing/testcases/mine/preproc_break_fail2_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(113, arguments.callee, this, arguments);
                            arguments = J$.N(121, 'arguments', arguments, 4);
                            J$.N(129, 'r', r, 0);
                            var r = J$.X1(25, J$.W(17, 'r', J$.T(9, 1, 22, false), r, 1));
                            while (J$.X1(201, J$.C(24, J$.T(33, true, 23, false)))) {
                                J$.X1(65, r = J$.W(57, 'r', J$.B(10, '+', J$.R(41, 'r', r, 0), J$.T(49, 1, 22, false), 0), r, 0));
                                if (J$.X1(193, J$.C(16, J$.T(73, true, 23, false)))) {
                                    if (J$.X1(185, J$.C(8, J$.T(81, true, 23, false))))
                                        break;
                                }
                            }
                            return J$.X1(105, J$.Rt(97, J$.R(89, 'r', r, 0)));
                        } catch (J$e) {
                            J$.Ex(209, J$e);
                        } finally {
                            if (J$.Fr(217))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(177, 'sliceMe', J$.T(169, sliceMe, 12, false, 113), 0);
            J$.X1(153, J$.F(145, J$.R(137, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(225, J$e);
        } finally {
            if (J$.Sr(233)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
