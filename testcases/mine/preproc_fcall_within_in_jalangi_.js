J$.iids = {"9":[2,13,2,21],"17":[2,13,2,21],"25":[2,13,2,21],"33":[3,21,3,22],"41":[3,13,3,23],"49":[3,13,3,23],"57":[3,13,3,23],"65":[4,5,4,6],"73":[4,11,4,17],"81":[4,18,4,19],"89":[4,11,4,20],"97":[4,5,4,20],"105":[4,5,4,21],"113":[5,12,5,13],"121":[5,12,5,15],"129":[5,12,5,15],"137":[5,5,5,16],"145":[1,1,6,2],"153":[1,1,6,2],"161":[1,1,6,2],"169":[1,1,6,2],"177":[9,12,9,14],"185":[9,12,9,14],"193":[9,5,9,15],"201":[8,1,10,2],"209":[8,1,10,2],"217":[8,1,10,2],"225":[12,1,12,8],"233":[12,1,12,10],"241":[12,1,12,11],"249":[1,1,13,1],"257":[1,1,6,2],"265":[1,1,13,1],"273":[8,1,10,2],"281":[1,1,13,1],"289":[1,1,6,2],"297":[1,1,6,2],"305":[8,1,10,2],"313":[8,1,10,2],"321":[1,1,13,1],"329":[1,1,13,1],"nBranches":0,"originalCodeFileName":"/home/v/slicing/testcases/mine/preproc_fcall_within_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/preproc_fcall_within_in_jalangi_.js","code":"function sliceMe() {\n    var b = 'Winter';\n    var c = {value: 2};\n    c.r = callMe(b);\n    return c.r;\n}\n\nfunction callMe(o) {\n    return 10;\n}\n\nsliceMe();\n"};
jalangiLabel2:
    while (true) {
        try {
            J$.Se(249, '/home/v/slicing/testcases/mine/preproc_fcall_within_in_jalangi_.js', '/home/v/slicing/testcases/mine/preproc_fcall_within_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(145, arguments.callee, this, arguments);
                            arguments = J$.N(153, 'arguments', arguments, 4);
                            J$.N(161, 'b', b, 0);
                            J$.N(169, 'c', c, 0);
                            var b = J$.X1(25, J$.W(17, 'b', J$.T(9, 'Winter', 21, false), b, 1));
                            var c = J$.X1(57, J$.W(49, 'c', J$.T(41, {
                                value: J$.T(33, 2, 22, false)
                            }, 11, false), c, 1));
                            J$.X1(105, J$.P(97, J$.R(65, 'c', c, 0), 'r', J$.F(89, J$.R(73, 'callMe', callMe, 1), 0)(J$.R(81, 'b', b, 0)), 0));
                            return J$.X1(137, J$.Rt(129, J$.G(121, J$.R(113, 'c', c, 0), 'r', 0)));
                        } catch (J$e) {
                            J$.Ex(289, J$e);
                        } finally {
                            if (J$.Fr(297))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            function callMe(o) {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(201, arguments.callee, this, arguments);
                            arguments = J$.N(209, 'arguments', arguments, 4);
                            o = J$.N(217, 'o', o, 4);
                            return J$.X1(193, J$.Rt(185, J$.T(177, 10, 22, false)));
                        } catch (J$e) {
                            J$.Ex(305, J$e);
                        } finally {
                            if (J$.Fr(313))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(265, 'sliceMe', J$.T(257, sliceMe, 12, false, 145), 0);
            callMe = J$.N(281, 'callMe', J$.T(273, callMe, 12, false, 201), 0);
            J$.X1(241, J$.F(233, J$.R(225, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(321, J$e);
        } finally {
            if (J$.Sr(329)) {
                J$.L();
                continue jalangiLabel2;
            } else {
                J$.L();
                break jalangiLabel2;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
