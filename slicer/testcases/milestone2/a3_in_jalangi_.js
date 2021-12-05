J$.iids = {"9":[3,9,3,10],"10":[4,9,4,14],"17":[3,9,3,10],"18":[5,9,5,14],"25":[3,5,3,11],"33":[4,9,4,10],"41":[4,13,4,14],"49":[4,9,4,14],"57":[4,5,4,15],"65":[5,9,5,10],"73":[5,13,5,14],"81":[5,9,5,14],"89":[5,5,5,15],"97":[6,12,6,13],"105":[6,12,6,13],"113":[6,5,6,14],"121":[1,1,7,2],"129":[1,1,7,2],"137":[1,1,7,2],"145":[1,1,7,2],"153":[1,1,7,2],"161":[9,1,9,8],"169":[9,1,9,10],"177":[9,1,9,11],"185":[1,1,9,11],"193":[1,1,7,2],"201":[1,1,9,11],"209":[1,1,7,2],"217":[1,1,7,2],"225":[1,1,9,11],"233":[1,1,9,11],"nBranches":0,"originalCodeFileName":"/home/v/coding/slicing/slicer/testcases/milestone2/a3_in.js","instrumentedCodeFileName":"/home/v/coding/slicing/slicer/testcases/milestone2/a3_in_jalangi_.js","code":"function sliceMe() {\n    var x, y, z;\n    x = 1;\n    y = 2 + x;\n    z = 3 + x;\n    return x;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(185, '/home/v/coding/slicing/slicer/testcases/milestone2/a3_in_jalangi_.js', '/home/v/coding/slicing/slicer/testcases/milestone2/a3_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(121, arguments.callee, this, arguments);
                            arguments = J$.N(129, 'arguments', arguments, 4);
                            J$.N(137, 'x', x, 0);
                            J$.N(145, 'y', y, 0);
                            J$.N(153, 'z', z, 0);
                            var x, y, z;
                            J$.X1(25, x = J$.W(17, 'x', J$.T(9, 1, 22, false), x, 0));
                            J$.X1(57, y = J$.W(49, 'y', J$.B(10, '+', J$.T(33, 2, 22, false), J$.R(41, 'x', x, 0), 0), y, 0));
                            J$.X1(89, z = J$.W(81, 'z', J$.B(18, '+', J$.T(65, 3, 22, false), J$.R(73, 'x', x, 0), 0), z, 0));
                            return J$.X1(113, J$.Rt(105, J$.R(97, 'x', x, 0)));
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
            sliceMe = J$.N(201, 'sliceMe', J$.T(193, sliceMe, 12, false, 121), 0);
            J$.X1(177, J$.F(169, J$.R(161, 'sliceMe', sliceMe, 1), 0)());
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
