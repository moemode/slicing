J$.iids = {"9":[3,9,3,10],"10":[6,12,6,17],"17":[3,9,3,10],"25":[3,5,3,11],"33":[4,9,4,10],"41":[4,9,4,10],"49":[4,5,4,11],"57":[5,9,5,15],"65":[5,9,5,15],"73":[5,5,5,16],"81":[6,12,6,13],"89":[6,16,6,17],"97":[6,12,6,17],"105":[6,5,6,18],"113":[1,1,7,2],"121":[1,1,7,2],"129":[1,1,7,2],"137":[1,1,7,2],"145":[1,1,7,2],"153":[9,1,9,8],"161":[9,1,9,10],"169":[9,1,9,11],"177":[1,1,9,11],"185":[1,1,7,2],"193":[1,1,9,11],"201":[1,1,7,2],"209":[1,1,7,2],"217":[1,1,9,11],"225":[1,1,9,11],"nBranches":0,"originalCodeFileName":"/home/v/slicing/slicer/testcases/milestone2_old/a4_in.js","instrumentedCodeFileName":"/home/v/slicing/slicer/testcases/milestone2_old/a4_in_jalangi_.js","code":"function sliceMe() {\n    var a, b, c;\n    a = 1;\n    b = 2;\n    c = 'test';\n    return 1 + 2;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(177, '/home/v/slicing/slicer/testcases/milestone2_old/a4_in_jalangi_.js', '/home/v/slicing/slicer/testcases/milestone2_old/a4_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(113, arguments.callee, this, arguments);
                            arguments = J$.N(121, 'arguments', arguments, 4);
                            J$.N(129, 'a', a, 0);
                            J$.N(137, 'b', b, 0);
                            J$.N(145, 'c', c, 0);
                            var a, b, c;
                            J$.X1(25, a = J$.W(17, 'a', J$.T(9, 1, 22, false), a, 0));
                            J$.X1(49, b = J$.W(41, 'b', J$.T(33, 2, 22, false), b, 0));
                            J$.X1(73, c = J$.W(65, 'c', J$.T(57, 'test', 21, false), c, 0));
                            return J$.X1(105, J$.Rt(97, J$.B(10, '+', J$.T(81, 1, 22, false), J$.T(89, 2, 22, false), 0)));
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
