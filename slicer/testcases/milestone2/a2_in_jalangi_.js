J$.iids = {"9":[3,9,3,10],"10":[5,9,5,14],"17":[3,9,3,10],"25":[3,5,3,11],"33":[4,9,4,10],"41":[4,9,4,10],"49":[4,5,4,11],"57":[5,9,5,10],"65":[5,13,5,14],"73":[5,9,5,14],"81":[5,5,5,15],"89":[6,12,6,13],"97":[6,12,6,13],"105":[6,5,6,14],"113":[1,1,7,2],"121":[1,1,7,2],"129":[1,1,7,2],"137":[1,1,7,2],"145":[1,1,7,2],"153":[9,1,9,8],"161":[9,1,9,10],"169":[9,1,9,11],"177":[1,1,9,11],"185":[1,1,7,2],"193":[1,1,9,11],"201":[1,1,7,2],"209":[1,1,7,2],"217":[1,1,9,11],"225":[1,1,9,11],"nBranches":0,"originalCodeFileName":"/home/v/coding/slicing/slicer/testcases/milestone2/a2_in.js","instrumentedCodeFileName":"/home/v/coding/slicing/slicer/testcases/milestone2/a2_in_jalangi_.js","code":"function sliceMe() {\n    var x, y, z;\n    x = 1;\n    y = 2;\n    z = x + y;\n    return x;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(177, '/home/v/coding/slicing/slicer/testcases/milestone2/a2_in_jalangi_.js', '/home/v/coding/slicing/slicer/testcases/milestone2/a2_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(113, arguments.callee, this, arguments);
                            arguments = J$.N(121, 'arguments', arguments, 4);
                            J$.N(129, 'x', x, 0);
                            J$.N(137, 'y', y, 0);
                            J$.N(145, 'z', z, 0);
                            var x, y, z;
                            J$.X1(25, x = J$.W(17, 'x', J$.T(9, 1, 22, false), x, 0));
                            J$.X1(49, y = J$.W(41, 'y', J$.T(33, 2, 22, false), y, 0));
                            J$.X1(81, z = J$.W(73, 'z', J$.B(10, '+', J$.R(57, 'x', x, 0), J$.R(65, 'y', y, 0), 0), z, 0));
                            return J$.X1(105, J$.Rt(97, J$.R(89, 'x', x, 0)));
                        } catch (J$e) {
                            J$.Ex(201, J$e);
                        } finally {
                            if (J$.Fr(209))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(193, 'sliceMe', J$.T(185, sliceMe, 12, false, 113), 0);
            J$.X1(169, J$.F(161, J$.R(153, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(217, J$e);
        } finally {
            if (J$.Sr(225)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
