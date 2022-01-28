J$.iids = {"8":[6,13,6,17],"9":[2,13,2,14],"10":[5,13,5,18],"16":[4,11,4,15],"17":[2,13,2,14],"18":[6,13,6,17],"25":[2,13,2,14],"33":[3,13,3,14],"41":[3,13,3,14],"49":[3,13,3,14],"57":[4,11,4,15],"65":[5,13,5,14],"73":[5,17,5,18],"81":[5,13,5,18],"89":[5,9,5,19],"97":[6,13,6,14],"105":[6,16,6,17],"113":[10,12,10,13],"121":[10,12,10,13],"129":[10,5,10,14],"137":[1,1,11,2],"145":[1,1,11,2],"153":[1,1,11,2],"161":[1,1,11,2],"169":[1,1,11,2],"177":[1,1,11,2],"185":[1,1,11,2],"193":[6,9,8,10],"201":[4,5,9,6],"209":[1,1,11,2],"217":[1,1,11,2],"225":[1,1,11,2],"233":[1,1,11,2],"nBranches":4,"originalCodeFileName":"/home/v/slicing/testcases/mine/break_fail_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/break_fail_in_jalangi_.js","code":"function sliceMe() {    \n    var r = 1\n    var c = 0\n    while(true) {\n        r = r + 1;\n        if (c==0) {\n            break;\n        }\n    }\n    return r;\n}"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(169, '/home/v/slicing/testcases/mine/break_fail_in_jalangi_.js', '/home/v/slicing/testcases/mine/break_fail_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(137, arguments.callee, this, arguments);
                            arguments = J$.N(145, 'arguments', arguments, 4);
                            J$.N(153, 'r', r, 0);
                            J$.N(161, 'c', c, 0);
                            var r = J$.X1(25, J$.W(17, 'r', J$.T(9, 1, 22, false), r, 1));
                            var c = J$.X1(49, J$.W(41, 'c', J$.T(33, 0, 22, false), c, 1));
                            while (J$.X1(201, J$.C(16, J$.T(57, true, 23, false)))) {
                                J$.X1(89, r = J$.W(81, 'r', J$.B(10, '+', J$.R(65, 'r', r, 0), J$.T(73, 1, 22, false), 0), r, 0));
                                if (J$.X1(193, J$.C(8, J$.B(18, '==', J$.R(97, 'c', c, 0), J$.T(105, 0, 22, false), 0)))) {
                                    break;
                                }
                            }
                            return J$.X1(129, J$.Rt(121, J$.R(113, 'r', r, 0)));
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
            sliceMe = J$.N(185, 'sliceMe', J$.T(177, sliceMe, 12, false, 137), 0);
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
