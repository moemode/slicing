J$.iids = {"8":[9,17,9,21],"9":[2,13,2,14],"16":[16,17,16,21],"17":[2,13,2,14],"24":[5,13,5,14],"25":[2,13,2,14],"32":[6,14,6,15],"33":[3,13,3,14],"40":[11,14,11,15],"41":[3,13,3,14],"49":[3,13,3,14],"57":[4,13,4,14],"65":[4,13,4,14],"73":[4,13,4,14],"81":[5,13,5,14],"89":[7,17,7,18],"97":[7,17,7,18],"105":[7,13,7,19],"113":[9,17,9,21],"121":[6,14,6,15],"129":[12,17,12,19],"137":[12,17,12,19],"145":[12,13,12,20],"153":[11,14,11,15],"161":[14,17,14,18],"169":[14,17,14,18],"177":[14,13,14,19],"185":[16,17,16,21],"193":[19,12,19,13],"201":[19,12,19,13],"209":[19,5,19,14],"217":[1,1,20,2],"225":[1,1,20,2],"233":[1,1,20,2],"241":[1,1,20,2],"249":[1,1,20,2],"257":[22,1,22,8],"265":[22,1,22,10],"273":[22,1,22,11],"281":[1,1,22,11],"289":[1,1,20,2],"297":[1,1,22,11],"305":[9,13,10,23],"313":[16,13,17,23],"321":[5,13,5,14],"329":[6,14,6,15],"337":[11,14,11,15],"345":[1,1,20,2],"353":[1,1,20,2],"361":[1,1,22,11],"369":[1,1,22,11],"nBranches":10,"originalCodeFileName":"/home/v/coding/slicing/testcases/milestone3/preproc_a9_in.js","instrumentedCodeFileName":"/home/v/coding/slicing/testcases/milestone3/preproc_a9_in_jalangi_.js","code":"function sliceMe() {\n    var x = 0;\n    var y = 1;\n    var z = 2;\n    switch (y) {\n        case 0:\n            x = 5;\n\n            if (true)\n                break;\n        case 1:\n            x = 10;\n        default:\n            z = x;\n\n            if (true)\n                break;\n    }\n    return z;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(281, '/home/v/coding/slicing/testcases/milestone3/preproc_a9_in_jalangi_.js', '/home/v/coding/slicing/testcases/milestone3/preproc_a9_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(217, arguments.callee, this, arguments);
                            arguments = J$.N(225, 'arguments', arguments, 4);
                            J$.N(233, 'x', x, 0);
                            J$.N(241, 'y', y, 0);
                            J$.N(249, 'z', z, 0);
                            var x = J$.X1(25, J$.W(17, 'x', J$.T(9, 0, 22, false), x, 1));
                            var y = J$.X1(49, J$.W(41, 'y', J$.T(33, 1, 22, false), y, 1));
                            var z = J$.X1(73, J$.W(65, 'z', J$.T(57, 2, 22, false), z, 1));
                            switch (J$.X1(321, J$.C1(24, J$.R(81, 'y', y, 0)))) {
                            case J$.X1(329, J$.C2(32, J$.T(121, 0, 22, false))):
                                J$.X1(105, x = J$.W(97, 'x', J$.T(89, 5, 22, false), x, 0));
                                if (J$.X1(305, J$.C(8, J$.T(113, true, 23, false))))
                                    break;
                            case J$.X1(337, J$.C2(40, J$.T(153, 1, 22, false))):
                                J$.X1(145, x = J$.W(137, 'x', J$.T(129, 10, 22, false), x, 0));
                            default:
                                J$.X1(177, z = J$.W(169, 'z', J$.R(161, 'x', x, 0), z, 0));
                                if (J$.X1(313, J$.C(16, J$.T(185, true, 23, false))))
                                    break;
                            }
                            return J$.X1(209, J$.Rt(201, J$.R(193, 'z', z, 0)));
                        } catch (J$e) {
                            J$.Ex(345, J$e);
                        } finally {
                            if (J$.Fr(353))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(297, 'sliceMe', J$.T(289, sliceMe, 12, false, 217), 0);
            J$.X1(273, J$.F(265, J$.R(257, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(361, J$e);
        } finally {
            if (J$.Sr(369)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
