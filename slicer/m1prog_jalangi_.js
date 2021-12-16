J$.iids = {"8":[5,9,5,15],"9":[2,13,2,14],"10":[5,9,5,15],"17":[2,13,2,14],"18":[6,13,6,18],"25":[2,13,2,14],"33":[4,5,4,12],"41":[4,17,4,30],"49":[4,5,4,31],"51":[4,5,4,16],"57":[4,5,4,32],"65":[5,9,5,10],"73":[5,13,5,15],"81":[6,13,6,14],"89":[6,17,6,18],"97":[6,13,6,18],"105":[6,9,6,19],"113":[7,9,7,10],"121":[7,9,7,10],"129":[7,5,7,11],"137":[8,12,8,13],"145":[8,12,8,13],"153":[8,5,8,14],"161":[1,1,9,2],"169":[1,1,9,2],"177":[1,1,9,2],"185":[1,1,9,2],"193":[10,1,10,8],"201":[10,1,10,10],"209":[10,1,10,11],"217":[1,1,11,1],"225":[1,1,9,2],"233":[1,1,11,1],"241":[5,5,6,19],"249":[1,1,9,2],"257":[1,1,9,2],"265":[1,1,11,1],"273":[1,1,11,1],"nBranches":2,"originalCodeFileName":"/home/v/slicing/slicer/m1prog.js","instrumentedCodeFileName":"/home/v/slicing/slicer/m1prog_jalangi_.js","code":"function sliceMe() {\n    var x = 5;\n    var y;\n    console.log(\"Hello World\");\n    if (x < 10)\n        x = x + 5;\n    y = 0;\n    return y;\n}\nsliceMe();\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(217, '/home/v/slicing/slicer/m1prog_jalangi_.js', '/home/v/slicing/slicer/m1prog.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(161, arguments.callee, this, arguments);
                            arguments = J$.N(169, 'arguments', arguments, 4);
                            J$.N(177, 'x', x, 0);
                            J$.N(185, 'y', y, 0);
                            var x = J$.X1(25, J$.W(17, 'x', J$.T(9, 5, 22, false), x, 1));
                            var y;
                            J$.X1(57, J$.M(49, J$.R(33, 'console', console, 2), 'log', 0)(J$.T(41, "Hello World", 21, false)));
                            if (J$.X1(241, J$.C(8, J$.B(10, '<', J$.R(65, 'x', x, 0), J$.T(73, 10, 22, false), 0))))
                                J$.X1(105, x = J$.W(97, 'x', J$.B(18, '+', J$.R(81, 'x', x, 0), J$.T(89, 5, 22, false), 0), x, 0));
                            J$.X1(129, y = J$.W(121, 'y', J$.T(113, 0, 22, false), y, 0));
                            return J$.X1(153, J$.Rt(145, J$.R(137, 'y', y, 0)));
                        } catch (J$e) {
                            J$.Ex(249, J$e);
                        } finally {
                            if (J$.Fr(257))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(233, 'sliceMe', J$.T(225, sliceMe, 12, false, 161), 0);
            J$.X1(209, J$.F(201, J$.R(193, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(265, J$e);
        } finally {
            if (J$.Sr(273)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
