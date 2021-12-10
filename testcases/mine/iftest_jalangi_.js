J$.iids = {"8":[6,16,6,23],"9":[2,13,2,14],"10":[4,9,4,14],"16":[4,9,4,20],"17":[2,13,2,14],"18":[4,9,4,20],"25":[2,13,2,14],"26":[6,16,6,23],"33":[3,13,3,15],"41":[3,13,3,15],"49":[3,13,3,15],"57":[4,9,4,10],"65":[4,13,4,14],"73":[4,19,4,20],"81":[5,13,5,14],"89":[5,13,5,14],"97":[5,9,5,15],"105":[6,16,6,17],"113":[6,22,6,23],"121":[7,13,7,14],"129":[7,13,7,14],"137":[7,9,7,15],"145":[9,12,9,13],"153":[9,12,9,13],"161":[9,5,9,14],"169":[1,1,10,2],"177":[1,1,10,2],"185":[1,1,10,2],"193":[1,1,10,2],"201":[11,1,11,8],"209":[11,1,11,10],"217":[11,1,11,11],"225":[1,1,12,1],"233":[1,1,10,2],"241":[1,1,12,1],"249":[6,12,8,6],"257":[4,5,8,6],"265":[1,1,10,2],"273":[1,1,10,2],"281":[1,1,12,1],"289":[1,1,12,1],"nBranches":4,"originalCodeFileName":"/home/v/slicing/slicer/testcases/mine/iftest.js","instrumentedCodeFileName":"/home/v/slicing/slicer/testcases/mine/iftest_jalangi_.js","code":"function sliceMe() {    \n    var i = 0;\n    var n = 50;\n    if (n / 2 === 0) {\n        i = 2;\n    } else if (3 === 3) {\n        i = 5;\n    }\n    return i;\n}\nsliceMe();\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(225, '/home/v/slicing/slicer/testcases/mine/iftest_jalangi_.js', '/home/v/slicing/slicer/testcases/mine/iftest.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(169, arguments.callee, this, arguments);
                            arguments = J$.N(177, 'arguments', arguments, 4);
                            J$.N(185, 'i', i, 0);
                            J$.N(193, 'n', n, 0);
                            var i = J$.X1(25, J$.W(17, 'i', J$.T(9, 0, 22, false), i, 1));
                            var n = J$.X1(49, J$.W(41, 'n', J$.T(33, 50, 22, false), n, 1));
                            if (J$.X1(257, J$.C(16, J$.B(18, '===', J$.B(10, '/', J$.R(57, 'n', n, 0), J$.T(65, 2, 22, false), 0), J$.T(73, 0, 22, false), 0)))) {
                                J$.X1(97, i = J$.W(89, 'i', J$.T(81, 2, 22, false), i, 0));
                            } else if (J$.X1(249, J$.C(8, J$.B(26, '===', J$.T(105, 3, 22, false), J$.T(113, 3, 22, false), 0)))) {
                                J$.X1(137, i = J$.W(129, 'i', J$.T(121, 5, 22, false), i, 0));
                            }
                            return J$.X1(161, J$.Rt(153, J$.R(145, 'i', i, 0)));
                        } catch (J$e) {
                            J$.Ex(265, J$e);
                        } finally {
                            if (J$.Fr(273))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(241, 'sliceMe', J$.T(233, sliceMe, 12, false, 169), 0);
            J$.X1(217, J$.F(209, J$.R(201, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(281, J$e);
        } finally {
            if (J$.Sr(289)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
