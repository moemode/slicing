J$.iids = {"8":[7,20,7,26],"9":[2,13,2,15],"10":[4,9,4,14],"16":[5,13,5,20],"17":[2,13,2,15],"18":[5,13,5,20],"24":[10,16,10,23],"25":[2,13,2,15],"26":[7,20,7,26],"32":[4,9,4,14],"33":[3,13,3,14],"34":[10,20,10,23],"41":[3,13,3,14],"42":[10,16,10,23],"49":[3,13,3,14],"50":[11,13,11,17],"57":[4,9,4,10],"65":[4,13,4,14],"73":[5,13,5,14],"81":[5,17,5,20],"89":[6,17,6,18],"97":[6,17,6,18],"105":[6,13,6,19],"113":[7,20,7,21],"121":[7,24,7,26],"129":[8,17,8,18],"137":[8,17,8,18],"145":[8,13,8,19],"153":[10,16,10,17],"161":[10,21,10,23],"169":[11,14,11,17],"177":[11,13,11,17],"185":[11,9,11,18],"193":[13,13,13,14],"201":[13,13,13,14],"209":[13,9,13,15],"217":[15,12,15,13],"225":[15,12,15,13],"233":[15,5,15,14],"241":[1,1,16,2],"249":[1,1,16,2],"257":[1,1,16,2],"265":[1,1,16,2],"273":[18,1,18,8],"281":[18,1,18,10],"289":[18,1,18,11],"297":[1,1,18,11],"305":[1,1,16,2],"313":[1,1,18,11],"321":[7,16,9,10],"329":[5,9,9,10],"337":[10,12,14,6],"345":[4,5,14,6],"353":[1,1,16,2],"361":[1,1,16,2],"369":[1,1,18,11],"377":[1,1,18,11],"nBranches":8,"originalCodeFileName":"/home/v/slicing/testcases/milestone3/preproc_a10_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/milestone3/preproc_a10_in_jalangi_.js","code":"function sliceMe() {\n    var x = 10;\n    var y = 0;\n    if (x > 0) {\n        if (x > 100) {\n            y = x;\n        } else if (x < 50) {\n            y = 1;\n        }\n    } else if (x > -10){\n        x = -100;\n    } else {\n        y = 5;\n    }\n    return y;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(297, '/home/v/slicing/testcases/milestone3/preproc_a10_in_jalangi_.js', '/home/v/slicing/testcases/milestone3/preproc_a10_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(241, arguments.callee, this, arguments);
                            arguments = J$.N(249, 'arguments', arguments, 4);
                            J$.N(257, 'x', x, 0);
                            J$.N(265, 'y', y, 0);
                            var x = J$.X1(25, J$.W(17, 'x', J$.T(9, 10, 22, false), x, 1));
                            var y = J$.X1(49, J$.W(41, 'y', J$.T(33, 0, 22, false), y, 1));
                            if (J$.X1(345, J$.C(32, J$.B(10, '>', J$.R(57, 'x', x, 0), J$.T(65, 0, 22, false), 0)))) {
                                if (J$.X1(329, J$.C(16, J$.B(18, '>', J$.R(73, 'x', x, 0), J$.T(81, 100, 22, false), 0)))) {
                                    J$.X1(105, y = J$.W(97, 'y', J$.R(89, 'x', x, 0), y, 0));
                                } else if (J$.X1(321, J$.C(8, J$.B(26, '<', J$.R(113, 'x', x, 0), J$.T(121, 50, 22, false), 0)))) {
                                    J$.X1(145, y = J$.W(137, 'y', J$.T(129, 1, 22, false), y, 0));
                                }
                            } else if (J$.X1(337, J$.C(24, J$.B(42, '>', J$.R(153, 'x', x, 0), J$.U(34, '-', J$.T(161, 10, 22, false)), 0)))) {
                                J$.X1(185, x = J$.W(177, 'x', J$.U(50, '-', J$.T(169, 100, 22, false)), x, 0));
                            } else {
                                J$.X1(209, y = J$.W(201, 'y', J$.T(193, 5, 22, false), y, 0));
                            }
                            return J$.X1(233, J$.Rt(225, J$.R(217, 'y', y, 0)));
                        } catch (J$e) {
                            J$.Ex(353, J$e);
                        } finally {
                            if (J$.Fr(361))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(313, 'sliceMe', J$.T(305, sliceMe, 12, false, 241), 0);
            J$.X1(289, J$.F(281, J$.R(273, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(369, J$e);
        } finally {
            if (J$.Sr(377)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
