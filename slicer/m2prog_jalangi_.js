J$.iids = {"9":[4,9,4,10],"10":[6,9,6,14],"17":[4,9,4,10],"18":[7,10,7,11],"25":[4,5,4,11],"33":[5,9,5,10],"41":[5,9,5,10],"49":[5,5,5,11],"57":[6,9,6,10],"65":[6,13,6,14],"73":[6,9,6,14],"81":[6,5,6,15],"89":[7,10,7,11],"97":[7,5,7,6],"105":[7,5,7,11],"113":[7,5,7,12],"121":[8,12,8,13],"129":[8,12,8,13],"137":[8,5,8,14],"145":[1,1,9,2],"153":[1,1,9,2],"161":[1,1,9,2],"169":[1,1,9,2],"177":[10,1,10,8],"185":[10,1,10,10],"193":[10,1,10,11],"201":[1,1,11,1],"209":[1,1,9,2],"217":[1,1,11,1],"225":[1,1,9,2],"233":[1,1,9,2],"241":[1,1,11,1],"249":[1,1,11,1],"nBranches":0,"originalCodeFileName":"/home/v/coding/slicing/slicer/m2prog.js","instrumentedCodeFileName":"/home/v/coding/slicing/slicer/m2prog_jalangi_.js","code":"function sliceMe() {\n    var x;\n    var y;\n    x = 1;\n    y = 2;\n    x = x + y;\n    y += 2;\n    return y; // slicing criterion\n}\nsliceMe();\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(201, '/home/v/coding/slicing/slicer/m2prog_jalangi_.js', '/home/v/coding/slicing/slicer/m2prog.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(145, arguments.callee, this, arguments);
                            arguments = J$.N(153, 'arguments', arguments, 4);
                            J$.N(161, 'x', x, 0);
                            J$.N(169, 'y', y, 0);
                            var x;
                            var y;
                            J$.X1(25, x = J$.W(17, 'x', J$.T(9, 1, 22, false), x, 0));
                            J$.X1(49, y = J$.W(41, 'y', J$.T(33, 2, 22, false), y, 0));
                            J$.X1(81, x = J$.W(73, 'x', J$.B(10, '+', J$.R(57, 'x', x, 0), J$.R(65, 'y', y, 0), 0), x, 0));
                            J$.X1(113, y = J$.W(105, 'y', J$.B(18, '+', J$.R(97, 'y', y, 0), J$.T(89, 2, 22, false), 0), y, 0));
                            return J$.X1(137, J$.Rt(129, J$.R(121, 'y', y, 0)));
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
            sliceMe = J$.N(217, 'sliceMe', J$.T(209, sliceMe, 12, false, 145), 0);
            J$.X1(193, J$.F(185, J$.R(177, 'sliceMe', sliceMe, 1), 0)());
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
