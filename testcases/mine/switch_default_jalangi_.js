J$.iids = {"8":[5,13,5,14],"9":[2,13,2,14],"16":[6,14,6,15],"17":[2,13,2,14],"24":[9,14,9,15],"25":[2,13,2,14],"33":[3,13,3,16],"41":[3,13,3,16],"49":[3,13,3,16],"57":[4,13,4,14],"65":[4,13,4,14],"73":[4,13,4,14],"81":[5,13,5,14],"89":[7,17,7,18],"97":[7,17,7,18],"105":[7,13,7,19],"113":[6,14,6,15],"121":[10,17,10,19],"129":[10,17,10,19],"137":[10,13,10,20],"145":[9,14,9,15],"153":[12,17,12,18],"161":[12,17,12,18],"169":[12,13,12,19],"177":[15,12,15,13],"185":[15,12,15,13],"193":[15,5,15,14],"201":[1,1,16,2],"209":[1,1,16,2],"217":[1,1,16,2],"225":[1,1,16,2],"233":[1,1,16,2],"241":[18,1,18,8],"249":[18,1,18,10],"257":[18,1,18,11],"265":[1,1,18,11],"273":[1,1,16,2],"281":[1,1,18,11],"289":[5,13,5,14],"297":[6,14,6,15],"305":[9,14,9,15],"313":[1,1,16,2],"321":[1,1,16,2],"329":[1,1,18,11],"337":[1,1,18,11],"nBranches":6,"originalCodeFileName":"/home/v/slicing/testcases/mine/switch_default.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/switch_default_jalangi_.js","code":"function sliceMe() {\n    var x = 0;\n    var y = 100;\n    var z = 2;\n    switch (y) {\n        case 0:\n            x = 5;\n            break;\n        case 1:\n            x = 10;\n        default:\n            z = x;\n            break;\n    }\n    return z;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(265, '/home/v/slicing/testcases/mine/switch_default_jalangi_.js', '/home/v/slicing/testcases/mine/switch_default.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(201, arguments.callee, this, arguments);
                            arguments = J$.N(209, 'arguments', arguments, 4);
                            J$.N(217, 'x', x, 0);
                            J$.N(225, 'y', y, 0);
                            J$.N(233, 'z', z, 0);
                            var x = J$.X1(25, J$.W(17, 'x', J$.T(9, 0, 22, false), x, 1));
                            var y = J$.X1(49, J$.W(41, 'y', J$.T(33, 100, 22, false), y, 1));
                            var z = J$.X1(73, J$.W(65, 'z', J$.T(57, 2, 22, false), z, 1));
                            switch (J$.X1(289, J$.C1(8, J$.R(81, 'y', y, 0)))) {
                            case J$.X1(297, J$.C2(16, J$.T(113, 0, 22, false))):
                                J$.X1(105, x = J$.W(97, 'x', J$.T(89, 5, 22, false), x, 0));
                                break;
                            case J$.X1(305, J$.C2(24, J$.T(145, 1, 22, false))):
                                J$.X1(137, x = J$.W(129, 'x', J$.T(121, 10, 22, false), x, 0));
                            default:
                                J$.X1(169, z = J$.W(161, 'z', J$.R(153, 'x', x, 0), z, 0));
                                break;
                            }
                            return J$.X1(193, J$.Rt(185, J$.R(177, 'z', z, 0)));
                        } catch (J$e) {
                            J$.Ex(313, J$e);
                        } finally {
                            if (J$.Fr(321))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(281, 'sliceMe', J$.T(273, sliceMe, 12, false, 201), 0);
            J$.X1(257, J$.F(249, J$.R(241, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(329, J$e);
        } finally {
            if (J$.Sr(337)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
